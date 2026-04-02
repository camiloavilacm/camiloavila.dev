"""
test_functional.py — Playwright Functional Tests
=================================================
Functional tests verify end-to-end user flows against the live site.
They test chatbot interaction and contact form submission through the
full stack (React → API Gateway → Lambda → Bedrock / DynamoDB / SES).

These tests are slower than smoke tests (30-60s) because they make
real API calls to Bedrock.

Marks: @pytest.mark.functional

Test flows:
  Chatbot:
    - Opening the widget
    - Asking a resume-related question and receiving an answer
    - Asking an off-topic question and receiving a refusal

  Contact form:
    - Client-side validation errors
    - Successful form submission and success state
"""

import pytest
from playwright.sync_api import Page, expect


@pytest.mark.functional
class TestChatbotFunctional:
    """Functional tests for the AI Resume Chatbot widget."""

    def test_chatbot_panel_opens_on_click(self, page: Page):
        """Chatbot is always visible (inline), so just check it's visible.

        Steps:
            1. Assert the chat panel is visible.

        Asserts:
            Chatbot input element is visible.
        """
        chat_input = page.get_by_test_id("chat-input")
        expect(chat_input).to_be_visible()

    def test_welcome_message_displayed_on_open(self, page: Page):
        """Opening the chat must show the welcome greeting message.

        Steps:
            1. Assert the first AI message contains expected greeting text.

        Asserts:
            At least one AI message bubble is visible containing 'Resume Assistant'.
        """
        first_ai_msg = page.get_by_test_id("message-ai").first
        expect(first_ai_msg).to_be_visible()
        expect(first_ai_msg).to_contain_text("Resume Assistant")

    def test_chatbot_answers_aws_certification_question(self, page: Page):
        """Chatbot must return AWS certification info when asked.

        Steps:
            1. Type question about AWS certifications.
            2. Submit.
            3. Wait for AI response containing 'Developer Associate'.

        Asserts:
            AI response contains 'Developer Associate' within 30 seconds.

        Note:
            30s timeout accounts for Bedrock cold start on Lambda.
        """
        page.get_by_test_id("chat-input").fill("What are your AWS certifications?")
        page.get_by_test_id("chat-send").click()

        # Wait for AI response — 30s timeout for Bedrock
        ai_messages = page.get_by_test_id("message-ai")
        expect(ai_messages.last).to_contain_text("Developer Associate", timeout=30000)

    def test_chatbot_answers_programming_language_question(self, page: Page):
        """Chatbot must return programming language info when asked.

        Steps:
            1. Ask about programming languages.
            2. Assert answer contains 'Python'.

        Asserts:
            AI response contains 'Python' within 30 seconds.
        """
        page.get_by_test_id("chat-input").fill(
            "What programming languages does Camilo know?"
        )
        page.get_by_test_id("chat-send").click()

        expect(page.get_by_test_id("message-ai").last).to_contain_text(
            "Python", timeout=30000
        )

    def test_chatbot_refuses_off_topic_question(self, page: Page):
        """Chatbot must refuse to answer questions unrelated to the resume.

        Steps:
            1. Ask an off-topic question ("capital of France").
            2. Assert response contains refusal message.

        Asserts:
            AI response includes the guardrail refusal phrase within 30 seconds.
        """
        page.get_by_test_id("chat-input").fill("What is the capital of France?")
        page.get_by_test_id("chat-send").click()

        expect(page.get_by_test_id("message-ai").last).to_contain_text(
            "only answer questions about Camilo", timeout=30000
        )

    def test_chatbot_input_clears_after_send(self, page: Page):
        """Input field must be empty after a message is sent.

        Steps:
            1. Type a message and send.
            2. Assert input value is empty.

        Asserts:
            chat-input value is '' immediately after sending.
        """
        page.get_by_test_id("chat-input").fill("Test question")
        page.get_by_test_id("chat-send").click()

        expect(page.get_by_test_id("chat-input")).to_have_value("")


@pytest.mark.functional
class TestContactFormFunctional:
    """Functional tests for the Contact Form."""

    def _scroll_to_contact(self, page: Page) -> None:
        """Scroll the contact section into view."""
        page.locator("#contact").scroll_into_view_if_needed()

    def test_form_shows_name_error_on_empty_submit(self, page: Page):
        """Submitting empty form must show validation errors.

        Steps:
            1. Click submit with empty fields.
            2. Assert name error is visible.

        Asserts:
            #name-error element is visible with 'required' text.
        """
        self._scroll_to_contact(page)
        page.get_by_test_id("chat-send").click()

        error = page.locator("#name-error")
        expect(error).to_be_visible()
        expect(error).to_contain_text("required")

    def test_form_shows_email_format_error(self, page: Page):
        """Entering an invalid email must show format error.

        Steps:
            1. Fill name and message, enter invalid email.
            2. Submit.
            3. Assert email error is visible.

        Asserts:
            #email-error is visible with 'valid email' text.
        """
        self._scroll_to_contact(page)
        page.locator("#contact-name").fill("Jane Doe")
        page.locator("#contact-email").fill("not-an-email")
        page.locator("#contact-message").fill("Hello")
        page.get_by_label("Send message").click()

        error = page.locator("#email-error")
        expect(error).to_be_visible()
        expect(error).to_contain_text("valid email")

    def test_form_clears_error_on_input(self, page: Page):
        """Typing in an invalid field must clear its error message.

        Steps:
            1. Trigger name error by submitting empty.
            2. Type in name field.
            3. Assert error disappears.

        Asserts:
            #name-error is not visible after user types.
        """
        self._scroll_to_contact(page)
        page.get_by_test_id("chat-send").click()
        expect(page.locator("#name-error")).to_be_visible()

        page.locator("#contact-name").fill("A")
        expect(page.locator("#name-error")).not_to_be_visible()

    def test_successful_form_submission_shows_success_state(self, page: Page):
        """Valid form submission must display the success confirmation.

        Steps:
            1. Fill all fields with valid data.
            2. Click send.
            3. Wait for success state (up to 20s for Lambda + SES).

        Asserts:
            Page contains success message with visitor's name within 20 seconds.

        Note:
            This test sends a real API request. The Lambda + SES pipeline
            may take up to 15 seconds on cold start.
        """
        self._scroll_to_contact(page)
        page.locator("#contact-name").fill("Playwright Test")
        page.locator("#contact-email").fill("test@example.com")
        page.locator("#contact-message").fill(
            "This is a Playwright functional test submission. Please ignore."
        )

        page.get_by_label("Send message").click()

        # Wait for success state — up to 20s
        success_text = page.get_by_text("Playwright Test")
        expect(success_text).to_be_visible(timeout=20000)
