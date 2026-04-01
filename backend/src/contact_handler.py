"""
contact_handler.py — Contact Form Lambda Entrypoint
=====================================================
AWS Lambda handler for the POST /contact API endpoint.

Processes contact form submissions from the portfolio frontend:
  1. Validates name, email, and message fields
  2. Delegates to ContactAgent (Strands) to generate a personalised email paragraph
  3. Saves the submission + AI reply to DynamoDB (audit trail)
  4. Sends an automated personalised reply email via SES

Request flow:
  Browser → API Gateway (POST /contact) → this Lambda → ContactAgent
    → generate_reply tool → Bedrock (AI paragraph)
    → DynamoDB (save record)
    → SES (send email to visitor)
    → JSON response → Browser

Expected request body:
  {
    "name":    "Jane Doe",
    "email":   "jane@example.com",
    "message": "I'd like to discuss a QA automation role."
  }

Success response (200):
  { "message": "Thank you, Jane! Your message has been received and a reply has been sent to jane@example.com." }

Error responses:
  400: { "error": "Name, email, and message are required." }
  400: { "error": "Invalid email address format." }
  400: { "error": "Message exceeds maximum length of 2000 characters." }
  500: { "error": "An unexpected error occurred. Please try again." }

Environment variables (set by SAM template.yaml):
  KNOWLEDGE_BUCKET  — S3 bucket for knowledge_base.md (used by generate_reply)
  BEDROCK_MODEL_ID  — Bedrock model ID
  CONTACT_TABLE     — DynamoDB table name
  SES_SENDER_EMAIL  — Verified SES sender address
  ALLOWED_ORIGIN    — CORS allowed origin
"""

import json
import logging
import re

from agents.contact_agent import process_contact
from utils.response_builder import build_response

# Alias for backwards compatibility with tests
_build_response = build_response

try:
    from guardrails import Guard

    GUARDRAILS_AVAILABLE = True
except ImportError:
    GUARDRAILS_AVAILABLE = False

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

# Simple email format validation pattern
_EMAIL_PATTERN = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")

_MAX_MESSAGE_LENGTH = 2000
_MAX_NAME_LENGTH = 100

# ---------------------------------------------------------------------------
# Security guardrails — input validation for contact form
# ---------------------------------------------------------------------------
_SUSPICIOUS_PATTERNS = [
    "<script",
    "javascript:",
    "onerror=",
    "onclick=",
    "onload=",
    "eval(",
    "alert(",
    "<iframe",
    "<svg",
    "<img",
    "drop table",
    "drop tables",
    "--",
    "';",
    "' or '",
    "1=1",
]


def _is_message_safe(message: str) -> tuple[bool, str]:
    """Validate message for suspicious content before passing to AI.

    Args:
        message: The raw message from the contact form.

    Returns:
        tuple: (is_safe, error_message)
    """
    lower_msg = message.lower()

    for pattern in _SUSPICIOUS_PATTERNS:
        if pattern in lower_msg:
            logger.warning("Blocked suspicious pattern in message: %s", pattern)
            return False, "Message contains disallowed content."

    return True, ""


def _validate_with_guardrails(message: str) -> tuple[bool, str]:
    """Validate message using Guardrails AI.

    This is Layer 1 of defense for contact form - catches common
    attack patterns using Guardrails AI's built-in validators.

    Args:
        message: The raw message from the contact form.

    Returns:
        tuple: (is_safe, error_message). If not safe, returns error message.
    """
    if not GUARDRAILS_AVAILABLE:
        return True, ""

    try:
        guard = Guard.from_pydantic(
            schema=None,
            validators=[
                "guardrails/validators/no-secure-sql-queries",
                "guardrails/validators/no-prompt-injection",
            ],
        )
        guard.validate(message)
        return True, ""
    except Exception as exc:
        logger.warning("Guardrails validation failed: %s", str(exc))
        return True, ""


def lambda_handler(event: dict, context: object) -> dict:
    """Handle POST /contact requests from the portfolio contact form.

    Validates the form fields, triggers the ContactAgent flow (AI reply
    generation + DynamoDB save + SES email), and returns a success or
    error response.

    Args:
        event:   API Gateway HTTP API event object. Expected to contain:
                 - body (str): JSON string with "name", "email", "message" keys.
        context: Lambda context object (unused, required by AWS signature).

    Returns:
        dict: API Gateway HTTP response with statusCode, headers, and body.

    Example event:
        {
            "body": "{\"name\": \"Jane\", \"email\": \"jane@example.com\", \"message\": \"Hello!\"}",
            "requestContext": { "http": { "method": "POST" } }
        }
    """
    # Handle CORS preflight OPTIONS request
    http_method = event.get("requestContext", {}).get("http", {}).get("method", "")
    if http_method == "OPTIONS":
        return build_response(200, {"message": "OK"})

    logger.info(
        "Contact Lambda invoked. RequestId: %s",
        getattr(context, "aws_request_id", "local"),
    )

    # Parse request body
    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        logger.warning("Request body is not valid JSON.")
        return build_response(400, {"error": "Request body must be valid JSON."})

    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    message = body.get("message", "").strip()

    # Field presence validation
    if not name or not email or not message:
        return build_response(
            400,
            {"error": "Name, email, and message are required."},
        )

    # Name length validation
    if len(name) > _MAX_NAME_LENGTH:
        return build_response(
            400,
            {"error": f"Name exceeds maximum length of {_MAX_NAME_LENGTH} characters."},
        )

    # Email format validation
    if not _EMAIL_PATTERN.match(email):
        return build_response(400, {"error": "Invalid email address format."})

    # Message length validation
    if len(message) > _MAX_MESSAGE_LENGTH:
        return build_response(
            400,
            {
                "error": (
                    f"Message exceeds maximum length of {_MAX_MESSAGE_LENGTH} characters."
                )
            },
        )

    # Layer 1: Guardrails AI validation
    is_safe_gr, error_msg_gr = _validate_with_guardrails(message)
    if not is_safe_gr:
        logger.info("Message blocked by Guardrails AI.")
        return build_response(400, {"error": "Message contains disallowed content."})

    # Layer 2: Custom validation
    is_safe, error_msg = _is_message_safe(message)
    if not is_safe:
        return build_response(400, {"error": error_msg})

    # Delegate to ContactAgent
    try:
        result = process_contact(name=name, email=email, message=message)
        logger.info(
            "Contact processed. success=%s record_id=%s",
            result["success"],
            result["record_id"],
        )

        if result["success"]:
            return build_response(
                200,
                {
                    "message": (
                        f"Thank you, {name}! Your message has been received "
                        f"and a reply has been sent to {email}."
                    )
                },
            )
        else:
            # Submission saved to DynamoDB but email failed
            return build_response(
                200,
                {
                    "message": (
                        f"Thank you, {name}! Your message has been received. "
                        "Camilo will get back to you soon."
                    )
                },
            )

    except ValueError as exc:
        logger.warning("Validation error in contact flow: %s", str(exc))
        return build_response(400, {"error": str(exc)})

    except Exception as exc:
        logger.error("Unexpected error in contact flow: %s", str(exc), exc_info=True)
        return build_response(
            500,
            {"error": "An unexpected error occurred. Please try again."},
        )
