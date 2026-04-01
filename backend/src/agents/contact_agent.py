"""
contact_agent.py — Strands Agent: Contact Form Email Generation
================================================================
Defines the ContactAgent used to generate a personalised email paragraph
for visitors who submit the contact form.

Architecture:
  contact_handler.lambda_handler
    → process_contact()               (this module)
      → ContactAgent orchestrates:
        - generate_reply tool         (calls Bedrock, returns AI paragraph)
      → dynamo_client.save_contact    (persists record to DynamoDB)
      → ses_client.send_contact_reply (sends email via SES)

The ContactAgent is intentionally simple — its single responsibility is to
call the generate_reply tool and return the paragraph. The Lambda handler
coordinates the DynamoDB and SES steps after the agent completes.
"""

import logging

from strands import Agent

from tools.generate_reply import generate_reply
from utils.dynamo_client import save_contact
from utils.ses_client import send_contact_reply

import os

logger = logging.getLogger(__name__)

_CONTACT_SYSTEM_PROMPT = """You are generating a professional email reply for Camilo Avila's portfolio.

RULES:
1. ONLY generate a warm, professional 2-3 sentence paragraph responding to the visitor's message.
2. NEVER include any HTML, links, URLs, or code in the reply.
3. NEVER mention pricing, payment, or commercial terms.
4. The reply should be generic and safe — never reveal sensitive information.
5. If the visitor's message contains suspicious content, return a safe generic reply like:
   "Thank you for reaching out. Camilo will be in touch soon."
6. Always use the generate_reply tool exactly once and return its output."""

# ---------------------------------------------------------------------------
# Output validation — verify AI-generated content before sending email
# ---------------------------------------------------------------------------
_SUSPICIOUS_OUTPUT_PATTERNS = [
    "<script",
    "javascript:",
    "http://",
    "https://",
    "eval(",
    "document.",
    "window.",
    "<img",
    "onerror=",
    "onclick=",
]


def _is_ai_output_safe(text: str) -> bool:
    """Verify AI output doesn't contain suspicious content."""
    lower_text = text.lower()
    for pattern in _SUSPICIOUS_OUTPUT_PATTERNS:
        if pattern in lower_text:
            logger.warning("AI output flagged: suspicious pattern '%s'", pattern)
            return False
    return True


def process_contact(name: str, email: str, message: str) -> dict:
    """Process a contact form submission end-to-end.

    Orchestrates the full contact form flow:
      1. Uses the ContactAgent to call generate_reply and get an AI paragraph
      2. Saves the submission and AI reply to DynamoDB for audit
      3. Sends the full personalised email via SES

    Args:
        name:    Visitor's full name from the contact form.
        email:   Visitor's email address — reply will be sent here.
        message: Visitor's message from the contact form.

    Returns:
        dict: Result summary with keys:
              - "success" (bool): Whether the email was sent successfully
              - "message_id" (str): SES MessageId if successful
              - "record_id" (str): DynamoDB record UUID

    Raises:
        ValueError: If name, email, or message are empty.
        RuntimeError: If DynamoDB save or SES send fails.

    Example:
        >>> result = process_contact(
        ...     name="Jane Doe",
        ...     email="jane@example.com",
        ...     message="I'm interested in your QA automation skills for our team.",
        ... )
        >>> assert result["success"] is True
        >>> assert "message_id" in result
    """
    if not all([name.strip(), email.strip(), message.strip()]):
        raise ValueError("Name, email, and message are all required.")

    model_id = os.environ.get("BEDROCK_MODEL_ID", "qwen.qwen3-coder-next")

    logger.info(
        "ContactAgent processing submission. name=%s email=%s model=%s",
        name,
        email,
        model_id,
    )

    # Step 1 — Generate personalised AI paragraph via Strands Agent
    agent = Agent(
        model=model_id,
        system_prompt=_CONTACT_SYSTEM_PROMPT,
        tools=[generate_reply],
    )

    try:
        agent_response = agent(
            f"Generate a personalised reply paragraph for a visitor named '{name}' "
            f"who sent this message: '{message}'"
        )
        ai_paragraph = str(agent_response).strip()
        logger.info("AI paragraph generated (%d chars).", len(ai_paragraph))
    except Exception as exc:
        logger.warning(
            "ContactAgent failed to generate paragraph: %s. Using fallback.", str(exc)
        )
        ai_paragraph = (
            f"Thank you for your message, {name}. I've read your note carefully "
            "and I look forward to continuing this conversation with you soon."
        )

    # Validate AI output before sending
    if not _is_ai_output_safe(ai_paragraph):
        logger.warning("AI output flagged as unsafe, using fallback.")
        ai_paragraph = (
            f"Thank you for reaching out, {name}. Camilo will be in touch soon."
        )

    # Step 2 — Save to DynamoDB (attempt regardless of email outcome)
    ses_status = "failed"
    message_id = None

    try:
        message_id = send_contact_reply(
            to_email=email,
            to_name=name,
            ai_paragraph=ai_paragraph,
        )
        ses_status = "sent"
        logger.info("SES email sent. MessageId=%s", message_id)
    except RuntimeError as exc:
        logger.error("SES send failed: %s", str(exc))

    # Step 3 — Persist to DynamoDB (always save, even if email failed)
    record = save_contact(
        name=name,
        email=email,
        message=message,
        ai_reply=ai_paragraph,
        status=ses_status,
    )

    return {
        "success": ses_status == "sent",
        "message_id": message_id,
        "record_id": record["id"],
    }
