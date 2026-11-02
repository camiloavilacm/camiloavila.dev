"""
test_ses_client.py — Unit Tests for utils/ses_client.py
=====================================================
Tests the SES email sending wrapper using moto to mock AWS SES locally.

Test coverage:
  - Email sent with correct To/From/Subject
  - Subject includes visitor's name
  - Body includes AI paragraph
  - Body includes Camilo's contact details (email, phone, LinkedIn)
  - RuntimeError raised if SES_SENDER_EMAIL env var is missing
  - RuntimeError raised if SES send_email fails
  - MessageId returned on success
"""

import os
import sys
from unittest.mock import patch

import boto3
import moto
import pytest
import allure

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))


@pytest.fixture
def mock_ses():
    """Create a mocked SES client with verified sender."""
    with moto.mock_aws():
        client = boto3.client("ses", region_name="us-east-1")
        client.verify_email_identity(EmailAddress="camiloavilainfo@gmail.com")
        yield client


@allure.epic("Email")
@allure.feature("SES Operations")
class TestSesClientSend:
    """Tests for send_contact_reply function."""

    def test_returns_message_id_on_success(self, mock_ses):
        """Successful send must return a non-empty MessageId string."""
        with patch("utils.ses_client._ses_client", mock_ses):
            from utils import ses_client
            import importlib

            importlib.reload(ses_client)
            from utils.ses_client import send_contact_reply

            msg_id = send_contact_reply(
                to_email="visitor@example.com",
                to_name="Jane",
                ai_paragraph="Based on your message, Camilo would be a great fit.",
            )

            assert msg_id is not None
            assert len(msg_id) > 0

    def test_subject_contains_visitor_name_and_camilo_avila(self, mock_ses):
        """Email subject must include the visitor's name and Camilo Avila."""
        with patch("utils.ses_client._ses_client", mock_ses):
            from utils import ses_client
            import importlib

            importlib.reload(ses_client)
            from utils.ses_client import send_contact_reply

            with patch("utils.ses_client._ses_client") as mock_ses_client:
                mock_ses_client.send_email.return_value = {"MessageId": "test-id"}

                send_contact_reply(
                    to_email="visitor@example.com",
                    to_name="Jane",
                )

                call_args = mock_ses_client.send_email.call_args
                subject = call_args.kwargs["Message"]["Subject"]["Data"]
                assert "Jane" in subject
                assert "Camilo Avila" in subject

    def test_body_contains_opening_and_camilo_introduction(self):
        """Email body must include greeting and introduction."""
        from utils.ses_client import send_contact_reply

        with patch("utils.ses_client._ses_client") as mock_ses:
            mock_ses.send_email.return_value = {"MessageId": "test-id"}

            send_contact_reply(
                to_email="visitor@example.com",
                to_name="Jane",
            )

            call_args = mock_ses.send_email.call_args
            text_body = call_args.kwargs["Message"]["Body"]["Text"]["Data"]
            assert "Hi Jane" in text_body
            assert "Senior QA Automation Engineer" in text_body

    def test_body_contains_camilo_contact_details(self):
        """Email body footer must include Camilo's contact info and website."""
        from utils.ses_client import send_contact_reply

        with patch("utils.ses_client._ses_client") as mock_ses:
            mock_ses.send_email.return_value = {"MessageId": "test-id"}

            send_contact_reply(
                to_email="visitor@example.com",
                to_name="Jane",
            )

            call_args = mock_ses.send_email.call_args
            text_body = call_args.kwargs["Message"]["Body"]["Text"]["Data"]
            assert "contact@camiloavila.dev" in text_body
            assert "https://www.camiloavila.dev" in text_body
            assert "+34 655 524 297" in text_body
            assert "linkedin.com/in/camiloavila" in text_body
            assert call_args.kwargs.get("ReplyToAddresses") == ["contact@camiloavila.dev"]

    def test_raises_error_when_ses_sender_env_var_missing(self, monkeypatch):
        """Missing SES_SENDER_EMAIL env var must raise RuntimeError."""
        monkeypatch.delenv("SES_SENDER_EMAIL", raising=False)

        from utils import ses_client
        import importlib

        importlib.reload(ses_client)
        from utils.ses_client import send_contact_reply

        with pytest.raises(RuntimeError, match="SES_SENDER_EMAIL"):
            send_contact_reply("a@b.com", "Jane", "paragraph")

    def test_raises_runtime_error_on_ses_client_error(self):
        """SES ClientError must be re-raised as RuntimeError."""
        from botocore.exceptions import ClientError
        from utils.ses_client import send_contact_reply

        error_response = {
            "Error": {"Code": "MessageRejected", "Message": "Not verified"}
        }

        with patch("utils.ses_client._ses_client") as mock_ses:
            mock_ses.send_email.side_effect = ClientError(error_response, "SendEmail")

            with pytest.raises(RuntimeError, match="MessageRejected"):
                send_contact_reply("a@b.com", "Jane", "paragraph")


@allure.epic("Email")
@allure.feature("Owner Notification")
class TestSesOwnerNotification:
    """Tests for send_owner_notification function."""

    def test_owner_notification_returns_message_id_and_sets_fields(self):
        """Owner notification must set ToAddresses, ReplyTo, and return MessageId."""
        from utils.ses_client import send_owner_notification

        with patch("utils.ses_client._ses_client") as mock_ses:
            mock_ses.send_email.return_value = {"MessageId": "owner-msg-123"}

            msg_id = send_owner_notification(
                visitor_name="Alice Recruiter",
                visitor_email="alice@techcorp.com",
                visitor_message="We'd like to interview you for a Senior QA role.",
                ai_reply="Thank you for considering me.",
            )

            assert msg_id == "owner-msg-123"
            call_args = mock_ses.send_email.call_args
            assert call_args.kwargs["Destination"]["ToAddresses"] == ["camiloavilainfo@gmail.com"]
            assert call_args.kwargs["ReplyToAddresses"] == ["alice@techcorp.com"]
            subject = call_args.kwargs["Message"]["Subject"]["Data"]
            assert "Alice Recruiter" in subject
            text_body = call_args.kwargs["Message"]["Body"]["Text"]["Data"]
            assert "Alice Recruiter" in text_body
            assert "alice@techcorp.com" in text_body
            assert "Senior QA role" in text_body

    def test_owner_notification_raises_error_when_sender_missing(self, monkeypatch):
        """Missing SES_SENDER_EMAIL must raise RuntimeError."""
        monkeypatch.delenv("SES_SENDER_EMAIL", raising=False)
        from utils.ses_client import send_owner_notification

        with pytest.raises(RuntimeError, match="SES_SENDER_EMAIL"):
            send_owner_notification("Alice", "alice@example.com", "Hello", "Reply")
