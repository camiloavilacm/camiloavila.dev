"""
handler.py — Chatbot Lambda Entrypoint
=======================================
AWS Lambda handler for the POST /chat API endpoint.

This is the entry point for all chatbot requests from the portfolio frontend.
It validates the incoming request, delegates to the ChatbotAgent (Strands),
and returns a JSON response with the answer.

Request flow:
  Browser → API Gateway (POST /chat) → this Lambda → ChatbotAgent
    → search_resume tool + get_contact_info tool
    → Bedrock Converse API (qwen.qwen3-coder-next)
    → JSON response → Browser

Expected request body:
  { "question": "What are your AWS certifications?" }

Success response (200):
  { "answer": "Camilo holds two AWS certifications: ..." }

Error responses:
  400: { "error": "Question cannot be empty." }
  400: { "error": "Question exceeds maximum length of 500 characters." }
  500: { "error": "An unexpected error occurred. Please try again." }

CORS:
  Allowed origin is set to https://camiloavila.dev (+ localhost for local dev).
  The OPTIONS preflight is handled by API Gateway directly.

Environment variables (set by SAM template.yaml):
  KNOWLEDGE_BUCKET  — S3 bucket name for knowledge_base.md
  KNOWLEDGE_KEY     — S3 object key (default: knowledge_base.md)
  BEDROCK_MODEL_ID  — Bedrock model ID (default: qwen.qwen3-coder-next)
  ALLOWED_ORIGIN    — CORS allowed origin (default: https://camiloavila.dev)
"""

import json
import logging
import os

from agents.chatbot_agent import ask

# Configure structured logging — visible in CloudWatch Logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Security guardrails — pre-validation before passing to AI
# ---------------------------------------------------------------------------
_INJECTION_PATTERNS = [
    "ignore previous",
    "disregard",
    "system prompt",
    "new instructions",
    "override",
    "you are now",
    "forget everything",
    "roleplay as",
    "pretend to be",
    "ignore all",
    "disregard instructions",
    "bypass",
    "jailbreak",
    " DAN ",
    "developer mode",
    "enable developer",
]

_OFF_TOPIC_KEYWORDS = [
    "weather",
    "sports",
    "politics",
    "news",
    "stock price",
    "cryptocurrency",
    "celebrity",
    "movie",
    "music",
    "recipe",
    "health advice",
    "medical",
    "religion",
    "gambling",
    "lottery",
    "sex",
    "porn",
    "adult",
]


def _is_question_safe(question: str) -> tuple[bool, str]:
    """Validate question before passing to the AI agent.

    This is the first layer of defense — catches prompt injection attempts
    and off-topic questions before they reach the Bedrock model.

    Args:
        question: The raw question string from the user.

    Returns:
        tuple: (is_safe, error_message). If not safe, returns the error
               message to return to the user.
    """
    lower_q = question.lower()

    for pattern in _INJECTION_PATTERNS:
        if pattern in lower_q:
            logger.warning("Blocked injection pattern: %s", pattern)
            return (
                False,
                "I can only answer questions about Camilo Avila's resume and professional background.",
            )

    for keyword in _OFF_TOPIC_KEYWORDS:
        if keyword in lower_q:
            logger.warning("Blocked off-topic keyword: %s", keyword)
            return (
                False,
                "I can only answer questions about Camilo Avila's resume and professional background. For other inquiries, contact Camilo directly at camiloavilainfo@gmail.com",
            )

    return True, ""


def _build_response(status_code: int, body: dict) -> dict:
    """Build a standard API Gateway HTTP response with CORS headers.

    Args:
        status_code: HTTP status code (200, 400, 500, etc.).
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
    """Handle POST /chat requests from the portfolio chatbot widget.

    Parses the incoming API Gateway event, validates the question,
    runs it through the ChatbotAgent, and returns the answer.

    Args:
        event:   API Gateway HTTP API event object. Expected to contain:
                 - body (str): JSON string with a "question" key.
        context: Lambda context object (unused, but required by AWS signature).

    Returns:
        dict: API Gateway HTTP response with statusCode, headers, and body.

    Raises:

    Example event:
        {
            "body": "{\"question\": \"What are your AWS certifications?\"}",
            "requestContext": { "http": { "method": "POST" } }
        }
    """
    # Handle CORS preflight OPTIONS request
    http_method = event.get("requestContext", {}).get("http", {}).get("method", "")
    if http_method == "OPTIONS":
        return _build_response(200, {"message": "OK"})

    logger.info(
        "Chatbot Lambda invoked. RequestId: %s",
        getattr(context, "aws_request_id", "local"),
    )

    # Parse request body
    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        logger.warning("Request body is not valid JSON.")
        return _build_response(400, {"error": "Request body must be valid JSON."})

    question = body.get("question", "").strip()

    # Input validation
    if not question:
        return _build_response(400, {"error": "Question cannot be empty."})

    if len(question) > 500:
        return _build_response(
            400,
            {"error": "Question exceeds maximum length of 500 characters."},
        )

    # Security guardrails — pre-validation
    is_safe, error_msg = _is_question_safe(question)
    if not is_safe:
        logger.info("Question blocked by guardrails.")
        return _build_response(200, {"answer": error_msg})

    # Delegate to ChatbotAgent
    try:
        answer = ask(question)
        logger.info("Chatbot answered successfully.")
        return _build_response(200, {"answer": answer})

    except ValueError as exc:
        logger.warning("Validation error: %s", str(exc))
        return _build_response(400, {"error": str(exc)})

    except Exception as exc:
        logger.error("Unexpected error in ChatbotAgent: %s", str(exc), exc_info=True)
        return _build_response(
            500,
            {"error": "An unexpected error occurred. Please try again."},
        )
