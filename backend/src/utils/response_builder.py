"""
response_builder.py — Shared HTTP Response Builder
=====================================================
Common utility for building API Gateway HTTP responses with
security headers and CORS support.

Used by both handler.py (chat endpoint) and contact_handler.py (contact endpoint).
"""

import json
import os
import logging

logger = logging.getLogger(__name__)

# Security headers applied to all responses
_SECURITY_HEADERS = {
    "Content-Type": "application/json",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
}

_CORS_HEADERS = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def build_response(status_code: int, body: dict) -> dict:
    """Build a standard API Gateway HTTP response with security headers.

    Args:
        status_code: HTTP status code (200, 400, 500, etc.).
        body:        Dictionary to serialise as the JSON response body.

    Returns:
        dict: API Gateway-compatible response object.
    """
    allowed_origin = os.environ.get("ALLOWED_ORIGIN", "https://camiloavila.dev")

    return {
        "statusCode": status_code,
        "headers": {
            **_SECURITY_HEADERS,
            **_CORS_HEADERS,
            "Access-Control-Allow-Origin": allowed_origin,
        },
        "body": json.dumps(body),
    }


def build_error_response(status_code: int, error_message: str) -> dict:
    """Build a standardized error response.

    Args:
        status_code: HTTP status code (400, 500, etc.).
        error_message: Error message to include in response.

    Returns:
        dict: API Gateway error response.
    """
    return build_response(status_code, {"error": error_message})


def build_success_response(data: dict) -> dict:
    """Build a standardized success response.

    Args:
        data: Dictionary of response data.

    Returns:
        dict: API Gateway success response.
    """
    return build_response(200, data)
