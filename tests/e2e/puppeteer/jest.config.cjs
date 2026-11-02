/**
 * jest.config.cjs — Jest Configuration for Puppeteer Tests
 *
 * Configures Jest to run TypeScript Puppeteer tests with:
 * - ts-jest for TypeScript compilation
 * - jest-html-reporters for HTML report generation
 * - 60s timeout per test (Bedrock cold starts can be slow)
 */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/e2e/puppeteer/specs/**/*.test.ts"],
  testTimeout: 60000,
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "reports/e2e/puppeteer",
        filename: "report.html",
        openReport: false,
        pageTitle: "Puppeteer E2E — camiloavila.dev",
        expand: true,
        includeConsoleLog: true,
      },
    ],
  ],
};
