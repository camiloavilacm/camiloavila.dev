/**
 * chatbot.cy.ts — Cypress E2E Tests: AI Resume Chatbot
 *
 * Tests the full chatbot widget user journey on the live portfolio site.
 * These tests run against the deployed site (https://camiloavila.dev) in
 * CI/CD as smoke tests after every successful deploy.
 *
 * They can also run locally against the Vite dev server + SAM local API:
 *   npm run dev          (in frontend/)
 *   sam local start-api  (in project root)
 *   npx cypress open
 *
 * Test scenarios:
 *   1. Page loads with correct title
 *   2. Chatbot toggle button is visible
 *   3. Chat panel opens on click
 *   4. Welcome message is shown on open
 *   5. Typing and sending a valid question returns an answer
 *   6. Answer contains expected resume-related content
 *   7. Off-topic question returns refusal message
 *   8. Loading indicator appears while waiting
 *   9. Chat panel closes on Escape key
 *   10. Input clears after sending
 */

describe("AI Resume Chatbot — E2E", () => {
  beforeEach(() => {
    // Visit the portfolio homepage before each test
    cy.visit("/");
  });

  // -------------------------------------------------------------------------
  // Page Load
  // -------------------------------------------------------------------------
  it("loads the portfolio page with correct title", () => {
    cy.title().should("contain", "Camilo Avila");
  });

  it("displays the hero section with Camilo's name", () => {
    cy.contains("h1", "Camilo Avila").should("be.visible");
  });

  // -------------------------------------------------------------------------
  // Chatbot Widget Visibility
  // -------------------------------------------------------------------------
  it("shows the chatbot toggle button", () => {
    cy.get("[data-testid='chatbot-toggle']")
      .should("be.visible")
      .and("have.attr", "aria-label");
  });

  it("opens the chat panel when toggle is clicked", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chatbot-panel']").should("be.visible");
  });

  it("shows the welcome message when panel opens", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chatbot-panel']")
      .should("be.visible")
      .within(() => {
        cy.get("[data-testid='message-ai']")
          .first()
          .should("contain.text", "Resume Assistant");
      });
  });

  it("closes the chat panel when toggle is clicked again", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chatbot-panel']").should("be.visible");
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chatbot-panel']").should("not.exist");
  });

  it("closes the chat panel on Escape key", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chatbot-panel']").should("be.visible");
    cy.get("body").type("{esc}");
    cy.get("[data-testid='chatbot-panel']").should("not.exist");
  });

  // -------------------------------------------------------------------------
  // Chat Interaction — Valid Question
  // -------------------------------------------------------------------------
  it("shows loading indicator after sending a question", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chat-input']").type("What are your AWS certifications?");
    cy.get("[data-testid='chat-send']").click();

    // Loading indicator should appear (may disappear quickly — check it was present)
    cy.get("[data-testid='loading-indicator']").should("exist");
  });

  it("returns an answer containing AWS certification info", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chat-input']").type("What are your AWS certifications?");
    cy.get("[data-testid='chat-send']").click();

    // Wait up to 30s for Bedrock cold start
    cy.get("[data-testid='message-ai']", { timeout: 30000 })
      .last()
      .should("contain.text", "Developer Associate");
  });

  it("sends message on Enter key press", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chat-input']").type(
      "What programming languages do you know?{enter}"
    );

    cy.get("[data-testid='message-user']")
      .last()
      .should("contain.text", "programming languages");
  });

  it("clears the input field after sending", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chat-input']").type("What is your experience?{enter}");
    cy.get("[data-testid='chat-input']").should("have.value", "");
  });

  it("shows the user message in the chat thread", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chat-input']").type("Tell me about your Python skills");
    cy.get("[data-testid='chat-send']").click();

    cy.get("[data-testid='message-user']")
      .last()
      .should("contain.text", "Python skills");
  });

  // -------------------------------------------------------------------------
  // Chat Interaction — Off-topic Question (Guardrail)
  // -------------------------------------------------------------------------
  it("refuses to answer off-topic questions", () => {
    cy.get("[data-testid='chatbot-toggle']").click();
    cy.get("[data-testid='chat-input']").type("What is the capital of France?");
    cy.get("[data-testid='chat-send']").click();

    cy.get("[data-testid='message-ai']", { timeout: 30000 })
      .last()
      .should("contain.text", "only answer questions about Camilo");
  });
});
