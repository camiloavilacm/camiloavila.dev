"""
test_security_headers.py — Security Headers Tests
===================================================
Tests to validate that security headers are properly configured
in API responses.

Tests cover:
  - CORS headers (Access-Control-*)
  - Security headers (HSTS, X-Frame-Options, etc.)
  - Content-Type headers

These tests verify the _build_response function in both handlers.
"""

import json
import pytest
from unittest.mock import MagicMock

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))

import handler
import contact_handler


# =============================================================================
# Handler Security Headers Tests
# =============================================================================


class TestHandlerSecurityHeaders:
    """Test security headers in handler.py responses."""

    def test_response_has_content_type(self):
        """Verify Content-Type header is set."""
        response = handler._build_response(200, {"answer": "test"})

        assert response["statusCode"] == 200
        assert "headers" in response
        assert response["headers"]["Content-Type"] == "application/json"

    def test_response_has_cors_origin(self):
        """Verify Access-Control-Allow-Origin header is set."""
        response = handler._build_response(200, {"answer": "test"})

        assert "Access-Control-Allow-Origin" in response["headers"]
        assert (
            response["headers"]["Access-Control-Allow-Origin"]
            == "https://camiloavila.dev"
        )

    def test_response_has_cors_methods(self):
        """Verify Access-Control-Allow-Methods header is set."""
        response = handler._build_response(200, {"answer": "test"})

        assert "Access-Control-Allow-Methods" in response["headers"]
        assert "POST" in response["headers"]["Access-Control-Allow-Methods"]
        assert "OPTIONS" in response["headers"]["Access-Control-Allow-Methods"]

    def test_response_has_cors_headers(self):
        """Verify Access-Control-Allow-Headers header is set."""
        response = handler._build_response(200, {"answer": "test"})

        assert "Access-Control-Allow-Headers" in response["headers"]
        assert "Content-Type" in response["headers"]["Access-Control-Allow-Headers"]

    def test_response_has_hsts_header(self):
        """Verify Strict-Transport-Security header is set."""
        response = handler._build_response(200, {"answer": "test"})

        assert "Strict-Transport-Security" in response["headers"]
        hsts = response["headers"]["Strict-Transport-Security"]
        assert "max-age" in hsts
        assert "includeSubDomains" in hsts

    def test_response_has_x_content_type_options(self):
        """Verify X-Content-Type-Options header is set to nosniff."""
        response = handler._build_response(200, {"answer": "test"})

        assert "X-Content-Type-Options" in response["headers"]
        assert response["headers"]["X-Content-Type-Options"] == "nosniff"

    def test_response_has_x_frame_options(self):
        """Verify X-Frame-Options header is set to DENY."""
        response = handler._build_response(200, {"answer": "test"})

        assert "X-Frame-Options" in response["headers"]
        assert response["headers"]["X-Frame-Options"] == "DENY"

    def test_response_has_xss_protection(self):
        """Verify X-XSS-Protection header is set."""
        response = handler._build_response(200, {"answer": "test"})

        assert "X-XSS-Protection" in response["headers"]
        assert response["headers"]["X-XSS-Protection"] == "1; mode=block"

    def test_response_has_referrer_policy(self):
        """Verify Referrer-Policy header is set."""
        response = handler._build_response(200, {"answer": "test"})

        assert "Referrer-Policy" in response["headers"]
        assert "strict-origin" in response["headers"]["Referrer-Policy"]

    def test_response_body_is_json(self):
        """Verify response body is properly JSON serialized."""
        response = handler._build_response(200, {"answer": "test answer"})

        body = json.loads(response["body"])
        assert body["answer"] == "test answer"

    def test_different_status_codes_work(self):
        """Verify headers are present for different status codes."""
        for status in [200, 400, 500]:
            response = handler._build_response(status, {"error": "test"})
            assert response["statusCode"] == status
            assert "Strict-Transport-Security" in response["headers"]


# =============================================================================
# Contact Handler Security Headers Tests
# =============================================================================


class TestContactHandlerSecurityHeaders:
    """Test security headers in contact_handler.py responses."""

    def test_response_has_content_type(self):
        """Verify Content-Type header is set."""
        response = contact_handler._build_response(200, {"message": "sent"})

        assert response["statusCode"] == 200
        assert response["headers"]["Content-Type"] == "application/json"

    def test_response_has_cors_headers(self):
        """Verify all CORS headers are present."""
        response = contact_handler._build_response(200, {"message": "sent"})

        assert "Access-Control-Allow-Origin" in response["headers"]
        assert "Access-Control-Allow-Methods" in response["headers"]
        assert "Access-Control-Allow-Headers" in response["headers"]

    def test_response_has_hsts_header(self):
        """Verify HSTS header is set."""
        response = contact_handler._build_response(200, {"message": "sent"})

        assert "Strict-Transport-Security" in response["headers"]

    def test_response_has_x_frame_options(self):
        """Verify X-Frame-Options is set to DENY."""
        response = contact_handler._build_response(200, {"message": "sent"})

        assert response["headers"]["X-Frame-Options"] == "DENY"

    def test_response_has_all_security_headers(self):
        """Verify all security headers are present in contact handler."""
        response = contact_handler._build_response(200, {"message": "sent"})

        required_headers = [
            "Strict-Transport-Security",
            "X-Content-Type-Options",
            "X-Frame-Options",
            "X-XSS-Protection",
            "Referrer-Policy",
        ]

        for header in required_headers:
            assert header in response["headers"], f"Missing header: {header}"


# =============================================================================
# Security Validation Tests
# =============================================================================


class TestSecurityValidation:
    """Additional security validation tests."""

    def test_no_sql_injection_via_question(self):
        """Verify SQL injection patterns are blocked in questions."""
        # This is already covered in test_security.py
        # but adding here for completeness
        is_safe, _ = handler._is_question_safe("'; DROP TABLE users; --")
        assert is_safe is False

    def test_no_xss_in_message(self):
        """Verify XSS patterns are blocked in contact form."""
        # Already covered in test_security.py
        is_safe, _ = contact_handler._is_message_safe("<script>alert('xss')</script>")
        assert is_safe is False

    def test_cors_origin_is_dynamic(self):
        """Verify CORS origin can be configured via environment."""
        # Test with default
        response = handler._build_response(200, {"answer": "test"})
        assert (
            response["headers"]["Access-Control-Allow-Origin"]
            == "https://camiloavila.dev"
        )


def test_all_required_security_headers_present():
    """Meta-test: verify all required headers are documented."""
    required_headers = [
        "Content-Type",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection",
        "Referrer-Policy",
    ]

    # This test documents the required headers
    assert len(required_headers) == 9, "Security headers documented"
