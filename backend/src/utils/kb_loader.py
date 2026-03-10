"""
kb_loader.py — S3 Knowledge Base Loader with In-Memory Cache
=============================================================
Loads knowledge_base.md from S3 on Lambda cold start and caches it in
a module-level variable. Subsequent warm invocations reuse the cached
content without making another S3 API call.

Why this matters:
  - Reduces latency on warm invocations (no S3 round-trip)
  - Reduces S3 GET request costs
  - Lambda execution contexts are reused across invocations within the
    same container — the module-level cache persists across those reuses

Environment variables required:
  KNOWLEDGE_BUCKET — S3 bucket name containing knowledge_base.md
  KNOWLEDGE_KEY    — S3 object key (default: knowledge_base.md)
"""

import os
import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

# Module-level cache — persists across warm Lambda invocations
_cached_kb_content: str | None = None

# Initialise S3 client once at module load (also cached across warm invocations)
_s3_client = boto3.client("s3")


def get_knowledge_base() -> str:
    """Return the knowledge base content, loading from S3 if not yet cached.

    On the first invocation (cold start) this fetches knowledge_base.md from S3
    and stores the result in the module-level ``_cached_kb_content`` variable.
    All subsequent calls within the same Lambda execution context return the
    cached string without touching S3.

    Returns:
        str: Full text content of knowledge_base.md.

    Raises:
        RuntimeError: If KNOWLEDGE_BUCKET environment variable is not set.
        RuntimeError: If the S3 object cannot be fetched (access denied, not found, etc.).

    Example:
        >>> content = get_knowledge_base()
        >>> assert "Camilo Avila" in content
    """
    global _cached_kb_content

    if _cached_kb_content is not None:
        logger.debug("Knowledge base served from in-memory cache.")
        return _cached_kb_content

    bucket = os.environ.get("KNOWLEDGE_BUCKET")
    key = os.environ.get("KNOWLEDGE_KEY", "knowledge_base.md")

    if not bucket:
        raise RuntimeError(
            "KNOWLEDGE_BUCKET environment variable is not set. "
            "Check the Lambda environment configuration in template.yaml."
        )

    logger.info("Cold start: loading knowledge base from s3://%s/%s", bucket, key)

    try:
        response = _s3_client.get_object(Bucket=bucket, Key=key)
        _cached_kb_content = response["Body"].read().decode("utf-8")
        logger.info(
            "Knowledge base loaded successfully (%d characters).",
            len(_cached_kb_content),
        )
        return _cached_kb_content

    except ClientError as exc:
        error_code = exc.response["Error"]["Code"]
        logger.error(
            "Failed to fetch knowledge base from S3. Code: %s | Bucket: %s | Key: %s",
            error_code,
            bucket,
            key,
        )
        raise RuntimeError(
            f"Could not load knowledge base from S3 (error: {error_code}). "
            "Ensure the Lambda execution role has s3:GetObject on the bucket."
        ) from exc


def clear_cache() -> None:
    """Reset the in-memory knowledge base cache.

    Useful in unit tests to force a fresh S3 fetch between test cases.
    Not intended for use in production code.

    Example:
        >>> clear_cache()
        >>> assert _cached_kb_content is None
    """
    global _cached_kb_content
    _cached_kb_content = None
    logger.debug("Knowledge base cache cleared.")
