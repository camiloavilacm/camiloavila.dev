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
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    paddingTop: "160px",
    paddingBottom: "80px",
    maxWidth: "700px",
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
    maxWidth: "560px",
  },
  ctaRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
};

export default Hero;
