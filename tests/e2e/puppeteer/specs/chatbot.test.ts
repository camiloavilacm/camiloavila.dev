/**
 * chatbot.test.ts — Puppeteer Tests: AI Resume Chatbot (Inline Widget)
 *
 * Browser automation tests for the inline chatbot widget using Puppeteer.
 * Complements the Cypress E2E tests with DOM validation and screenshot capture.
 *
 * Puppeteer tests focus on:
 *   - DOM structure of the inline search-bar chat widget
 *   - Programmatic input and interaction
 *   - Send button disabled / enabled states
 *   - User message rendering and input clearing
 *   - Screenshot capture for visual review
 *   - AI response validation
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
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  });

  afterAll(async () => {
    await browser?.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  });

  afterEach(async () => {
    await page?.close();
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
  // DOM Structure (Inline Chatbot)
  // -------------------------------------------------------------------------
  it("chat input field is present and visible on load", async () => {
    const input = await page.waitForSelector("[data-testid='chat-input']", { visible: true });
    expect(input).not.toBeNull();
    await screenshot("01-input-visible");
  });

  it("send button is present and visible", async () => {
    const sendBtn = await page.waitForSelector("[data-testid='chat-send']", { visible: true });
    expect(sendBtn).not.toBeNull();
  });

  it("welcome message is rendered on page load", async () => {
    const welcome = await page.waitForSelector("[data-testid='message-ai']", { visible: true });
    expect(welcome).not.toBeNull();
    const text = await page.$eval("[data-testid='message-ai']", (el) => el.textContent);
    expect(text).toContain("Resume Assistant");
  });

  // -------------------------------------------------------------------------
  // Input and Interaction
  // -------------------------------------------------------------------------
  it("chat input accepts text", async () => {
    await page.click("[data-testid='chat-input']");
    await page.type("[data-testid='chat-input']", "What are your skills?");

    const value = await page.$eval(
      "[data-testid='chat-input']",
      (el) => (el as HTMLInputElement).value
    );
    expect(value).toBe("What are your skills?");
    await screenshot("02-input-typed");
  });

  it("send button is disabled when input is empty", async () => {
    const isDisabled = await page.$eval(
      "[data-testid='chat-send']",
      (el) => (el as HTMLButtonElement).disabled
    );
    expect(isDisabled).toBe(true);
  });

  it("send button becomes enabled when input has text", async () => {
    await page.type("[data-testid='chat-input']", "Hello");

    const isDisabled = await page.$eval(
      "[data-testid='chat-send']",
      (el) => (el as HTMLButtonElement).disabled
    );
    expect(isDisabled).toBe(false);
  });

  it("user message appears in thread after sending", async () => {
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
    await screenshot("03-user-message-sent");
  });

  it("input clears after message is sent via Enter key", async () => {
    await page.type("[data-testid='chat-input']", "Any text");
    await page.keyboard.press("Enter");

    const value = await page.$eval(
      "[data-testid='chat-input']",
      (el) => (el as HTMLInputElement).value
    );
    expect(value).toBe("");
  });

  it("AI response appears after question is sent @smoke", async () => {
    await page.type("[data-testid='chat-input']", "What are your AWS certifications?");
    await page.click("[data-testid='chat-send']");

    // Wait for AI response (up to 30s for Bedrock)
    await page.waitForFunction(
      () => {
        const msgs = document.querySelectorAll("[data-testid='message-ai']");
        return msgs.length >= 2;
      },
      { timeout: 30000 }
    );

    const aiMessages = await page.$$eval(
      "[data-testid='message-ai']",
      (els) => els.map((el) => el.textContent ?? "")
    );

    const lastAiMsg = aiMessages[aiMessages.length - 1];
    expect(lastAiMsg.length).toBeGreaterThan(10);
    await screenshot("04-ai-response");
  });
});
