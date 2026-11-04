import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy — Camilo Avila';
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>
          ← Back to Portfolio
        </Link>
      </header>

      <main style={styles.container}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.meta}>Effective Date: November 4, 2026 | Last Updated: November 4, 2026</p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introduction</h2>
          <p style={styles.paragraph}>
            This Privacy Policy explains how Camilo Avila (&quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;) collects, uses, and protects information when you visit{' '}
            <a href="https://camiloavila.dev" style={styles.link}>
              camiloavila.dev
            </a>{' '}
            (the &quot;Site&quot;), including interaction with the portfolio demonstration and the
            AI Resume Assistant.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Information We Collect</h2>
          <p style={styles.paragraph}>
            We collect minimal personal data required to respond to your inquiries and demonstrate
            technical capabilities:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong style={styles.highlight}>Contact Form Information:</strong> When you send a
              message through our contact form, we collect your name, email address, and the content
              of your message.
            </li>
            <li style={styles.listItem}>
              <strong style={styles.highlight}>AI Chatbot Queries:</strong> Queries submitted to the
              AI Resume Assistant are processed in real time to generate responses related to Camilo
              Avila&apos;s professional experience and skills.
            </li>
            <li style={styles.listItem}>
              <strong style={styles.highlight}>Usage &amp; Diagnostic Logs:</strong> Standard web
              server, CloudFront, and Google tag/analytics logs (such as IP address, browser type,
              referring pages, and timestamp) may be collected to monitor site uptime, performance,
              and security.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. How We Use Information</h2>
          <p style={styles.paragraph}>Information collected on this site is used solely to:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Respond to your professional inquiries, employment opportunities, and messages.
            </li>
            <li style={styles.listItem}>
              Provide relevant answers to questions regarding Camilo Avila&apos;s background via the
              AI Resume Assistant.
            </li>
            <li style={styles.listItem}>
              Maintain website performance, reliability, and security against unauthorized use or
              abuse.
            </li>
          </ul>
          <p style={styles.paragraph}>
            We do <strong>not</strong> sell, rent, or trade your personal information with third
            parties.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Third-Party Services &amp; Cloud Infrastructure</h2>
          <p style={styles.paragraph}>
            The Site is hosted on enterprise cloud infrastructure that complies with industry
            standards:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong style={styles.highlight}>Amazon Web Services (AWS):</strong> CloudFront (CDN),
              S3 (static hosting), Lambda (serverless API), DynamoDB (contact form storage), SES
              (email delivery), and Amazon Bedrock (generative AI inference).
            </li>
            <li style={styles.listItem}>
              <strong style={styles.highlight}>Google Analytics / Google Tag:</strong> Used to
              understand site traffic and interaction metrics.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Data Retention &amp; Security</h2>
          <p style={styles.paragraph}>
            We employ HTTPS/TLS encryption in transit and standard AWS security controls to protect
            your data. Contact inquiries are retained only for as long as necessary to address your
            communication.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Your Rights</h2>
          <p style={styles.paragraph}>
            Depending on your jurisdiction (such as GDPR or CCPA), you may have the right to request
            access to, rectification of, or deletion of your personal contact data submitted to us.
            To exercise any of these rights, please contact us directly.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Contact Us</h2>
          <p style={styles.paragraph}>
            If you have questions about this Privacy Policy or your data, you can reach out via
            email at:{' '}
            <a href="mailto:camiloavilainfo@gmail.com" style={styles.link}>
              camiloavilainfo@gmail.com
            </a>{' '}
            or connect on{' '}
            <a
              href="https://www.linkedin.com/in/camiloavila"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              LinkedIn
            </a>
            .
          </p>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>© 2026 Camilo Avila. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <Link to="/" style={styles.footerLink}>
            Home
          </Link>
          <span style={styles.footerDot}>•</span>
          <Link to="/privacy" style={styles.footerLink}>
            Privacy Policy
          </Link>
          <span style={styles.footerDot}>•</span>
          <Link to="/terms" style={styles.footerLink}>
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary, #0a192f)',
    color: 'var(--text-primary, #ccd6f6)',
    fontFamily: 'var(--font-sans, sans-serif)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '24px 32px',
    borderBottom: '1px solid var(--border, #233554)',
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
  },
  backLink: {
    color: 'var(--accent, #64ffda)',
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: '14px',
    textDecoration: 'none',
  },
  container: {
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    padding: '48px 32px 80px',
    flex: 1,
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
    color: 'var(--text-primary, #ccd6f6)',
    marginBottom: '8px',
  },
  meta: {
    fontSize: '13px',
    color: 'var(--text-secondary, #8892b0)',
    fontFamily: 'var(--font-mono, monospace)',
    marginBottom: '36px',
    borderBottom: '1px solid var(--border, #233554)',
    paddingBottom: '16px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: 'var(--text-primary, #ccd6f6)',
    marginBottom: '12px',
    fontWeight: 600,
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: 'var(--text-secondary, #8892b0)',
    marginBottom: '12px',
  },
  list: {
    paddingLeft: '24px',
    marginBottom: '16px',
    color: 'var(--text-secondary, #8892b0)',
  },
  listItem: {
    fontSize: '15px',
    lineHeight: '1.7',
    marginBottom: '8px',
  },
  highlight: {
    color: 'var(--text-primary, #ccd6f6)',
  },
  link: {
    color: 'var(--accent, #64ffda)',
    textDecoration: 'none',
  },
  footer: {
    borderTop: '1px solid var(--border, #233554)',
    padding: '24px 32px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-secondary, #8892b0)',
    fontFamily: 'var(--font-mono, monospace)',
    marginTop: 'auto',
  },
  footerLinks: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    alignItems: 'center',
  },
  footerLink: {
    color: 'var(--text-secondary, #8892b0)',
    textDecoration: 'none',
  },
  footerDot: {
    color: 'var(--border, #233554)',
  },
};

export default PrivacyPolicy;
