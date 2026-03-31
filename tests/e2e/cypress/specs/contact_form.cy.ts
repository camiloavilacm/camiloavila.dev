/**
 * contact_form.cy.ts — Cypress E2E Tests: Contact Form
 *
 * Tests the contact form section on the portfolio page.
 * Covers client-side validation, successful submission flow,
 * and error state handling.
 *
 * Note: Tests that submit the form to the real API Gateway are tagged
 * with @smoke and only run in CI/CD post-deploy. Validation tests
 * run on every PR via pr-checks.yml (with the mock API).
 */

describe("Contact Form — E2E", () => {
  beforeEach(() => {
    cy.visit("/");
    // Scroll to the contact section
    cy.get("#contact").scrollIntoView();
  });

  // -------------------------------------------------------------------------
  // Section Visibility
  // -------------------------------------------------------------------------
  it("displays the contact section heading", () => {
    cy.contains("h2", "Get In Touch").should("be.visible");
  });

  it("shows all three form fields", () => {
    cy.get("#contact-name").should("be.visible");
    cy.get("#contact-email").should("be.visible");
    cy.get("#contact-message").should("be.visible");
  });

  it("shows the submit button", () => {
    cy.contains("button", "Send Message").should("be.visible");
  });

  it("displays Camilo's email address as a contact link", () => {
    cy.get('a[href="mailto:camiloavilainfo@gmail.com"]').should("be.visible");
  });

  // -------------------------------------------------------------------------
  // Client-Side Validation
  // -------------------------------------------------------------------------
  it("shows error when submitting empty form", () => {
    cy.contains("button", "Send Message").click();

    cy.get("#name-error").should("be.visible").and("contain", "required");
    cy.get("#email-error").should("be.visible").and("contain", "required");
    cy.get("#message-error").should("be.visible").and("contain", "required");
  });

  it("shows error for invalid email format", () => {
    cy.get("#contact-name").type("Jane Doe");
    cy.get("#contact-email").type("not-an-email");
    cy.get("#contact-message").type("Hello!");
    cy.contains("button", "Send Message").click();

    cy.get("#email-error")
      .should("be.visible")
      .and("contain", "valid email");
  });

  it("clears field error when user starts typing", () => {
    // Trigger error
    cy.contains("button", "Send Message").click();
    cy.get("#name-error").should("be.visible");

    // Start typing — error should disappear
    cy.get("#contact-name").type("J");
    cy.get("#name-error").should("not.exist");
  });

  it("shows character count for message field", () => {
    cy.get("#contact-message").type("Hello");
    cy.contains("5/2000").should("be.visible");
  });

  // -------------------------------------------------------------------------
  // Successful Submission (requires live API — smoke test)
  // -------------------------------------------------------------------------
  it("shows success state after valid form submission @smoke", () => {
    cy.get("#contact-name").type("Test Visitor");
    cy.get("#contact-email").type("test@example.com");
    cy.get("#contact-message").type(
      "This is a Cypress smoke test submission. Please ignore."
    );

    cy.contains("button", "Send Message").click();

    // Loading state
    cy.contains("button", "Sending...").should("exist");

    // Success state — wait up to 20s for Lambda + SES
    cy.contains("Message sent successfully", { timeout: 20000 }).should("be.visible");
    cy.contains("Check your inbox", { timeout: 20000 }).should("be.visible");
  });

  it("shows 'Send another message' button after success @smoke", () => {
    cy.get("#contact-name").type("Test Visitor");
    cy.get("#contact-email").type("test@example.com");
    cy.get("#contact-message").type("Smoke test message.");
    cy.contains("button", "Send Message").click();

    cy.contains("Send another message", { timeout: 20000 }).should("be.visible");
  });

  it("resets form when 'Send another message' is clicked @smoke", () => {
    cy.get("#contact-name").type("Test Visitor");
    cy.get("#contact-email").type("test@example.com");
    cy.get("#contact-message").type("Smoke test message.");
    cy.contains("button", "Send Message").click();

    cy.contains("Send another message", { timeout: 20000 }).click();
    cy.get("#contact-name").should("be.visible").and("have.value", "");
  });
});
