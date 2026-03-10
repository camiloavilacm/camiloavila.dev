/**
 * Certifications.tsx — AWS Certifications & Education Section
 *
 * Displays Camilo's AWS certifications, additional certifications,
 * and education background as cards.
 *
 * AWS certifications are highlighted prominently since they are
 * a key differentiator for the target audience (US tech companies).
 */

import React from "react";

/** A certification or education entry. */
interface CertEntry {
  /** Certificate or degree title. */
  title: string;
  /** Issuing organisation or institution. */
  issuer: string;
  /** Year or period. */
  year: string;
  /** Badge/icon label for visual emphasis. */
  badge?: string;
}

const AWS_CERTS: CertEntry[] = [
  {
    title: "AWS Certified Developer – Associate",
    issuer: "Amazon Web Services",
    year: "Active",
    badge: "AWS",
  },
  {
    title: "AWS Certified AI Practitioner (AIF-C01)",
    issuer: "Amazon Web Services",
    year: "Active",
    badge: "AWS AI",
  },
];

const OTHER_CERTS: CertEntry[] = [
  {
    title: "Project Execution: Running the Project",
    issuer: "Google / Coursera",
    year: "2023",
  },
  {
    title: "Agile Project Management",
    issuer: "Google / Coursera",
    year: "2023",
  },
  {
    title: "Foundations of Project Management",
    issuer: "Google / Coursera",
    year: "2023",
  },
  {
    title: "Data Science",
    issuer: "Digital House",
    year: "2020",
  },
];

const EDUCATION: CertEntry[] = [
  {
    title: "Economist — Economics",
    issuer: "Pontificia Universidad Javeriana",
    year: "1999 – 2005",
  },
];

/**
 * Certifications and education section component.
 *
 * @returns A section with AWS cert cards, other certs, and education.
 */
const Certifications: React.FC = () => {
  return (
    <section id="certifications" aria-labelledby="certs-heading">
      <h2 className="section-heading" id="certs-heading">
        <span className="section-number">03.</span> Certifications & Education
      </h2>

      {/* AWS Certifications — highlighted */}
      <h3 style={styles.subheading}>AWS Certifications</h3>
      <div style={styles.grid}>
        {AWS_CERTS.map((cert) => (
          <div key={cert.title} className="card" style={styles.awsCard}>
            <span style={styles.awsBadge}>{cert.badge}</span>
            <h4 style={styles.certTitle}>{cert.title}</h4>
            <p style={styles.certIssuer}>{cert.issuer}</p>
            <p style={styles.certYear}>{cert.year}</p>
          </div>
        ))}
      </div>

      {/* Other Certifications */}
      <h3 style={{ ...styles.subheading, marginTop: "40px" }}>
        Additional Certifications
      </h3>
      <div style={styles.grid}>
        {OTHER_CERTS.map((cert) => (
          <div key={cert.title} className="card">
            <h4 style={styles.certTitle}>{cert.title}</h4>
            <p style={styles.certIssuer}>{cert.issuer}</p>
            <p style={styles.certYear}>{cert.year}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <h3 style={{ ...styles.subheading, marginTop: "40px" }}>Education</h3>
      <div style={styles.grid}>
        {EDUCATION.map((edu) => (
          <div key={edu.title} className="card">
            <h4 style={styles.certTitle}>{edu.title}</h4>
            <p style={styles.certIssuer}>{edu.issuer}</p>
            <p style={styles.certYear}>{edu.year}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  subheading: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--accent)",
    marginBottom: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  awsCard: {
    borderColor: "var(--accent)",
    position: "relative",
  },
  awsBadge: {
    display: "inline-block",
    background: "var(--accent)",
    color: "var(--bg-primary)",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "3px",
    marginBottom: "12px",
  },
  certTitle: {
    fontSize: "15px",
    color: "var(--text-primary)",
    fontWeight: 500,
    marginBottom: "6px",
    lineHeight: 1.4,
  },
  certIssuer: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginBottom: "4px",
  },
  certYear: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--accent)",
  },
};

export default Certifications;
