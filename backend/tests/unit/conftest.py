"""
conftest.py — Pytest Configuration and Shared Fixtures
=======================================================
Shared fixtures and configuration for all unit tests in the backend suite.

Fixtures defined here are automatically available to all test files
in this directory without explicit imports.

Fixtures:
  mock_env          — Sets required environment variables for Lambda context
  mock_kb_content   — Sample knowledge base text for testing
  sample_contact    — Sample contact form data dictionary
"""

import os
import pytest


@pytest.fixture(autouse=True)
def mock_env(monkeypatch):
    """Set required environment variables for all Lambda unit tests.

    Uses monkeypatch so environment is restored after each test.
    The autouse=True means this fixture runs for every test automatically.
    """
    monkeypatch.setenv("AWS_DEFAULT_REGION", "us-east-1")
    monkeypatch.setenv("KNOWLEDGE_BUCKET", "test-kb-bucket")
    monkeypatch.setenv("KNOWLEDGE_KEY", "knowledge_base.md")
    monkeypatch.setenv("BEDROCK_MODEL_ID", "qwen.qwen3-coder-next")
    monkeypatch.setenv("CONTACT_TABLE", "camiloavila-contacts")
    monkeypatch.setenv("SES_SENDER_EMAIL", "camiloavilainfo@gmail.com")
    monkeypatch.setenv("ALLOWED_ORIGIN", "https://camiloavila.dev")


@pytest.fixture
def mock_kb_content():
    """Return a minimal knowledge base string for testing.

    Contains enough structure to validate tool behaviour without
    requiring the real knowledge_base.md file.
    """
    return """# Camilo Avila — AI Resume Knowledge Base

## 1. Professional Identity
- Full Name: Camilo Avila
- Current Role: Senior Quality Assurance Automation Engineer
- Location: Spain
- Availability: US working hours

## 4. AWS Certifications
1. AWS Certified Developer – Associate
2. AWS Certified AI Practitioner (AIF-C01)

## 3. Core Technical Skills
### Programming Languages
- Python
- TypeScript
- JavaScript

## 9. Contact Information
- Email: camiloavilainfo@gmail.com
- Phone: +34 655 524 297
- LinkedIn: https://www.linkedin.com/in/camiloavila
"""


@pytest.fixture
def sample_contact():
    """Return a sample contact form submission dictionary."""
    return {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "I'd like to discuss a QA automation role at our company.",
    }


@pytest.fixture
def api_gateway_event():
    """Return a minimal API Gateway HTTP API event factory.

    Returns a callable that accepts a body dict and returns a valid event.

    Example:
        >>> event = api_gateway_event({"question": "What are your skills?"})
    """
    import json

    def _make_event(body: dict) -> dict:
        return {
            "body": json.dumps(body),
            "requestContext": {
                "http": {"method": "POST", "path": "/chat"},
                "requestId": "test-request-id",
            },
            "headers": {"Content-Type": "application/json"},
        }

    return _make_event
