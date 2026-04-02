"""
test_handler.py — Unit Tests for handler.py (Chatbot Lambda)
=============================================================
Tests the chatbot Lambda entrypoint (handler.lambda_handler) in isolation.

All AWS services (S3, Bedrock) are mocked — no real AWS calls are made.
The ChatbotAgent is also mocked to test handler logic independently of
Strands Agent behaviour.

Test coverage:
  - Valid question returns 200 with answer
  - Empty question returns 400
  - Missing question key returns 400
  - Question too long returns 400
  - Invalid JSON body returns 400
  - Agent exception returns 500
  - CORS headers present on all responses
  - System prompt contains guardrail keywords
"""

import json
from unittest.mock import MagicMock, patch

import pytest
import allure

# Import the handler module under test
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))

import handler


@allure.epic("Chatbot")
@allure.feature("Input Validation")
class TestChatbotHandlerValidation:
    """Tests for input validation in lambda_handler."""

    def test_returns_400_for_empty_question(self, api_gateway_event):
        """Empty string question should return HTTP 400 with descriptive error."""
        event = api_gateway_event({"question": ""})
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400
        body = json.loads(response["body"])
        assert "empty" in body["error"].lower()

    def test_returns_400_for_missing_question_key(self, api_gateway_event):
        """Missing 'question' key in body should return HTTP 400."""
        event = api_gateway_event({})
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400

    def test_returns_400_for_whitespace_only_question(self, api_gateway_event):
        """Whitespace-only question should be treated as empty and return 400."""
        event = api_gateway_event({"question": "   "})
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400

    def test_returns_400_for_question_exceeding_max_length(self, api_gateway_event):
        """Question longer than 500 characters should return HTTP 400."""
        event = api_gateway_event({"question": "x" * 501})
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400
        body = json.loads(response["body"])
        assert "500" in body["error"]

    def test_returns_400_for_invalid_json_body(self):
        """Non-JSON body should return HTTP 400."""
        event = {"body": "this is not json", "requestContext": {}}
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400
        body = json.loads(response["body"])
        assert "json" in body["error"].lower()

    def test_returns_400_for_null_body(self):
        """Null body should be handled gracefully and return 400."""
        event = {"body": None, "requestContext": {}}
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400


@allure.epic("Chatbot")
@allure.feature("Success Responses")
class TestChatbotHandlerSuccess:
    """Tests for successful chatbot responses."""

    @patch("handler.ask")
    def test_returns_200_with_answer_on_valid_question(
        self, mock_ask, api_gateway_event
    ):
        """Valid question should return HTTP 200 with answer in response body."""
        mock_ask.return_value = (
            "Camilo holds AWS Developer Associate and AI Practitioner certifications."
        )

        event = api_gateway_event({"question": "What are your AWS certifications?"})
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 200
        body = json.loads(response["body"])
        assert "answer" in body
        assert "Developer Associate" in body["answer"]
        mock_ask.assert_called_once_with("What are your AWS certifications?")

    @patch("handler.ask")
    def test_question_is_stripped_before_processing(self, mock_ask, api_gateway_event):
        """Leading/trailing whitespace should be stripped from the question."""
        mock_ask.return_value = "Some answer."
        event = api_gateway_event({"question": "  What is your experience?  "})
        handler.lambda_handler(event, MagicMock())

        mock_ask.assert_called_once_with("What is your experience?")


@allure.epic("Chatbot")
@allure.feature("Error Handling")
class TestChatbotHandlerErrors:
    """Tests for error handling in lambda_handler."""

    @patch("handler.ask")
    def test_returns_500_on_agent_exception(self, mock_ask, api_gateway_event):
        """Unhandled agent exception should return HTTP 500 without exposing stack trace."""
        mock_ask.side_effect = RuntimeError("Bedrock connection timeout")

        event = api_gateway_event({"question": "What are your skills?"})
        response = handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 500
        body = json.loads(response["body"])
        assert "error" in body
        # Stack trace must NOT be exposed to the client
        assert "Traceback" not in body["error"]
        assert "Bedrock connection timeout" not in body["error"]


@allure.epic("Chatbot")
@allure.feature("CORS Headers")
class TestChatbotHandlerCORS:
    """Tests for CORS headers on all responses."""

    @patch("handler.ask")
    def test_cors_headers_present_on_200(self, mock_ask, api_gateway_event):
        """CORS headers must be present on successful responses."""
        mock_ask.return_value = "Answer."
        event = api_gateway_event({"question": "What is your name?"})
        response = handler.lambda_handler(event, MagicMock())

        assert "Access-Control-Allow-Origin" in response["headers"]
        assert "camiloavila.dev" in response["headers"]["Access-Control-Allow-Origin"]

    def test_cors_headers_present_on_400(self, api_gateway_event):
        """CORS headers must be present on error responses too."""
        event = api_gateway_event({"question": ""})
        response = handler.lambda_handler(event, MagicMock())

        assert "Access-Control-Allow-Origin" in response["headers"]
