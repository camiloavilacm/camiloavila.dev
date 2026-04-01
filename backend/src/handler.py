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

from agents.chatbot_agent import ask
from utils.response_builder import build_response

try:
    from guardrails import Guard

    GUARDRAILS_AVAILABLE = True
except ImportError:
    GUARDRAILS_AVAILABLE = False

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
    "hidden instructions",
    "reveal your",
    "print all",
    # SQL injection patterns
    "drop table",
    "drop tables",
    "--",
    "';",
    "1=1",
    "union select",
    "union all",
    "or 1=1",
]

_OFF_TOPIC_KEYWORDS = [
    "weather",
    "sports",
    "world cup",
    "politics",
    "news",
    "stock price",
    "cryptocurrency",
    "bitcoin",
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


def _validate_with_guardrails(question: str) -> tuple[bool, str]:
    """Validate input using Guardrails AI.

    This is Layer 1 of defense - catches common attack patterns using
    Guardrails AI's built-in validators.

    Args:
        question: The raw question string from the user.

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
        guard.validate(question)
        return True, ""
    except Exception as exc:
        logger.warning("Guardrails validation failed: %s", str(exc))
        return True, ""


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
        return build_response(200, {"message": "OK"})

    logger.info(
        "Chatbot Lambda invoked. RequestId: %s",
        getattr(context, "aws_request_id", "local"),
    )

    # Parse request body
    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        logger.warning("Request body is not valid JSON.")
        return build_response(400, {"error": "Request body must be valid JSON."})

    question = body.get("question", "").strip()

    # Input validation
    if not question:
        return build_response(400, {"error": "Question cannot be empty."})

    if len(question) > 500:
        return build_response(
            400,
            {"error": "Question exceeds maximum length of 500 characters."},
        )

    # Layer 1: Guardrails AI validation
    is_safe_gr, error_msg_gr = _validate_with_guardrails(question)
    if not is_safe_gr:
        logger.info("Question blocked by Guardrails AI.")
        return build_response(
            200,
            {"answer": error_msg_gr or "Your input was flagged by security filters."},
        )

    # Layer 2: Custom pre-validation
    is_safe, error_msg = _is_question_safe(question)
    if not is_safe:
        logger.info("Question blocked by guardrails.")
        return build_response(200, {"answer": error_msg})

    # Delegate to ChatbotAgent
    try:
        answer = ask(question)
        logger.info("Chatbot answered successfully.")
        return build_response(200, {"answer": answer})

    except ValueError as exc:
        logger.warning("Validation error: %s", str(exc))
        return build_response(400, {"error": str(exc)})

    except Exception as exc:
        logger.error("Unexpected error in ChatbotAgent: %s", str(exc), exc_info=True)
        return build_response(
            500,
            {"error": "An unexpected error occurred. Please try again."},
        )
