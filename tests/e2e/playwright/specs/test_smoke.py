"""
test_smoke.py — Playwright Smoke Tests
======================================
Smoke tests verify that the portfolio site is up and serving correctly
after each deployment. They are fast (<10s) and check only essential
page elements — not deep functionality.

Features:
  - Cross-browser testing: Chromium, Firefox, WebKit (Safari)
  - Mobile device emulation: iPhone, iPad, Pixel, Samsung Galaxy
  - DevTools integration: Console logs, network monitoring
  - Responsive viewport testing

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

Run with specific browser:
  pytest tests/e2e/playwright/ -v -m smoke
  PLAYWRIGHT_BROWSER=firefox pytest tests/e2e/playwright/ -v -m smoke

Run with mobile device:
  pytest tests/e2e/playwright/ -v -k "mobile" --browser chromium
"""

import pytest
import allure
from playwright.sync_api import Page, expect


# =============================================================================
# Cross-Browser Tests
# =============================================================================


@pytest.mark.smoke
@allure.epic("Smoke Tests")
@allure.feature("Cross-Browser Compatibility")
@pytest.mark.parametrize("browser", ["chromium", "firefox", "webkit"], indirect=True)
class TestCrossBrowserSmoke:
    """Smoke tests that run across all browsers (Chromium, Firefox, WebKit)."""

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

    def test_contact_form_name_field_exists(self, page: Page):
        """The contact form name input must be present.

        Asserts:
            Input with id='contact-name' is present in the DOM.
        """
        name_field = page.locator("#contact-name")
        expect(name_field).to_be_attached()


# =============================================================================
# Desktop Smoke Tests (Default Chromium)
# =============================================================================


@pytest.mark.smoke
@allure.epic("Smoke Tests")
@allure.feature("Desktop Browsers")
class TestPageLoad:
    """Smoke tests for basic page load and title."""

    def test_page_title_contains_camilo_avila(self, page: Page):
        """Page title must contain 'Camilo Avila' for correct SEO and identity."""
        expect(page).to_have_title("Camilo Avila — QA Automation Engineer")

    def test_hero_heading_is_visible(self, page: Page):
        """The main H1 heading with Camilo's name must be visible."""
        heading = page.locator("h1", has_text="Camilo Avila")
        expect(heading).to_be_visible()

    def test_page_loads_without_error(self, page: Page, console_logs):
        """Page must load without JavaScript errors in the console."""
        page.reload(wait_until="networkidle")
        error_logs = [log for log in console_logs if log["type"] == "error"]
        assert len(error_logs) == 0, f"Console errors detected: {error_logs}"


@pytest.mark.smoke
@allure.epic("Smoke Tests")
@allure.feature("Key UI Elements")
class TestKeyElements:
    """Smoke tests for key UI elements that must always be present."""

    def test_chatbot_toggle_button_exists(self, page: Page):
        """The chatbot input must be visible on page load."""
        chat_input = page.get_by_test_id("chat-input")
        expect(chat_input).to_be_visible()

    def test_contact_section_exists(self, page: Page):
        """The contact form section must be present in the DOM."""
        contact_section = page.locator("#contact")
        expect(contact_section).to_be_attached()

    def test_contact_form_name_field_exists(self, page: Page):
        """The contact form name input must be present."""
        name_field = page.locator("#contact-name")
        expect(name_field).to_be_attached()

    def test_skills_section_exists(self, page: Page):
        """The skills section must be present on the page."""
        skills = page.locator("#skills").first
        expect(skills).to_be_attached()

    def test_experience_section_exists(self, page: Page):
        """The experience section must be present on the page."""
        exp = page.locator("#experience").first
        expect(exp).to_be_attached()

    def test_certifications_section_exists(self, page: Page):
        """The certifications section must be present."""
        certs = page.locator("#certifications").first
        expect(certs).to_be_attached()


# =============================================================================
# Mobile Device Emulation Tests
# =============================================================================


@pytest.mark.smoke
@allure.epic("Smoke Tests")
@allure.feature("Mobile Device Emulation")
@pytest.mark.parametrize(
    "device",
    ["iPhone 14", "iPhone 14 Pro", "iPad Pro 11", "Pixel 7", "Samsung Galaxy S23"],
    indirect=True,
)
class TestMobileDeviceSmoke:
    """Smoke tests running on mobile device emulators."""

    def test_page_renders_on_mobile_device(self, page: Page):
        """Portfolio must render without layout issues on mobile device.

        Asserts:
            Camilo Avila heading is visible on mobile device viewport.
        """
        heading = page.locator("h1", has_text="Camilo Avila")
        expect(heading).to_be_visible()

    def test_chatbot_visible_on_mobile(self, page: Page):
        """Chatbot must be accessible on mobile viewport."""
        chat_input = page.get_by_test_id("chat-input")
        expect(chat_input).to_be_visible()

    def test_contact_form_accessible_on_mobile(self, page: Page):
        """Contact form must be accessible on mobile device."""
        contact_section = page.locator("#contact")
        expect(contact_section).to_be_attached()


@pytest.mark.smoke
@allure.epic("Smoke Tests")
@allure.feature("Responsive Viewports")
class TestResponsiveness:
    """Smoke tests for responsive viewport rendering."""

    @pytest.mark.parametrize("viewport", ["mobile_small", "mobile_medium", "tablet"])
    def test_page_renders_on_viewport(self, browser_ctx, viewport):
        """Portfolio must render without layout issues on various viewports.

        Asserts:
            Camilo Avila heading is visible on specified viewport.
        """
        from tests.e2e.playwright.conftest import VIEWPORTS

        viewport_size = VIEWPORTS[viewport]

        mobile_page = browser_ctx.new_page()
        mobile_page.set_viewport_size(viewport_size)
        mobile_page.goto("/", wait_until="networkidle")

        heading = mobile_page.locator("h1", has_text="Camilo Avila")
        expect(heading).to_be_visible()
        mobile_page.close()


# =============================================================================
# DevTools / Console Tests
# =============================================================================


@pytest.mark.smoke
@allure.epic("Smoke Tests")
@allure.feature("DevTools Monitoring")
class TestDevTools:
    """Tests that use DevTools/CDP for monitoring browser behavior."""

    def test_no_console_errors_on_load(self, page: Page, console_logs):
        """Verify no console errors are logged during page load."""
        page.goto("/", wait_until="networkidle")
        error_logs = [log for log in console_logs if log["type"] == "error"]
        assert len(error_logs) == 0, f"Console errors: {error_logs}"

    def test_no_network_failures(self, page: Page, network_failures):
        """Verify no failed network requests on page load."""
        page.goto("/", wait_until="networkidle")
        assert len(network_failures) == 0, f"Network failures: {network_failures}"

    def test_cdp_session_available(self, page, devtools_session):
        """Verify CDP (DevTools) session can be created."""
        assert devtools_session is not None
        version = devtools_session.send("Browser.getVersion")
        assert version is not None
