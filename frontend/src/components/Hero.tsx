/**
 * Hero.tsx — Portfolio Hero Section
 *
 * The first thing visitors see. Introduces Camilo Avila with:
 * - A greeting line in monospace font (establishes the "developer" tone)
 * - Name as the primary H1 heading
 * - Role/tagline as the secondary H2
 * - A brief summary paragraph
 * - Two CTA buttons: view work and contact
 *
 * Design follows Brittany Chiang's approach: large, impactful name,
 * muted tagline, clean CTA row.
 */

import React from "react";

/**
 * Hero section component.
 *
 * @returns The hero section with name, title, summary, and CTAs.
 */
const Hero: React.FC = () => {
  return (
    <section id="hero" style={styles.section} aria-label="Introduction">
      <p style={styles.greeting}>Hi, my name is</p>

      <h1 style={styles.name}>Camilo Avila.</h1>

      <h2 style={styles.tagline}>
        Senior Quality Engineer.
        <br />
        <span style={styles.taglineSub}>AWS Certified • AI & Cloud</span>
      </h2>

      <p style={styles.summary}>
        QA Automation Engineer with 13+ years building enterprise-grade test automation frameworks.
        <br />
        <br />• Web, mobile, API & microservices testing
        <br />• Cloud-native testing pipelines (AWS Lambda, CloudWatch, DynamoDB)
        <br />• AWS Certified AI Practitioner and Developer – Associate — testing AI-powered features
        <br />• Test automation frameworks & architecture
        <br />• Cypress, Selenium, REST API testing
        <br />
        <br />
        Based in Spain • Available for remote US-based roles
      </p>

      <div style={styles.ctaRow}>
        <a href="#contact" className="btn" aria-label="Go to contact section">
          Get in touch
        </a>
        <a
          href="https://www.linkedin.com/in/camiloavila"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ marginLeft: "16px" }}
          aria-label="View LinkedIn profile"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/camiloavilacm/camiloavila.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.iconBtn}
          aria-label="View GitHub repository"
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={styles.icon}
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    paddingTop: "160px",
    paddingBottom: "80px",
    width: "100%",
    maxWidth: "100%",
  },
  greeting: {
    fontFamily: "var(--font-mono)",
    fontSize: "16px",
    color: "var(--accent)",
    marginBottom: "20px",
  },
  name: {
    fontSize: "clamp(38px, 7vw, 70px)",
    fontWeight: 600,
    color: "var(--text-primary)",
    lineHeight: 1.1,
    marginBottom: "10px",
    opacity: 0.9,
  },
  tagline: {
    fontSize: "clamp(24px, 5vw, 50px)",
    fontWeight: 500,
    color: "var(--text-secondary)",
    lineHeight: 1.2,
    marginBottom: "24px",
  },
  taglineSub: {
    fontSize: "clamp(18px, 3.5vw, 36px)",
    color: "var(--text-secondary)",
    opacity: 0.6,
  },
  summary: {
    fontSize: "17px",
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    marginBottom: "40px",
    width: "100%",
  },
  ctaRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
  iconBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    border: "1px solid var(--accent)",
    borderRadius: "var(--border-radius)",
    color: "var(--accent)",
    background: "transparent",
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    cursor: "pointer",
    transition: "var(--transition)",
    textDecoration: "none",
  },
  icon: {
    display: "block",
  },
};

export default Hero;
