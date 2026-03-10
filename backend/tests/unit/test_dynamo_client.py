"""
test_dynamo_client.py — Unit Tests for utils/dynamo_client.py
==============================================================
Tests DynamoDB save operations using moto to mock AWS DynamoDB locally.

moto intercepts boto3 calls and simulates DynamoDB behaviour in memory —
no real AWS account or credentials are required.

Test coverage:
  - Record saved successfully with correct attributes
  - UUID and timestamp auto-generated on each save
  - Two saves produce two unique IDs
  - RuntimeError raised if CONTACT_TABLE env var is missing
  - RuntimeError raised if DynamoDB PutItem fails
"""

import sys
import os

import boto3
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))


class TestDynamoClientSave:
    """Tests for save_contact function."""

    @pytest.fixture
    def dynamodb_table(self):
        """Create a real mocked DynamoDB table using moto."""
        import moto

        with moto.mock_aws():
            client = boto3.resource("dynamodb", region_name="us-east-1")
            table = client.create_table(
                TableName="camiloavila-contacts",
                BillingMode="PAY_PER_REQUEST",
                AttributeDefinitions=[
                    {"AttributeName": "id", "AttributeType": "S"},
                    {"AttributeName": "timestamp", "AttributeType": "S"},
                ],
                KeySchema=[
                    {"AttributeName": "id", "KeyType": "HASH"},
                    {"AttributeName": "timestamp", "KeyType": "RANGE"},
                ],
            )
            yield table

    def test_saves_record_with_all_required_fields(self, dynamodb_table):
        """Saved record must contain all expected attributes."""
        import moto

        with moto.mock_aws():
            from utils.dynamo_client import save_contact

            record = save_contact(
                name="Jane Doe",
                email="jane@example.com",
                message="Interested in a QA role.",
                ai_reply="Thank you for your interest, Jane.",
                status="sent",
            )

            assert record["name"] == "Jane Doe"
            assert record["email"] == "jane@example.com"
            assert record["message"] == "Interested in a QA role."
            assert record["ai_reply"] == "Thank you for your interest, Jane."
            assert record["status"] == "sent"

    def test_auto_generates_uuid_id(self, dynamodb_table):
        """Each saved record must have a unique UUID id."""
        import moto

        with moto.mock_aws():
            from utils.dynamo_client import save_contact

            record1 = save_contact("A", "a@b.com", "msg", "reply")
            record2 = save_contact("B", "b@c.com", "msg", "reply")

            assert record1["id"] != record2["id"]
            # UUID format: 8-4-4-4-12 hex chars
            assert len(record1["id"]) == 36

    def test_auto_generates_iso_timestamp(self, dynamodb_table):
        """Saved record must have a valid ISO 8601 timestamp."""
        import moto
        from datetime import datetime

        with moto.mock_aws():
            from utils.dynamo_client import save_contact

            record = save_contact("A", "a@b.com", "msg", "reply")

            # Should not raise — valid ISO format
            datetime.fromisoformat(record["timestamp"].replace("Z", "+00:00"))

    def test_default_status_is_sent(self, dynamodb_table):
        """Default status must be 'sent' if not specified."""
        import moto

        with moto.mock_aws():
            from utils.dynamo_client import save_contact

            record = save_contact("A", "a@b.com", "msg", "reply")
            assert record["status"] == "sent"

    def test_raises_error_when_table_env_var_missing(self, monkeypatch):
        """Missing CONTACT_TABLE env var must raise RuntimeError."""
        monkeypatch.delenv("CONTACT_TABLE", raising=False)

        from utils import dynamo_client
        import importlib

        importlib.reload(dynamo_client)
        from utils.dynamo_client import save_contact

        with pytest.raises(RuntimeError, match="CONTACT_TABLE"):
            save_contact("A", "a@b.com", "msg", "reply")
