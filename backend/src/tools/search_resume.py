"""
search_resume.py — Strands Tool: Resume Search
===============================================
A Strands Agent tool that retrieves relevant sections from knowledge_base.md
based on the user's query topic.

How it works:
  1. The Strands Agent decides to call this tool when it needs resume information.
  2. The tool loads the full knowledge base (from cache or S3).
  3. It returns the full content — the LLM then extracts the relevant parts.

Design note:
  For a production RAG system with a large knowledge base, this tool would
  use vector embeddings and similarity search (e.g. Amazon OpenSearch or
  FAISS). For this portfolio use case, the knowledge base is small enough
  that passing the full document to the LLM context window is sufficient
  and simpler to maintain.

  If the knowledge base grows beyond ~50KB, consider upgrading to:
    - Amazon Bedrock Knowledge Bases (managed RAG service)
    - LangChain with FAISS + S3 for vector storage
"""

import logging
from strands import tool
from utils.kb_loader import get_knowledge_base

logger = logging.getLogger(__name__)


@tool
def search_resume(query: str) -> str:
    """Search Camilo Avila's resume for information related to a query.

    This tool loads the full resume knowledge base and returns its content
    so the agent can answer questions about Camilo's professional background,
    skills, work experience, certifications, education, and projects.

    Use this tool whenever the user asks about:
      - Work experience or specific companies
      - Technical skills, programming languages, or tools
      - AWS certifications or cloud knowledge
      - Education or qualifications
      - Personal projects or automation work
      - Availability or location
      - Languages spoken

    Args:
        query: The topic or question to look up in the resume.
               Examples: "AWS certifications", "work experience in Argentina",
               "Python skills", "availability for US hours".

    Returns:
        str: Full content of the knowledge base as a structured text document.
             The agent uses this to formulate a precise, contextual answer.

    Raises:
        RuntimeError: If the knowledge base cannot be loaded from S3.

    Example:
        >>> result = search_resume("AWS certifications")
        >>> assert "AWS Certified Developer" in result
    """
    logger.info("Tool search_resume called with query: %s", query)
    kb_content = get_knowledge_base()
    logger.debug("Knowledge base returned %d characters.", len(kb_content))
    return kb_content
