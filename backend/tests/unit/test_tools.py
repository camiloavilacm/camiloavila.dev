"""
test_tools.py — Unit Tests for Strands Tools
=============================================
Tests for all three Strands Agent tools:
  - search_resume      (tools/search_resume.py)
  - get_contact_info   (tools/get_contact_info.py)
  - generate_reply     (tools/generate_reply.py)

Tools are tested by calling their underlying Python functions directly —
the @tool decorator from Strands is transparent to unit tests.

Test coverage:
  - search_resume returns knowledge base content
  - search_resume content contains expected resume data
  - get_contact_info returns all required contact fields
  - get_contact_info returns correct email and phone
  - generate_reply calls Bedrock and returns a paragraph
  - generate_reply returns fallback paragraph if Bedrock fails
  - generate_reply fallback includes visitor name
"""

import sys
import os
from unittest.mock import MagicMock, patch

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))


class TestSearchResumeTool:
    """Tests for the search_resume Strands tool."""

    def test_returns_knowledge_base_content(self, mock_kb_content):
        """search_resume must return the full knowledge base text."""
        with patch(
            "tools.search_resume.get_knowledge_base", return_value=mock_kb_content
        ):
            from tools.search_resume import search_resume

            # Strands @tool wraps the function — call the underlying fn directly
            result = (
                search_resume.__wrapped__("AWS certifications")
                if hasattr(search_resume, "__wrapped__")
                else search_resume("AWS certifications")
            )

            assert "Camilo Avila" in result

    def test_result_contains_certifications(self, mock_kb_content):
        """Knowledge base content must include AWS certification data."""
        with patch(
            "tools.search_resume.get_knowledge_base", return_value=mock_kb_content
        ):
            from tools.search_resume import search_resume

            result = (
                search_resume.__wrapped__("certifications")
                if hasattr(search_resume, "__wrapped__")
                else search_resume("certifications")
            )

            assert "AWS Certified Developer" in result
            assert "AI Practitioner" in result

    def test_propagates_kb_loader_error(self):
        """RuntimeError from kb_loader must propagate through search_resume."""
        with patch(
            "tools.search_resume.get_knowledge_base",
            side_effect=RuntimeError("S3 unavailable"),
        ):
            from tools.search_resume import search_resume

            with pytest.raises(RuntimeError, match="S3 unavailable"):
                fn = (
                    search_resume.__wrapped__
                    if hasattr(search_resume, "__wrapped__")
                    else search_resume
                )
                fn("anything")


class TestGetContactInfoTool:
    """Tests for the get_contact_info Strands tool."""

    def test_returns_email_address(self):
        """Contact info must include Camilo's email address."""
        from tools.get_contact_info import get_contact_info

        fn = (
            get_contact_info.__wrapped__
            if hasattr(get_contact_info, "__wrapped__")
            else get_contact_info
        )
        result = fn("visitor asking for email")

        assert "camiloavilainfo@gmail.com" in result

    def test_returns_phone_number(self):
        """Contact info must include Camilo's phone number."""
        from tools.get_contact_info import get_contact_info

        fn = (
            get_contact_info.__wrapped__
            if hasattr(get_contact_info, "__wrapped__")
            else get_contact_info
        )
        result = fn("visitor asking for phone")

        assert "655 524 297" in result

    def test_returns_linkedin_url(self):
        """Contact info must include LinkedIn profile URL."""
        from tools.get_contact_info import get_contact_info

        fn = (
            get_contact_info.__wrapped__
            if hasattr(get_contact_info, "__wrapped__")
            else get_contact_info
        )
        result = fn("visitor asking for LinkedIn")

        assert "linkedin.com/in/camiloavila" in result

    def test_returns_availability(self):
        """Contact info must mention US working hours availability."""
        from tools.get_contact_info import get_contact_info

        fn = (
            get_contact_info.__wrapped__
            if hasattr(get_contact_info, "__wrapped__")
            else get_contact_info
        )
        result = fn("availability")

        assert "US" in result


class TestGenerateReplyTool:
    """Tests for the generate_reply Strands tool."""

    def test_returns_string_paragraph(self):
        """generate_reply must return a non-empty string."""
        mock_response = {
            "output": {
                "message": {
                    "content": [
                        {
                            "text": "Thank you for your interest, Jane. Camilo would love to connect."
                        }
                    ]
                }
            }
        }

        with patch("tools.generate_reply._bedrock_client") as mock_bedrock:
            mock_bedrock.converse.return_value = mock_response

            from tools.generate_reply import generate_reply

            fn = (
                generate_reply.__wrapped__
                if hasattr(generate_reply, "__wrapped__")
                else generate_reply
            )
            result = fn(
                visitor_name="Jane",
                visitor_message="I'm looking for a QA lead.",
            )

            assert isinstance(result, str)
            assert len(result) > 10

    def test_calls_bedrock_with_visitor_context(self):
        """Bedrock must be called with visitor name and message in the prompt."""
        mock_response = {
            "output": {"message": {"content": [{"text": "Personalised reply here."}]}}
        }

        with patch("tools.generate_reply._bedrock_client") as mock_bedrock:
            mock_bedrock.converse.return_value = mock_response

            from tools.generate_reply import generate_reply

            fn = (
                generate_reply.__wrapped__
                if hasattr(generate_reply, "__wrapped__")
                else generate_reply
            )
            fn(visitor_name="Alice", visitor_message="Interested in your AWS skills.")

            call_args = mock_bedrock.converse.call_args
            # Visitor name and message must appear in the user message
            user_content = call_args.kwargs["messages"][0]["content"][0]["text"]
            assert "Alice" in user_content
            assert "AWS skills" in user_content

    def test_returns_fallback_paragraph_on_bedrock_failure(self):
        """If Bedrock fails, generate_reply must return a fallback paragraph."""
        with patch("tools.generate_reply._bedrock_client") as mock_bedrock:
            mock_bedrock.converse.side_effect = Exception("Bedrock timeout")

            from tools.generate_reply import generate_reply

            fn = (
                generate_reply.__wrapped__
                if hasattr(generate_reply, "__wrapped__")
                else generate_reply
            )
            result = fn(visitor_name="Bob", visitor_message="Hello")

            assert isinstance(result, str)
            assert len(result) > 10

    def test_fallback_paragraph_includes_visitor_name(self):
        """Fallback paragraph must reference the visitor's name."""
        with patch("tools.generate_reply._bedrock_client") as mock_bedrock:
            mock_bedrock.converse.side_effect = Exception("Error")

            from tools.generate_reply import generate_reply

            fn = (
                generate_reply.__wrapped__
                if hasattr(generate_reply, "__wrapped__")
                else generate_reply
            )
            result = fn(visitor_name="Carlos", visitor_message="Hi")

            assert "Carlos" in result
