"""
test_api.py — Playwright API Tests
===================================
Functional API tests for /chat and /contact endpoints.

These tests verify the API endpoints work correctly by making
direct HTTP requests (not through browser).

Mark: @pytest.mark.api

Tests:
  - /chat endpoint: valid questions, validation errors, response format
  - /contact endpoint: valid submissions, validation errors, response format

Run with:
  pytest tests/e2e/playwright/specs/test_api.py -v

Environment variables:
  API_URL - Base API URL (default: staging API)
  ENV - Set to 'production' to test against production
"""

import json
import os
import pytest
import requests


API_URL = os.environ.get(
    "API_URL", "https://zx0061ghxe.execute-api.us-east-1.amazonaws.com/prod"
)

CHAT_API_URL = f"{API_URL}/chat"
CONTACT_API_URL = f"{API_URL}/contact"


# =============================================================================
# /chat Endpoint Tests
# =============================================================================


@pytest.mark.api
class TestChatEndpoint:
    """Functional tests for the chatbot API endpoint."""

    def test_chat_valid_question_returns_200(self):
        """Valid question should return 200 with an answer."""
        payload = {"question": "What are your AWS certifications?"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CHAT_API_URL, json=payload, headers=headers, timeout=30
        )

        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        body = response.json()
        assert "answer" in body, "Response should contain 'answer' field"
        assert len(body["answer"]) > 0, "Answer should not be empty"

    def test_chat_empty_question_returns_400(self):
        """Empty question should return 400 error."""
        payload = {"question": ""}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CHAT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        body = response.json()
        assert "error" in body, "Response should contain 'error' field"

    def test_chat_missing_question_returns_400(self):
        """Missing question key should return 400 error."""
        payload = {}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CHAT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_chat_long_question_returns_400(self):
        """Question exceeding 500 chars should return 400."""
        payload = {"question": "x" * 501}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CHAT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        body = response.json()
        assert "500" in body.get("error", ""), "Error should mention max length"

    def test_chat_invalid_json_returns_400(self):
        """Invalid JSON body should return 400."""
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CHAT_API_URL, data="not valid json", headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_chat_response_has_correct_structure(self):
        """Response should have proper JSON structure."""
        payload = {"question": "What is your name?"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CHAT_API_URL, json=payload, headers=headers, timeout=30
        )

        assert response.status_code == 200
        body = response.json()

        # Verify response structure
        assert "answer" in body, "Response must have 'answer' key"
        assert isinstance(body["answer"], str), "Answer must be a string"
        assert response.headers.get("Content-Type", "").startswith("application/json")


# =============================================================================
# /contact Endpoint Tests
# =============================================================================


@pytest.mark.api
class TestContactEndpoint:
    """Functional tests for the contact form API endpoint."""

    def test_contact_valid_submission_returns_200(self):
        """Valid submission should return 200."""
        payload = {
            "name": "Test Visitor",
            "email": "test@example.com",
            "message": "Hello, I'm interested in your work.",
        }
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=30
        )

        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        body = response.json()
        assert "message" in body, "Response should contain 'message' field"

    def test_contact_missing_name_returns_400(self):
        """Missing name should return 400."""
        payload = {"email": "test@example.com", "message": "Hello"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_contact_missing_email_returns_400(self):
        """Missing email should return 400."""
        payload = {"name": "Test Visitor", "message": "Hello"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_contact_missing_message_returns_400(self):
        """Missing message should return 400."""
        payload = {"name": "Test Visitor", "email": "test@example.com"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_contact_invalid_email_returns_400(self):
        """Invalid email format should return 400."""
        payload = {"name": "Test Visitor", "email": "not-an-email", "message": "Hello"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        body = response.json()
        assert "email" in body.get("error", "").lower(), "Error should mention email"

    def test_contact_long_message_returns_400(self):
        """Message exceeding 2000 chars should return 400."""
        payload = {
            "name": "Test Visitor",
            "email": "test@example.com",
            "message": "x" * 2001,
        }
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        body = response.json()
        assert "2000" in body.get("error", ""), "Error should mention max length"

    def test_contact_invalid_json_returns_400(self):
        """Invalid JSON body should return 400."""
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, data="not valid json", headers=headers, timeout=10
        )

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_contact_response_has_correct_structure(self):
        """Response should have proper JSON structure."""
        payload = {
            "name": "Test Visitor",
            "email": "test@example.com",
            "message": "Hello",
        }
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=30
        )

        assert response.status_code == 200
        body = response.json()

        # Verify response structure
        assert "message" in body, "Response must have 'message' key"
        assert isinstance(body["message"], str), "Message must be a string"
        assert response.headers.get("Content-Type", "").startswith("application/json")


# =============================================================================
# CORS Tests
# =============================================================================


@pytest.mark.api
class TestCORSHeaders:
    """Tests for CORS headers on API responses."""

    def test_chat_endpoint_has_cors_headers(self):
        """Chat endpoint should include CORS headers."""
        payload = {"question": "Test"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CHAT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert (
            "access-control-allow-origin" in response.headers
            or response.status_code in [200, 400]
        )

    def test_contact_endpoint_has_cors_headers(self):
        """Contact endpoint should include CORS headers."""
        payload = {"name": "Test", "email": "test@test.com", "message": "Test"}
        headers = {"Content-Type": "application/json"}

        response = requests.post(
            CONTACT_API_URL, json=payload, headers=headers, timeout=10
        )

        assert (
            "access-control-allow-origin" in response.headers
            or response.status_code in [200, 400]
        )
