/**
 * cypress.config.ts — Cypress E2E Test Configuration
 *
 * Configures the Cypress test runner for the camiloavila.dev portfolio.
 *
 * Base URL:
 *   - Local dev:    http://localhost:5173  (Vite dev server)
 *   - CI/CD:        CYPRESS_BASE_URL env var (set by GitHub Actions to https://camiloavila.dev)
 *
 * Reporter:
 *   Uses cypress-mochawesome-reporter to generate a rich HTML report with
 *   embedded screenshots on failure. Reports are saved to reports/e2e/cypress/
 *   and uploaded as GitHub Actions artifacts.
 *
 * Spec pattern:
 *   All .cy.ts files inside tests/e2e/cypress/specs/
 */

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Base URL — overridden by CYPRESS_BASE_URL in CI/CD
    baseUrl: process.env.CYPRESS_BASE_URL ?? "http://localhost:5173",
    chromeWebSecurity: false,
    // Spec file location
    specPattern: "e2e/cypress/specs/**/*.cy.ts",
    supportFile: false,

    // Timeouts — generous for Bedrock API cold starts
    defaultCommandTimeout: 15000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,

    // Viewport — desktop default
    viewportWidth: 1280,
    viewportHeight: 720,

    // Screenshots on failure — embedded in mochawesome report
    screenshotOnRunFailure: true,
    screenshotsFolder: "reports/e2e/cypress/screenshots",
    videosFolder: "reports/e2e/cypress/videos",
    video: false,   // Disable video to reduce CI artifact size

    // Reporter — mochawesome generates the HTML report
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "reports/e2e/cypress",
      overwrite: false,
      html: true,
      json: true,
      embeddedScreenshots: true,
      inlineAssets: true,
    },

    setupNodeEvents(on, _config) {
      // Required for cypress-mochawesome-reporter
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});
