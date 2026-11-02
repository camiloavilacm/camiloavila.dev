"""
ses_client.py — Amazon SES Email Sender
========================================
Wraps the boto3 SES send_email call to send automated, personalised reply
emails to visitors who submit the contact form.

Email structure:
  FROM:    camiloavilainfo@gmail.com  (must be SES-verified)
  TO:      visitor's email address
  Subject: Thanks for reaching out, {name}!

  Body:
    [Fixed opening paragraph]
    [AI-generated personalized paragraph — from generate_reply tool]
    [Fixed closing / contact info footer]

Prerequisites:
  1. camiloavilainfo@gmail.com must be verified in AWS SES.
  2. For sending to unverified recipients, SES must be out of sandbox mode.
     Request production access in the SES console.

Environment variables required:
  SES_SENDER_EMAIL — verified sender address (injected by SAM via template.yaml)
"""

import os
import logging

import bleach
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

_ses_client = boto3.client("ses", region_name="us-east-1")

# ---------------------------------------------------------------------------
# Email template components
# Separated into constants so they are easy to update without touching logic.
# ---------------------------------------------------------------------------

_SUBJECT_TEMPLATE = "Thanks for reaching out, {name}!"

_OPENING = """Hi {name},

Thank you so much for visiting my portfolio and taking the time to reach out. \
I really appreciate your interest.

I'm Camilo Avila, a Senior QA Automation Engineer with over 15 years of experience \
in test automation, cloud engineering (AWS), and AI integration. I'm currently \
available for remote roles operating within US working hours.
"""

_FOOTER = """
I look forward to connecting with you. Feel free to reply directly to this email \
or reach me through any of the channels below.

Best regards,
Camilo Avila
Senior QA Automation Engineer

Email:    camiloavilainfo@gmail.com
Phone:    +34 655 524 297
LinkedIn: https://www.linkedin.com/in/camiloavila
Location: Spain (Remote, US working hours)
"""


def send_contact_reply(
    to_email: str,
    to_name: str,
    ai_paragraph: str,
) -> str:
    """Send a personalised reply email to a contact form visitor.

    Combines a fixed opening, an AI-generated paragraph personalised to the
    visitor's message, and a fixed footer with Camilo's contact details.

    Args:
        to_email:     Recipient's email address (the visitor who filled the form).
        to_name:      Recipient's name — used to personalise the subject and greeting.
        ai_paragraph: AI-generated paragraph produced by the generate_reply tool,
                      personalised based on the visitor's original message.

    Returns:
        str: SES MessageId of the sent email (useful for delivery tracking).

    Raises:
        RuntimeError: If SES_SENDER_EMAIL environment variable is not set.
        RuntimeError: If SES fails to send the email (e.g. unverified address,
                      sandbox restrictions, throttling).

    Example:
        >>> msg_id = send_contact_reply(
        ...     to_email="jane@example.com",
        ...     to_name="Jane",
        ...     ai_paragraph="Based on your interest in QA roles...",
        ... )
        >>> assert msg_id.startswith("0")  # SES MessageId format
    """
    sender = os.environ.get("SES_SENDER_EMAIL")
    if not sender:
        raise RuntimeError(
            "SES_SENDER_EMAIL environment variable is not set. "
            "Check the Lambda environment configuration in template.yaml."
        )

    # Sanitize user-provided content before embedding in HTML email
    # bleach.clean() strips all HTML tags, preventing XSS injection
    safe_name = bleach.clean(to_name.strip(), tags=[], strip=True)
    safe_paragraph = bleach.clean(ai_paragraph.strip(), tags=[], strip=True)

    subject = _SUBJECT_TEMPLATE.format(name=safe_name)
    body_text = (
        _OPENING.format(name=safe_name) + "\n" + safe_paragraph + "\n" + _FOOTER
    )

    # HTML version — same content with basic formatting
    body_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <p>Hi <strong>{safe_name}</strong>,</p>
      <p>
        Thank you so much for visiting my portfolio and taking the time to reach out.
        I really appreciate your interest.
      </p>
      <p>
        I'm Camilo Avila, a Senior QA Automation Engineer with over 15 years of experience
        in test automation, cloud engineering (AWS), and AI integration. I'm currently
        available for remote roles operating within US working hours.
      </p>
      <p>{safe_paragraph}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p>
        I look forward to connecting with you. Feel free to reply directly to this email
        or reach me through any of the channels below.
      </p>
      <p>
        Best regards,<br />
        <strong>Camilo Avila</strong><br />
        Senior QA Automation Engineer<br /><br />
        Email: <a href="mailto:camiloavilainfo@gmail.com">camiloavilainfo@gmail.com</a><br />
        Phone: +34 655 524 297<br />
        LinkedIn: <a href="https://www.linkedin.com/in/camiloavila">linkedin.com/in/camiloavila</a><br />
        Location: Spain (Remote, US working hours)
      </p>
    </body>
    </html>
    """

    try:
        response = _ses_client.send_email(
            Source=sender,
            Destination={"ToAddresses": [to_email]},
            ReplyToAddresses=["camiloavilainfo@gmail.com"],
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {
                    "Text": {"Data": body_text, "Charset": "UTF-8"},
                    "Html": {"Data": body_html, "Charset": "UTF-8"},
                },
            },
        )
        message_id = response["MessageId"]
        logger.info(
            "Email sent via SES. MessageId=%s | to=%s",
            message_id,
            to_email,
        )
        return message_id

    except ClientError as exc:
        error_code = exc.response["Error"]["Code"]
        logger.error(
            "SES send_email failed. Code: %s | to=%s | sender=%s",
            error_code,
            to_email,
            sender,
        )
        raise RuntimeError(
            f"Failed to send email via SES (error: {error_code}). "
            "Ensure the sender address is verified and SES is out of sandbox mode."
        ) from exc


def send_owner_notification(
    visitor_name: str,
    visitor_email: str,
    visitor_message: str,
    ai_reply: str,
) -> str:
    """Send an email alert to the site owner notifying them of a new submission.

    Args:
        visitor_name:    Visitor's full name from the contact form.
        visitor_email:   Visitor's email address.
        visitor_message: Raw message submitted by the visitor.
        ai_reply:        Personalized auto-reply generated for the visitor.

    Returns:
        str: SES MessageId of the sent notification email.

    Raises:
        RuntimeError: If SES_SENDER_EMAIL environment variable is not set
                      or SES fails to send the email.
    """
    sender = os.environ.get("SES_SENDER_EMAIL")
    if not sender:
        raise RuntimeError(
            "SES_SENDER_EMAIL environment variable is not set. "
            "Check the Lambda environment configuration in template.yaml."
        )

    owner_email = os.environ.get("OWNER_EMAIL", "camiloavilainfo@gmail.com")

    safe_name = bleach.clean(visitor_name.strip(), tags=[], strip=True)
    safe_email = bleach.clean(visitor_email.strip(), tags=[], strip=True)
    safe_message = bleach.clean(visitor_message.strip(), tags=[], strip=True)
    safe_reply = bleach.clean(ai_reply.strip(), tags=[], strip=True)

    subject = f"New Portfolio Contact: {safe_name}"

    body_text = f"""You have received a new contact form submission on camiloavila.dev.

