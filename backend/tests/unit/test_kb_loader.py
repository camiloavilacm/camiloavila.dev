"""
test_kb_loader.py — Unit Tests for utils/kb_loader.py
=====================================================
Tests the S3 knowledge base loader and its in-memory caching behaviour.

Key behaviours tested:
  - Content is fetched from S3 on cold start
  - Content is cached and S3 is NOT called again on warm invocations
  - Cache can be cleared (for test isolation)
  - RuntimeError raised if KNOWLEDGE_BUCKET env var is missing
  - RuntimeError raised if S3 GetObject fails (access denied, not found)
"""

import sys
import os
from unittest.mock import MagicMock, patch

import pytest
import allure

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../src"))

from utils import kb_loader


@pytest.fixture(autouse=True)
def clear_kb_cache():
    """Clear the knowledge base in-memory cache before every test.

    This ensures tests are isolated — a cached value from one test
    does not affect the next.
    """
    kb_loader.clear_cache()
    yield
    kb_loader.clear_cache()


@allure.epic("Knowledge Base")
@allure.feature("S3 Loader")
class TestKbLoaderFetch:
    """Tests for S3 fetch behaviour."""

    def test_fetches_content_from_s3_on_cold_start(self, mock_kb_content):
        """On first call, content must be fetched from S3."""
        mock_body = MagicMock()
        mock_body.read.return_value = mock_kb_content.encode("utf-8")

        with patch.object(kb_loader._s3_client, "get_object") as mock_get:
            mock_get.return_value = {"Body": mock_body}

            result = kb_loader.get_knowledge_base()

            assert result == mock_kb_content
            mock_get.assert_called_once_with(
                Bucket="test-kb-bucket", Key="knowledge_base.md"
            )

    def test_returns_cached_content_on_warm_invocation(self, mock_kb_content):
        """After first fetch, S3 must NOT be called again within the same context."""
        mock_body = MagicMock()
        mock_body.read.return_value = mock_kb_content.encode("utf-8")

        with patch.object(kb_loader._s3_client, "get_object") as mock_get:
            mock_get.return_value = {"Body": mock_body}

            # First call — fetches from S3
            kb_loader.get_knowledge_base()
            # Second and third calls — should use cache
            kb_loader.get_knowledge_base()
            kb_loader.get_knowledge_base()

            # S3 must have been called exactly once despite 3 invocations
            assert mock_get.call_count == 1

    def test_cache_cleared_by_clear_cache(self, mock_kb_content):
        """After clear_cache(), next call must fetch from S3 again."""
        mock_body = MagicMock()
        mock_body.read.return_value = mock_kb_content.encode("utf-8")

        with patch.object(kb_loader._s3_client, "get_object") as mock_get:
            mock_get.return_value = {"Body": mock_body}

            kb_loader.get_knowledge_base()  # First fetch
            kb_loader.clear_cache()  # Clear cache
            kb_loader.get_knowledge_base()  # Should fetch again

            assert mock_get.call_count == 2


class TestKbLoaderErrors:
    """Tests for error handling in kb_loader."""

    def test_raises_runtime_error_when_bucket_env_var_missing(self, monkeypatch):
        """Missing KNOWLEDGE_BUCKET env var must raise RuntimeError."""
        monkeypatch.delenv("KNOWLEDGE_BUCKET", raising=False)

        with pytest.raises(RuntimeError, match="KNOWLEDGE_BUCKET"):
            kb_loader.get_knowledge_base()

    def test_raises_runtime_error_on_s3_client_error(self):
        """S3 ClientError must be re-raised as RuntimeError."""
        from botocore.exceptions import ClientError

        error_response = {"Error": {"Code": "NoSuchKey", "Message": "Not found"}}
        client_error = ClientError(error_response, "GetObject")

        with patch.object(kb_loader._s3_client, "get_object", side_effect=client_error):
            with pytest.raises(RuntimeError, match="NoSuchKey"):
                kb_loader.get_knowledge_base()

    def test_raises_runtime_error_on_access_denied(self):
        """Access denied S3 error must be re-raised as RuntimeError."""
        from botocore.exceptions import ClientError

        error_response = {"Error": {"Code": "AccessDenied", "Message": "Forbidden"}}
        client_error = ClientError(error_response, "GetObject")

        with patch.object(kb_loader._s3_client, "get_object", side_effect=client_error):
            with pytest.raises(RuntimeError, match="AccessDenied"):
                kb_loader.get_knowledge_base()
