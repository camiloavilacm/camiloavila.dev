/**
 * chatbot.test.ts — Puppeteer Tests: AI Resume Chatbot
 *
 * Browser automation tests for the chatbot widget using Puppeteer.
 * Complements the Cypress E2E tests with lower-level DOM interaction
 * and screenshot capture at key steps.
 *
 * Puppeteer tests focus on:
 *   - DOM structure and element attributes
 *   - Programmatic input and interaction
 *   - Screenshot capture for visual review
 *   - Timing and async behaviour
 *
 * These differ from Cypress tests in that Puppeteer gives direct browser
 * control — useful for non-standard interactions and CI screenshot artifacts.
 *
 * Run locally:
 *   BASE_URL=http://localhost:5173 npm run test:puppeteer
 */

import puppeteer, { Browser, Page } from "puppeteer";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.PUPPETEER_BASE_URL ?? "http://localhost:5173";
const SCREENSHOT_DIR = path.resolve("reports/e2e/puppeteer/screenshots");

/** Ensure screenshot directory exists. */
beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

describe("Chatbot Widget — Puppeteer", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  });

  afterEach(async () => {
    await page.close();
  });

  /**
   * Helper — take a screenshot and save to reports/e2e/puppeteer/screenshots/
   *
   * @param name - Filename (without extension).
   */
  const screenshot = async (name: string) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${name}.png`),
      fullPage: false,
    });
  };

  // -------------------------------------------------------------------------
  // DOM Structure
  // -------------------------------------------------------------------------
  it("chatbot toggle button is present and visible", async () => {
    const toggle = await page.$("[data-testid='chatbot-toggle']");
    expect(toggle).not.toBeNull();

    const isVisible = await page.evaluate(
      (el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },
      toggle!
    );

    expect(isVisible).toBe(true);
    await screenshot("01-toggle-visible");
  });

  it("toggle button has correct aria-label", async () => {
    const ariaLabel = await page.$eval(
      "[data-testid='chatbot-toggle']",
      (el) => el.getAttribute("aria-label")
    );
    expect(ariaLabel).toContain("Resume Assistant");
  });

  // -------------------------------------------------------------------------
  // Panel Open / Close
  // -------------------------------------------------------------------------
  it("chat panel is not visible before toggle click", async () => {
    const panel = await page.$("[data-testid='chatbot-panel']");
    expect(panel).toBeNull();
  });

  it("chat panel appears after clicking toggle", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chatbot-panel']", { visible: true });

    const panel = await page.$("[data-testid='chatbot-panel']");
    expect(panel).not.toBeNull();
    await screenshot("02-panel-open");
  });

  it("chat panel closes when toggle is clicked again", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chatbot-panel']");
    await page.click("[data-testid='chatbot-toggle']");

    // Panel should be removed from DOM
    await page.waitForSelector("[data-testid='chatbot-panel']", {
      hidden: true,
    });

    const panel = await page.$("[data-testid='chatbot-panel']");
    expect(panel).toBeNull();
  });

  // -------------------------------------------------------------------------
  // Input and Interaction
  // -------------------------------------------------------------------------
  it("chat input is focusable and accepts text", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chat-input']");

    await page.click("[data-testid='chat-input']");
    await page.type("[data-testid='chat-input']", "What are your skills?");

    const value = await page.$eval(
      "[data-testid='chat-input']",
      (el) => (el as HTMLInputElement).value
    );
    expect(value).toBe("What are your skills?");
    await screenshot("03-input-typed");
  });

  it("send button is disabled when input is empty", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chat-send']");

    const isDisabled = await page.$eval(
      "[data-testid='chat-send']",
      (el) => (el as HTMLButtonElement).disabled
    );
    expect(isDisabled).toBe(true);
  });

  it("send button becomes enabled when input has text", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chat-input']");
    await page.type("[data-testid='chat-input']", "Hello");

    const isDisabled = await page.$eval(
      "[data-testid='chat-send']",
      (el) => (el as HTMLButtonElement).disabled
    );
    expect(isDisabled).toBe(false);
  });

  it("user message appears in thread after sending", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chat-input']");
    await page.type("[data-testid='chat-input']", "Tell me about your certifications");
    await page.click("[data-testid='chat-send']");

    // User message should appear immediately
    await page.waitForSelector("[data-testid='message-user']");
    const userMsgs = await page.$$("[data-testid='message-user']");
    expect(userMsgs.length).toBeGreaterThan(0);

    const lastUserMsg = await page.evaluate(
      (el) => el.textContent,
      userMsgs[userMsgs.length - 1]
    );
    expect(lastUserMsg).toContain("certifications");
    await screenshot("04-user-message-sent");
  });

  it("input clears after message is sent", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chat-input']");
    await page.type("[data-testid='chat-input']", "Any text");
    await page.keyboard.press("Enter");

    const value = await page.$eval(
      "[data-testid='chat-input']",
      (el) => (el as HTMLInputElement).value
    );
    expect(value).toBe("");
  });

  it("AI response appears after question is sent @smoke", async () => {
    await page.click("[data-testid='chatbot-toggle']");
    await page.waitForSelector("[data-testid='chat-input']");
    await page.type("[data-testid='chat-input']", "What are your AWS certifications?");
    await page.click("[data-testid='chat-send']");

    // Wait for AI response (up to 30s for Bedrock)
    await page.waitForFunction(
      () => {
        const msgs = document.querySelectorAll("[data-testid='message-ai']");
        return msgs.length >= 2; // Welcome + AI answer
      },
      { timeout: 30000 }
    );

    const aiMessages = await page.$$eval(
      "[data-testid='message-ai']",
      (els) => els.map((el) => el.textContent ?? "")
    );

    const lastAiMsg = aiMessages[aiMessages.length - 1];
    expect(lastAiMsg).toContain("Developer Associate");
    await screenshot("05-ai-response");
  });
});
