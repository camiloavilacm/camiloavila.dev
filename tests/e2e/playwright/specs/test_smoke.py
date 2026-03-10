"""
test_smoke.py — Playwright Smoke Tests
=======================================
Smoke tests verify that the portfolio site is up and serving correctly
after each deployment. They are fast (<10s) and check only essential
page elements — not deep functionality.

Run these after every deploy to confirm the site is healthy before
triggering the full functional test suite.

Marks: @pytest.mark.smoke

Smoke tests check:
  - Page loads with correct title
  - Hero section with Camilo's name is visible
  - Chatbot toggle button exists
  - Contact form section exists
  - Site loads correctly on mobile viewport (375px)
  - Key navigation links are present
  - No console errors on page load
"""

import pytest
from playwright.sync_api import Page, expect


@pytest.mark.smoke
class TestPageLoad:
    """Smoke tests for basic page load and title."""

    def test_page_title_contains_camilo_avila(self, page: Page):
        """Page title must contain 'Camilo Avila' for correct SEO and identity.

        Asserts:
            Page title includes the portfolio owner's name.
        """
        expect(page).to_have_title("Camilo Avila — QA Automation Engineer")

    def test_hero_heading_is_visible(self, page: Page):
        """The main H1 heading with Camilo's name must be visible.

        Asserts:
            H1 element containing 'Camilo Avila' is visible in the viewport.
        """
        heading = page.locator("h1", has_text="Camilo Avila")
        expect(heading).to_be_visible()

    def test_page_loads_without_error(self, page: Page):
        """Page must load without JavaScript errors in the console.

        Asserts:
            No console error events are fired during page load.
        """
        errors: list[str] = []
        page.on(
            "console",
            lambda msg: errors.append(msg.text) if msg.type == "error" else None,
        )
        page.reload(wait_until="networkidle")
        assert errors == [], f"Console errors detected: {errors}"


@pytest.mark.smoke
class TestKeyElements:
    """Smoke tests for key UI elements that must always be present."""

    def test_chatbot_toggle_button_exists(self, page: Page):
        """The chatbot toggle button must be visible on page load.

        Asserts:
            Element with data-testid='chatbot-toggle' is present and visible.
        """
        toggle = page.get_by_test_id("chatbot-toggle")
        expect(toggle).to_be_visible()

    def test_contact_section_exists(self, page: Page):
        """The contact form section must be present in the DOM.

        Asserts:
            Section with id='contact' exists on the page.
        """
        contact_section = page.locator("#contact")
        expect(contact_section).to_be_attached()

    def test_contact_form_name_field_exists(self, page: Page):
        """The contact form name input must be present.

        Asserts:
            Input with id='contact-name' is present in the DOM.
        """
        name_field = page.locator("#contact-name")
        expect(name_field).to_be_attached()

    def test_skills_section_exists(self, page: Page):
        """The skills section must be present on the page.

        Asserts:
            Section with id='skills' is attached to the DOM.
        """
        skills = page.locator("#skills")
        expect(skills).to_be_attached()

    def test_experience_section_exists(self, page: Page):
        """The experience section must be present on the page.

        Asserts:
            Section with id='experience' is attached to the DOM.
        """
        exp = page.locator("#experience")
        expect(exp).to_be_attached()

    def test_certifications_section_exists(self, page: Page):
        """The certifications section must be present.

        Asserts:
            Section with id='certifications' is attached to the DOM.
        """
        certs = page.locator("#certifications")
        expect(certs).to_be_attached()


@pytest.mark.smoke
class TestResponsiveness:
    """Smoke tests for mobile viewport rendering."""

    def test_page_renders_on_mobile_viewport(self, browser_ctx):
        """Portfolio must render without layout issues on 375px mobile viewport.

        Asserts:
            Camilo Avila heading is visible on a 375x812 mobile screen.
        """
        mobile_page = browser_ctx.new_page()
        mobile_page.set_viewport_size({"width": 375, "height": 812})
        mobile_page.goto("/", wait_until="networkidle")

        heading = mobile_page.locator("h1", has_text="Camilo Avila")
        expect(heading).to_be_visible()
        mobile_page.close()

    def test_chatbot_toggle_visible_on_mobile(self, browser_ctx):
        """Chatbot toggle button must be accessible on mobile viewport.

        Asserts:
            Chatbot toggle is visible at 375px width.
        """
        mobile_page = browser_ctx.new_page()
        mobile_page.set_viewport_size({"width": 375, "height": 812})
        mobile_page.goto("/", wait_until="networkidle")

        toggle = mobile_page.get_by_test_id("chatbot-toggle")
        expect(toggle).to_be_visible()
        mobile_page.close()
