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
import os
import re

from agents.contact_agent import process_contact

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


def _build_response(status_code: int, body: dict) -> dict:
    """Build a standard API Gateway HTTP response with CORS headers.

    Args:
        status_code: HTTP status code.
        body:        Dictionary to serialise as the JSON response body.

    Returns:
        dict: API Gateway-compatible response object.
    """
    allowed_origin = os.environ.get("ALLOWED_ORIGIN", "https://camiloavila.dev")
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowed_origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        "body": json.dumps(body),
    }


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
        return _build_response(200, {"message": "OK"})

    logger.info(
        "Contact Lambda invoked. RequestId: %s",
        getattr(context, "aws_request_id", "local"),
    )

    # Parse request body
    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        logger.warning("Request body is not valid JSON.")
        return _build_response(400, {"error": "Request body must be valid JSON."})

    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    message = body.get("message", "").strip()

    # Field presence validation
    if not name or not email or not message:
        return _build_response(
            400,
            {"error": "Name, email, and message are required."},
        )

    # Name length validation
    if len(name) > _MAX_NAME_LENGTH:
        return _build_response(
            400,
            {"error": f"Name exceeds maximum length of {_MAX_NAME_LENGTH} characters."},
        )

    # Email format validation
    if not _EMAIL_PATTERN.match(email):
        return _build_response(400, {"error": "Invalid email address format."})

    # Message length validation
    if len(message) > _MAX_MESSAGE_LENGTH:
        return _build_response(
            400,
            {
                "error": (
                    f"Message exceeds maximum length of {_MAX_MESSAGE_LENGTH} characters."
                )
            },
        )

    # Security guardrails — validate message content
    is_safe, error_msg = _is_message_safe(message)
    if not is_safe:
        return _build_response(400, {"error": error_msg})

    # Delegate to ContactAgent
    try:
        result = process_contact(name=name, email=email, message=message)
        logger.info(
            "Contact processed. success=%s record_id=%s",
            result["success"],
            result["record_id"],
        )

        if result["success"]:
            return _build_response(
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
            return _build_response(
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
        return _build_response(400, {"error": str(exc)})

    except Exception as exc:
        logger.error("Unexpected error in contact flow: %s", str(exc), exc_info=True)
        return _build_response(
            500,
            {"error": "An unexpected error occurred. Please try again."},
        )
