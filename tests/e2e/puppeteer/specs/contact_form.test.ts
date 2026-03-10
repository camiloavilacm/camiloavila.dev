/**
 * contact_form.test.ts — Puppeteer Tests: Contact Form
 *
 * Browser automation tests for the contact form using Puppeteer.
 * Covers DOM structure, validation states, and form submission flow.
 *
 * Screenshots are captured at key steps and saved to
 * reports/e2e/puppeteer/screenshots/ for visual review.
 */

import puppeteer, { Browser, Page } from "puppeteer";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.PUPPETEER_BASE_URL ?? "http://localhost:5173";
const SCREENSHOT_DIR = path.resolve("reports/e2e/puppeteer/screenshots");

beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

describe("Contact Form — Puppeteer", () => {
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
    // Scroll to contact section
    await page.evaluate(() => {
      document.querySelector("#contact")?.scrollIntoView();
    });
  });

  afterEach(async () => {
    await page.close();
  });

  const screenshot = async (name: string) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `contact-${name}.png`),
    });
  };

  // -------------------------------------------------------------------------
  // DOM Structure
  // -------------------------------------------------------------------------
  it("contact section is present in the DOM", async () => {
    const section = await page.$("#contact");
    expect(section).not.toBeNull();
  });

  it("all three form fields are present", async () => {
    const name = await page.$("#contact-name");
    const email = await page.$("#contact-email");
    const message = await page.$("#contact-message");

    expect(name).not.toBeNull();
    expect(email).not.toBeNull();
    expect(message).not.toBeNull();

    await screenshot("01-form-visible");
  });

  it("submit button is present", async () => {
    const button = await page.$("button[aria-label='Send message']");
    expect(button).not.toBeNull();
  });

  // -------------------------------------------------------------------------
  // Client-Side Validation
  // -------------------------------------------------------------------------
  it("shows name error on empty submit", async () => {
    await page.click("button[aria-label='Send message']");
    await page.waitForSelector("#name-error");

    const errorText = await page.$eval(
      "#name-error",
      (el) => el.textContent
    );
    expect(errorText).toContain("required");
    await screenshot("02-validation-errors");
  });

  it("shows email format error on invalid email", async () => {
    await page.type("#contact-name", "Test User");
    await page.type("#contact-email", "invalid");
    await page.type("#contact-message", "Hello");
    await page.click("button[aria-label='Send message']");

    await page.waitForSelector("#email-error");
    const errorText = await page.$eval(
      "#email-error",
      (el) => el.textContent
    );
    expect(errorText).toContain("valid email");
  });

  it("clears name error when user types in name field", async () => {
    // Trigger the error
    await page.click("button[aria-label='Send message']");
    await page.waitForSelector("#name-error");

    // Type to clear error
    await page.type("#contact-name", "A");
    await page.waitForFunction(
      () => !document.querySelector("#name-error")
    );

    const error = await page.$("#name-error");
    expect(error).toBeNull();
  });

  // -------------------------------------------------------------------------
  // Form Fill
  // -------------------------------------------------------------------------
  it("accepts valid input in all fields", async () => {
    await page.type("#contact-name", "Jane Doe");
    await page.type("#contact-email", "jane@example.com");
    await page.type("#contact-message", "I'm interested in your QA automation skills.");

    const nameVal = await page.$eval(
      "#contact-name",
      (el) => (el as HTMLInputElement).value
    );
    const emailVal = await page.$eval(
      "#contact-email",
      (el) => (el as HTMLInputElement).value
    );
    const msgVal = await page.$eval(
      "#contact-message",
      (el) => (el as HTMLTextAreaElement).value
    );

    expect(nameVal).toBe("Jane Doe");
    expect(emailVal).toBe("jane@example.com");
    expect(msgVal).toContain("QA automation");
    await screenshot("03-form-filled");
  });

  // -------------------------------------------------------------------------
  // Submission — Smoke (requires live API)
  // -------------------------------------------------------------------------
  it("shows success state after valid submission @smoke", async () => {
    await page.type("#contact-name", "Puppeteer Test");
    await page.type("#contact-email", "test@example.com");
    await page.type(
      "#contact-message",
      "This is a Puppeteer smoke test submission."
    );

    await screenshot("04-before-submit");
    await page.click("button[aria-label='Send message']");

    // Wait for success state (up to 20s)
    await page.waitForFunction(
      () =>
        document.body.textContent?.includes("reply has been sent") ||
        document.body.textContent?.includes("will get back to you"),
      { timeout: 20000 }
    );

    await screenshot("05-success-state");

    const bodyText = await page.evaluate(() => document.body.textContent);
    expect(bodyText).toContain("Puppeteer Test");
  });
});