Visitor Details:
----------------
Name:    {safe_name}
Email:   {safe_email}

Message:
--------
{safe_message}

Automated AI Reply Sent:
------------------------
{safe_reply}

---
Tip: Replying directly to this email will send a reply to {safe_name} ({safe_email}).
"""

    body_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.5;">
      <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 8px;">New Portfolio Contact</h2>
      <p>You received a new submission from your website contact form:</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 120px; background-color: #f8fafc;">From:</td>
          <td style="padding: 8px; background-color: #f8fafc;">{safe_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9;">Email:</td>
          <td style="padding: 8px; background-color: #f1f5f9;"><a href="mailto:{safe_email}">{safe_email}</a></td>
        </tr>
      </table>
      <h3 style="color: #334155; margin-bottom: 8px;">Message:</h3>
      <div style="background-color: #f8fafc; border-left: 4px solid #0d9488; padding: 12px 16px; margin-bottom: 20px; white-space: pre-wrap;">{safe_message}</div>
      <h3 style="color: #334155; margin-bottom: 8px;">Automated AI Reply Sent:</h3>
      <div style="background-color: #f1f5f9; border-left: 4px solid #64748b; padding: 12px 16px; margin-bottom: 20px; font-style: italic; white-space: pre-wrap;">{safe_reply}</div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 13px; color: #64748b;">
        Tip: Replying directly to this email will send your response straight to <strong>{safe_name}</strong> at <strong>{safe_email}</strong>.
      </p>
    </body>
    </html>
    """

    try:
        response = _ses_client.send_email(
            Source=sender,
            Destination={"ToAddresses": [owner_email]},
            ReplyToAddresses=[safe_email],
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {
                    "Text": {"Data": body_text, "Charset": "UTF-8"},
                    "Html": {"Data": body_html, "Charset": "UTF-8"},
                },
            },
        )
        message_id = response["MessageId"]
        logger.info(
            "Owner notification email sent via SES. MessageId=%s | to=%s | visitor=%s",
            message_id,
            owner_email,
            safe_email,
        )
        return message_id

    except ClientError as exc:
        error_code = exc.response["Error"]["Code"]
        logger.error(
            "SES send_email failed for owner notification. Code: %s | owner=%s | sender=%s",
            error_code,
            owner_email,
            sender,
        )
        raise RuntimeError(
            f"Failed to send owner notification via SES (error: {error_code})."
        ) from exc
