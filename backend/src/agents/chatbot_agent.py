"""
chatbot_agent.py — Strands Agent: Resume Q&A Chatbot
======================================================
Defines the ChatbotAgent used to answer visitor questions about
Camilo Avila's professional background.

Architecture:
  handler.lambda_handler
    → create_chatbot_agent()          (this module)
      → Strands Agent orchestrates:
        - search_resume tool          (loads KB, returns full document)
        - get_contact_info tool       (returns contact details on request)
      → Bedrock Converse API (qwen.qwen3-coder-next)
        → returns final answer string

Guardrail policy:
  The system prompt strictly limits the agent to answering questions about
  Camilo's resume only. Off-topic questions receive a polite refusal.

Strands Agents documentation:
  https://strandsagents.dev
"""

import os
import logging

from strands import Agent, tool

from tools.search_resume import search_resume
from tools.get_contact_info import get_contact_info

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# System prompt — defines the agent's identity, scope, and guardrails
# ---------------------------------------------------------------------------
_CHATBOT_SYSTEM_PROMPT = """You are the AI Resume Assistant for Camilo Avila's portfolio website (camiloavila.dev).

Your ONLY purpose is to answer questions about Camilo Avila's professional background using the 
information provided by the search_resume tool.

RULES:
1. ONLY answer questions related to Camilo's resume, skills, experience, certifications, 
   education, projects, availability, or contact information.
2. ALWAYS use the search_resume tool to retrieve information before answering.
3. If the visitor asks for contact details, use the get_contact_info tool.
4. If a question is unrelated to Camilo's professional background, respond with:
   "I can only answer questions about Camilo Avila's resume and professional background. 
    For other inquiries, feel free to contact Camilo directly at camiloavilainfo@gmail.com."
5. Never make up information not present in the knowledge base.
6. Keep answers concise and professional.
7. You may answer in the same language the visitor uses (Spanish, English, French, Portuguese)."""


def create_chatbot_agent() -> Agent:
    """Create and return a configured Strands Agent for resume Q&A.

    The agent is initialised with:
      - The resume guardrail system prompt
      - Two tools: search_resume and get_contact_info
      - The Bedrock model configured via BEDROCK_MODEL_ID environment variable

    Returns:
        Agent: A configured Strands Agent instance ready to receive questions.

    Example:
        >>> agent = create_chatbot_agent()
        >>> response = agent("What are Camilo's AWS certifications?")
        >>> assert "Developer Associate" in str(response)
    """
    model_id = os.environ.get("BEDROCK_MODEL_ID", "qwen.qwen3-coder-next")

    logger.info("Initialising ChatbotAgent with model: %s", model_id)

    agent = Agent(
        model=model_id,
        system_prompt=_CHATBOT_SYSTEM_PROMPT,
        tools=[search_resume, get_contact_info],
    )

    return agent


def ask(question: str) -> str:
    """Run a question through the ChatbotAgent and return the answer string.

    This is the main entry point called by handler.lambda_handler.
    Creates a fresh agent per invocation to avoid state leakage between
    concurrent Lambda executions.

    Args:
        question: The visitor's question string from the POST /chat request body.

    Returns:
        str: The agent's final answer as plain text.

    Raises:
        ValueError: If question is empty or whitespace-only.
        RuntimeError: If the agent fails to produce a response.

    Example:
        >>> answer = ask("What programming languages does Camilo know?")
        >>> assert "Python" in answer
    """
    if not question or not question.strip():
        raise ValueError("Question cannot be empty.")

    if len(question) > 500:
        raise ValueError("Question exceeds maximum length of 500 characters.")

    agent = create_chatbot_agent()

    logger.info("ChatbotAgent processing question (%d chars).", len(question))

    try:
        response = agent(question.strip())
        # Strands Agent returns an AgentResult — extract the text content
        answer = str(response)
        logger.info("ChatbotAgent response ready (%d chars).", len(answer))
        return answer

    except Exception as exc:
        logger.error("ChatbotAgent failed: %s", str(exc))
        raise RuntimeError(
            "The assistant encountered an error processing your question. Please try again."
        ) from exc
