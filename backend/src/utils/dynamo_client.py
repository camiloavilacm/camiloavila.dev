"""
dynamo_client.py — DynamoDB Client for Contact Form Persistence
===============================================================
Provides helper functions for saving and retrieving contact form submissions
from the ContactTable DynamoDB table.

Table schema:
  Partition key: id        (String — UUID v4)
  Sort key:      timestamp (String — ISO 8601 UTC)

Attributes stored per item:
  id         — UUID generated at Lambda invocation time
  timestamp  — ISO 8601 UTC string (e.g. "2026-03-10T14:30:00Z")
  name       — Visitor's full name (from form)
  email      — Visitor's email address (from form)
  message    — Visitor's message body (from form)
  ai_reply   — AI-generated paragraph sent in the email (for audit trail)
  status     — "sent" | "failed" — reflects SES delivery outcome

Environment variables required:
  CONTACT_TABLE — DynamoDB table name (injected by SAM via template.yaml)
"""

import os
import logging
import uuid
from datetime import datetime, timezone
from typing import TypedDict

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

_dynamodb = boto3.resource("dynamodb")


class ContactRecord(TypedDict):
    """Type definition for a contact form submission record."""

    id: str
    timestamp: str
    name: str
    email: str
    message: str
    ai_reply: str
    status: str


def save_contact(
    name: str,
    email: str,
    message: str,
    ai_reply: str,
    status: str = "sent",
) -> ContactRecord:
    """Save a contact form submission to DynamoDB.

    Generates a UUID as the partition key and an ISO 8601 UTC timestamp as
    the sort key. The record includes the AI-generated reply for audit purposes.

    Args:
        name:     Visitor's full name from the contact form.
        email:    Visitor's email address from the contact form.
        message:  Visitor's message body from the contact form.
        ai_reply: AI-generated personalized paragraph included in the email.
        status:   Delivery status — "sent" if SES succeeded, "failed" otherwise.
                  Defaults to "sent".

    Returns:
        ContactRecord: The full record as stored in DynamoDB, including the
        generated id and timestamp.

    Raises:
        RuntimeError: If CONTACT_TABLE environment variable is not set.
        RuntimeError: If the DynamoDB PutItem operation fails.

    Example:
        >>> record = save_contact(
        ...     name="Jane Doe",
        ...     email="jane@example.com",
        ...     message="I'd like to discuss a QA role.",
        ...     ai_reply="Based on your message, Camilo would be a great fit...",
        ... )
        >>> assert record["status"] == "sent"
    """
    table_name = os.environ.get("CONTACT_TABLE")
    if not table_name:
        raise RuntimeError(
            "CONTACT_TABLE environment variable is not set. "
            "Check the Lambda environment configuration in template.yaml."
        )

    record: ContactRecord = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "name": name,
        "email": email,
        "message": message,
        "ai_reply": ai_reply,
        "status": status,
    }

    table = _dynamodb.Table(table_name)

    try:
        table.put_item(Item=record)
        logger.info(
            "Contact saved to DynamoDB. id=%s email=%s status=%s",
            record["id"],
            email,
            status,
        )
        return record

    except ClientError as exc:
        error_code = exc.response["Error"]["Code"]
        logger.error(
            "Failed to save contact to DynamoDB. Code: %s | email: %s",
            error_code,
            email,
        )
        raise RuntimeError(
            f"Could not save contact record to DynamoDB (error: {error_code})."
        ) from exc
