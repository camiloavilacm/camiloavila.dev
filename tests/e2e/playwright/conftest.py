"""
conftest.py — Playwright Test Configuration and Fixtures
========================================================
Shared fixtures for all Playwright smoke and functional tests.

Features:
  - Multi-browser support: Chromium, Firefox, WebKit (Safari)
  - Device emulation: iPhone, iPad, Pixel, etc.
  - DevTools/CDP: Console logs, network monitoring, performance
  - Environment variables for base URL and browser selection

Fixtures:
  - base_url          — The base URL for the site under test
  - browser           — Parametrized browser (chromium/firefox/webkit)
  - browser_ctx       — Fresh Playwright browser context per test
  - page              — A Playwright Page object

Environment variables:
  PLAYWRIGHT_BASE_URL  — defaults to https://camiloavila.dev
  PLAYWRIGHT_BROWSER  — defaults to chromium (chromium/firefox/webkit)

Run locally:
  pip install playwright pytest pytest-html
  playwright install chromium firefox webkit
  PLAYWRIGHT_BASE_URL=http://localhost:5173 pytest tests/e2e/playwright/ -v
  PLAYWRIGHT_BROWSER=firefox pytest tests/e2e/playwright/ -v
"""

import os
import pytest
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page
from playwright._driver import BrowserType


BASE_URL = os.environ.get("PLAYWRIGHT_BASE_URL", "https://camiloavila.dev")
DEFAULT_BROWSER = os.environ.get("PLAYWRIGHT_BROWSER", "chromium")

# Device descriptors for mobile testing
DEVICES = {
    "iPhone 14": {
        "viewport": {"width": 390, "height": 844},
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    "iPhone 14 Pro": {
        "viewport": {"width": 393, "height": 852},
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    "iPad Pro 11": {
        "viewport": {"width": 834, "height": 1194},
        "user_agent": "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 iPad Safari/604.1",
        "device_scale_factor": 2,
        "is_mobile": True,
        "has_touch": True,
    },
    "Pixel 7": {
        "viewport": {"width": 412, "height": 915},
        "user_agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        "device_scale_factor": 2.625,
        "is_mobile": True,
        "has_touch": True,
    },
    "Samsung Galaxy S23": {
        "viewport": {"width": 360, "height": 780},
        "user_agent": "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
}

# Desktop viewports for responsive testing
VIEWPORTS = {
    "desktop": {"width": 1280, "height": 720},
    "desktop_hd": {"width": 1920, "height": 1080},
    "laptop": {"width": 1366, "height": 768},
    "tablet": {"width": 768, "height": 1024},
    "mobile_small": {"width": 375, "height": 667},
    "mobile_medium": {"width": 414, "height": 896},
}


@pytest.fixture(scope="session")
def playwright_instance():
    """Start a single Playwright instance for the entire test session."""
    with sync_playwright() as pw:
        yield pw


def get_browser_launcher(playwright, browser_name: str) -> BrowserType:
    """Get the browser launcher based on browser name."""
    browsers = {
        "chromium": playwright.chromium,
        "firefox": playwright.firefox,
        "webkit": playwright.webkit,
    }
    browser = browsers.get(browser_name.lower())
    if not browser:
        raise ValueError(
            f"Unknown browser: {browser_name}. Use: chromium, firefox, or webkit"
        )
    return browser


@pytest.fixture(scope="session")
def browser(request, playwright_instance):
    """Launch a parametrized browser for the test session.

    Browser is selected via:
    - pytest parameter: @pytest.mark.parametrize("browser", ["chromium", "firefox", "webkit"])
    - environment variable: PLAYWRIGHT_BROWSER
    - default: chromium
    """
    browser_name = getattr(request, "param", None) or DEFAULT_BROWSER

    browser_launcher = get_browser_launcher(playwright_instance, browser_name)

    browser: Browser = browser_launcher.launch(
        headless=True,
        args=["--no-sandbox", "--disable-setuid-sandbox"],
    )
    yield browser
    browser.close()


@pytest.fixture
def browser_ctx(browser, request) -> BrowserContext:
    """Create a fresh browser context with optional device emulation.

    Device emulation can be set via:
    - pytest parameter: @pytest.mark.parametrize("device", ["iPhone 14", "Pixel 7"])
    - manual viewport via browser_ctx fixture with custom viewport
    """
    device_name = getattr(request, "param", None)

    if device_name and device_name in DEVICES:
        device_config = DEVICES[device_name]
        context: BrowserContext = browser.new_context(
            viewport=device_config["viewport"],
            user_agent=device_config.get("user_agent"),
            device_scale_factor=device_config.get("device_scale_factor", 1),
            is_mobile=device_config.get("is_mobile", False),
            has_touch=device_config.get("has_touch", False),
            base_url=BASE_URL,
        )
    else:
        context: BrowserContext = browser.new_context(
            viewport={"width": 1280, "height": 720},
            base_url=BASE_URL,
        )

    yield context
    context.close()


@pytest.fixture
def page(browser_ctx) -> Page:
    """Open a new page in the browser context and navigate to the portfolio."""
    p: Page = browser_ctx.new_page()
    p.goto(BASE_URL, wait_until="networkidle")
    yield p
    p.close()


@pytest.fixture
def devtools_session(page):
    """Create a CDP (Chrome DevTools Protocol) session for advanced debugging.

    Enables:
    - Console log capture
    - Network request monitoring
    - Performance metrics
    - JavaScript error tracking
    """
    client = page.context.new_cdp_session(page)
    return client


@pytest.fixture
def console_logs(page):
    """Capture console logs during test execution."""
    logs = []
    page.on("console", lambda msg: logs.append({"type": msg.type, "text": msg.text}))
    yield logs


@pytest.fixture
def network_failures(page):
    """Track failed network requests during test execution."""
    failures = []
    page.on(
        "requestfailed",
        lambda request: failures.append(
            {
                "url": request.url,
                "failure": request.failure.error_text if request.failure else None,
            }
        ),
    )
    yield failures
