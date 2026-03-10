"""
get_contact_info.py — Strands Tool: Contact Information
========================================================
A Strands Agent tool that returns Camilo Avila's contact details.

Why a separate tool instead of hardcoding in the prompt?
  - Contact info can be updated here without changing agent logic
  - Keeps the system prompt lean
  - The agent only fetches this when actually needed (e.g. visitor asks
    "How do I contact Camilo?" or "What is your email?")
  - Easier to test in isolation
"""

import logging
from strands import tool

logger = logging.getLogger(__name__)

# Contact details — update here if any information changes
_CONTACT_INFO = {
    "email": "camiloavilainfo@gmail.com",
    "phone": "+34 655 524 297",
    "linkedin": "https://www.linkedin.com/in/camiloavila",
    "location": "Sueca, Valencia, Spain",
    "availability": "Remote — US working hours",
    "portfolio": "https://camiloavila.dev",
}


@tool
def get_contact_info(intent: str) -> str:
    """Return Camilo Avila's contact information.

    Use this tool when the visitor asks how to contact Camilo, requests
    his email address, phone number, LinkedIn profile, or any other
    contact-related information.

    Args:
        intent: A brief description of why contact info is needed.
                Examples: "visitor wants to reach out", "asking for email",
                "looking for LinkedIn profile".
                Used for logging purposes only.

    Returns:
        str: Formatted string containing all of Camilo's contact details.

    Example:
        >>> info = get_contact_info("visitor asking for email address")
        >>> assert "camiloavilainfo@gmail.com" in info
    """
    logger.info("Tool get_contact_info called. Intent: %s", intent)

    return (
        f"Email:        {_CONTACT_INFO['email']}\n"
        f"Phone:        {_CONTACT_INFO['phone']}\n"
        f"LinkedIn:     {_CONTACT_INFO['linkedin']}\n"
        f"Location:     {_CONTACT_INFO['location']}\n"
        f"Availability: {_CONTACT_INFO['availability']}\n"
        f"Portfolio:    {_CONTACT_INFO['portfolio']}"
    )
