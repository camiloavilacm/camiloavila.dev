"""
test_ses_client.py — Unit Tests for utils/ses_client.py
========================================================
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

import sys
import os

import boto3
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))


class TestSesClientSend:
    """Tests for send_contact_reply function."""

    @pytest.fixture
    def verified_ses(self):
        """Set up mocked SES with a verified sender identity."""
        import moto

        with moto.mock_aws():
            ses = boto3.client("ses", region_name="us-east-1")
            ses.verify_email_identity(EmailAddress="camiloavilainfo@gmail.com")
            yield ses

    def test_returns_message_id_on_success(self, verified_ses):
        """Successful send must return a non-empty MessageId string."""
        import moto

        with moto.mock_aws():
            boto3.client("ses", region_name="us-east-1").verify_email_identity(
                EmailAddress="camiloavilainfo@gmail.com"
            )
            from utils.ses_client import send_contact_reply

            msg_id = send_contact_reply(
                to_email="visitor@example.com",
                to_name="Jane",
                ai_paragraph="Based on your message, Camilo would be a great fit.",
            )

            assert msg_id is not None
            assert len(msg_id) > 0

    def test_subject_contains_visitor_name(self, verified_ses):
        """Email subject must include the visitor's name."""
        import moto
        from unittest.mock import patch, MagicMock

        with moto.mock_aws():
            boto3.client("ses", region_name="us-east-1").verify_email_identity(
                EmailAddress="camiloavilainfo@gmail.com"
            )

            sent_emails = []
            original_send = boto3.client("ses", region_name="us-east-1").send_email

            with patch("utils.ses_client._ses_client") as mock_ses:
                mock_ses.send_email.return_value = {"MessageId": "test-id"}

                from utils.ses_client import send_contact_reply

                send_contact_reply(
                    to_email="visitor@example.com",
                    to_name="Jane",
                    ai_paragraph="AI paragraph here.",
                )

                call_args = mock_ses.send_email.call_args
                subject = call_args.kwargs["Message"]["Subject"]["Data"]
                assert "Jane" in subject

    def test_body_contains_ai_paragraph(self):
        """Email body must include the AI-generated paragraph."""
        from unittest.mock import patch

        with patch("utils.ses_client._ses_client") as mock_ses:
            mock_ses.send_email.return_value = {"MessageId": "test-id"}

            from utils.ses_client import send_contact_reply

            send_contact_reply(
                to_email="visitor@example.com",
                to_name="Jane",
                ai_paragraph="This is the unique AI paragraph for Jane.",
            )

            call_args = mock_ses.send_email.call_args
            text_body = call_args.kwargs["Message"]["Body"]["Text"]["Data"]
            assert "This is the unique AI paragraph for Jane." in text_body

    def test_body_contains_camilo_contact_details(self):
        """Email body footer must include Camilo's contact info."""
        from unittest.mock import patch

        with patch("utils.ses_client._ses_client") as mock_ses:
            mock_ses.send_email.return_value = {"MessageId": "test-id"}

            from utils.ses_client import send_contact_reply

            send_contact_reply(
                to_email="visitor@example.com",
                to_name="Jane",
                ai_paragraph="Some paragraph.",
            )

            call_args = mock_ses.send_email.call_args
            text_body = call_args.kwargs["Message"]["Body"]["Text"]["Data"]
            assert "camiloavilainfo@gmail.com" in text_body
            assert "+34 655 524 297" in text_body
            assert "linkedin.com/in/camiloavila" in text_body

    def test_raises_error_when_ses_sender_env_var_missing(self, monkeypatch):
        """Missing SES_SENDER_EMAIL env var must raise RuntimeError."""
        monkeypatch.delenv("SES_SENDER_EMAIL", raising=False)

        from utils.ses_client import send_contact_reply

        with pytest.raises(RuntimeError, match="SES_SENDER_EMAIL"):
            send_contact_reply("a@b.com", "Jane", "paragraph")

    def test_raises_runtime_error_on_ses_client_error(self):
        """SES ClientError must be re-raised as RuntimeError."""
        from unittest.mock import patch
        from botocore.exceptions import ClientError

        error_response = {
            "Error": {"Code": "MessageRejected", "Message": "Not verified"}
        }

        with patch("utils.ses_client._ses_client") as mock_ses:
            mock_ses.send_email.side_effect = ClientError(error_response, "SendEmail")

            from utils.ses_client import send_contact_reply

            with pytest.raises(RuntimeError, match="MessageRejected"):
                send_contact_reply("a@b.com", "Jane", "paragraph")
