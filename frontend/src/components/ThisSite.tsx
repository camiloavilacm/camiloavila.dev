/**
 * ThisSite.tsx — Technology Stack Section
 *
 * Displays the technology stack used to build this portfolio.
 * Shows Layer | Technology table matching the README format.
 */

import React from "react";

const TECH_STACK = [
  { layer: "Frontend", technology: "React 18 + Vite + TypeScript" },
  { layer: "Backend", technology: "Python 3.12 AWS Lambda + Strands Agents" },
  { layer: "AI", technology: "Amazon Bedrock — qwen.qwen3-coder-next via Converse API" },
  { layer: "Database", technology: "Amazon DynamoDB (contact form submissions)" },
  { layer: "Email", technology: "Amazon SES (automated personalised replies)" },
  { layer: "Infrastructure", technology: "AWS SAM (template.yaml)" },
  { layer: "Hosting", technology: "S3 + CloudFront + camiloavila.dev (Route 53 DNS)" },
  { layer: "CI/CD", technology: "GitHub Actions (OIDC role assumption — no stored keys)" },
  { layer: "Unit tests", technology: "Pytest + pytest-html + Allure" },
  { layer: "E2E tests", technology: "Cypress + Puppeteer + Playwright (Allure reports)" },
  { layer: "Security tests", technology: "Pytest + Playwright + Guardrails AI" },
];

const ThisSite: React.FC = () => {
  return (
    <section id="this-site" aria-labelledby="this-site-heading">
      <h2 className="section-heading" id="this-site-heading">
        <span className="section-number">05.</span> This site
      </h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Layer</th>
              <th style={styles.th}>Technology</th>
            </tr>
          </thead>
          <tbody>
            {TECH_STACK.map((item, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.tdLayer}>{item.layer}</td>
                <td style={styles.tdTech}>{item.technology}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    paddingTop: "60px",
    paddingBottom: "100px",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    padding: "14px 20px",
    background: "var(--bg-tertiary)",
    color: "var(--accent)",
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    borderBottom: "1px solid var(--border)",
  },
  tdLayer: {
    padding: "12px 20px",
    color: "var(--text-primary)",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    fontWeight: 600,
    borderBottom: "1px solid var(--border)",
  },
  tdTech: {
    padding: "12px 20px",
    color: "var(--text-secondary)",
    fontSize: "14px",
    borderBottom: "1px solid var(--border)",
  },
  trEven: {
    background: "var(--bg-secondary)",
  },
  trOdd: {
    background: "var(--bg-tertiary)",
  },
};

export default ThisSite;