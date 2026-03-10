"""
test_contact_handler.py — Unit Tests for contact_handler.py
============================================================
Tests the contact form Lambda entrypoint (contact_handler.lambda_handler)
in isolation. All AWS services and the ContactAgent are mocked.

Test coverage:
  - Valid submission returns 200 with success message
  - Missing name/email/message returns 400
  - Invalid email format returns 400
  - Message too long returns 400
  - Agent success + SES failure still saves to DynamoDB and returns 200
  - Agent exception returns 500
  - CORS headers present on all responses
  - Visitor name appears in success message
"""

import json
from unittest.mock import MagicMock, patch

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))

import contact_handler


class TestContactHandlerValidation:
    """Tests for input validation in contact lambda_handler."""

    def test_returns_400_when_name_missing(self, api_gateway_event):
        """Missing name should return HTTP 400."""
        event = api_gateway_event({"email": "jane@example.com", "message": "Hello"})
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400
        body = json.loads(response["body"])
        assert "required" in body["error"].lower()

    def test_returns_400_when_email_missing(self, api_gateway_event):
        """Missing email should return HTTP 400."""
        event = api_gateway_event({"name": "Jane", "message": "Hello"})
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400

    def test_returns_400_when_message_missing(self, api_gateway_event):
        """Missing message should return HTTP 400."""
        event = api_gateway_event({"name": "Jane", "email": "jane@example.com"})
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400

    def test_returns_400_for_invalid_email_format(self, api_gateway_event):
        """Invalid email format should return HTTP 400."""
        event = api_gateway_event(
            {"name": "Jane", "email": "not-an-email", "message": "Hello"}
        )
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400
        body = json.loads(response["body"])
        assert "email" in body["error"].lower()

    def test_returns_400_for_message_exceeding_max_length(self, api_gateway_event):
        """Message over 2000 characters should return HTTP 400."""
        event = api_gateway_event(
            {"name": "Jane", "email": "jane@example.com", "message": "x" * 2001}
        )
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400
        body = json.loads(response["body"])
        assert "2000" in body["error"]

    def test_returns_400_for_invalid_json(self):
        """Non-JSON body should return HTTP 400."""
        event = {"body": "bad json", "requestContext": {}}
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 400


class TestContactHandlerSuccess:
    """Tests for successful contact form submissions."""

    @patch("contact_handler.process_contact")
    def test_returns_200_on_successful_submission(
        self, mock_process, api_gateway_event, sample_contact
    ):
        """Valid form data should return HTTP 200 with confirmation message."""
        mock_process.return_value = {
            "success": True,
            "message_id": "ses-msg-123",
            "record_id": "uuid-abc-123",
        }

        event = api_gateway_event(sample_contact)
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 200
        body = json.loads(response["body"])
        assert "message" in body
        assert "Jane" in body["message"]
        assert "jane@example.com" in body["message"]

    @patch("contact_handler.process_contact")
    def test_returns_200_even_when_email_fails(
        self, mock_process, api_gateway_event, sample_contact
    ):
        """Submission saved to DynamoDB but SES failed — still return 200."""
        mock_process.return_value = {
            "success": False,
            "message_id": None,
            "record_id": "uuid-abc-456",
        }

        event = api_gateway_event(sample_contact)
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 200

    @patch("contact_handler.process_contact")
    def test_process_contact_called_with_correct_args(
        self, mock_process, api_gateway_event, sample_contact
    ):
        """process_contact must receive exactly the fields from the form."""
        mock_process.return_value = {
            "success": True,
            "message_id": "x",
            "record_id": "y",
        }

        event = api_gateway_event(sample_contact)
        contact_handler.lambda_handler(event, MagicMock())

        mock_process.assert_called_once_with(
            name="Jane Doe",
            email="jane@example.com",
            message="I'd like to discuss a QA automation role at our company.",
        )


class TestContactHandlerErrors:
    """Tests for error handling in contact lambda_handler."""

    @patch("contact_handler.process_contact")
    def test_returns_500_on_unexpected_exception(
        self, mock_process, api_gateway_event, sample_contact
    ):
        """Unhandled exception must return HTTP 500 without exposing details."""
        mock_process.side_effect = Exception("Database connection lost")

        event = api_gateway_event(sample_contact)
        response = contact_handler.lambda_handler(event, MagicMock())

        assert response["statusCode"] == 500
        body = json.loads(response["body"])
        assert "Database connection lost" not in body["error"]


class TestContactHandlerCORS:
    """Tests for CORS headers on all contact responses."""

    @patch("contact_handler.process_contact")
    def test_cors_headers_on_success(
        self, mock_process, api_gateway_event, sample_contact
    ):
        """CORS headers must be present on 200 responses."""
        mock_process.return_value = {
            "success": True,
            "message_id": "x",
            "record_id": "y",
        }
        event = api_gateway_event(sample_contact)
        response = contact_handler.lambda_handler(event, MagicMock())

        assert "Access-Control-Allow-Origin" in response["headers"]

    def test_cors_headers_on_validation_error(self, api_gateway_event):
        """CORS headers must be present on 400 error responses."""
        event = api_gateway_event({"name": "", "email": "", "message": ""})
        response = contact_handler.lambda_handler(event, MagicMock())

        assert "Access-Control-Allow-Origin" in response["headers"]
