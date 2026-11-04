import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms of Service — Camilo Avila';
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>
          ← Back to Portfolio
        </Link>
      </header>

      <main style={styles.container}>
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.meta}>Effective Date: November 4, 2026 | Last Updated: November 4, 2026</p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p style={styles.paragraph}>
            By accessing or using{' '}
            <a href="https://camiloavila.dev" style={styles.link}>
              camiloavila.dev
            </a>{' '}
            (the &quot;Site&quot;), including any associated interactive features, demonstrations,
            or the AI Resume Assistant, you agree to be bound by these Terms of Service. If you do
            not agree to these terms, please do not use the Site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Description of the Site</h2>
          <p style={styles.paragraph}>
            This Site is the professional portfolio of Camilo Avila, Senior QA Automation Engineer.
            It provides information about professional background, engineering skills, case studies,
            certifications, and includes interactive technical demonstrations such as an AI Resume
            Assistant and contact form.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Acceptable Use</h2>
          <p style={styles.paragraph}>
            You agree to use this Site responsibly and lawfully. You agree NOT to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Attempt to disrupt, overload, or compromise the security, integrity, or availability
              of the website, APIs, Lambda functions, or underlying AWS infrastructure.
            </li>
            <li style={styles.listItem}>
              Submit malicious code, viruses, automated spam, or abusive messages through the
              contact form or chatbot input.
            </li>
            <li style={styles.listItem}>
              Attempt adversarial prompt injection or extract unauthorized confidential data from
              the AI assistant.
            </li>
            <li style={styles.listItem}>
              Scrape or harvest data from the Site using automated means for unauthorized commercial
              purposes.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. AI Assistant Disclaimer</h2>
          <p style={styles.paragraph}>
            The AI Resume Assistant is an interactive generative AI demonstration powered by Amazon
            Bedrock. While designed to provide accurate context regarding Camilo Avila&apos;s
            resume, experience, and technical achievements:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              The assistant is provided for informational and demonstration purposes only.
            </li>
            <li style={styles.listItem}>
              AI responses do not constitute legally binding commitments or contracts.
            </li>
            <li style={styles.listItem}>
              For verified professional inquiries or formal job proposals, please reach out directly
              via the contact form or LinkedIn.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Intellectual Property</h2>
          <p style={styles.paragraph}>
            All original content, designs, diagrams, and written materials on this Site are the
            property of Camilo Avila, unless otherwise noted (such as third-party trademarks or
            open-source software licenses). You may view and link to the content for personal,
            non-commercial evaluation.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            6. Disclaimer of Warranties &amp; Limitation of Liability
          </h2>
          <p style={styles.paragraph}>
            The Site and all demonstrations are provided &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; without warranties of any kind, whether express or implied. In no event
            shall Camilo Avila be liable for any indirect, incidental, or consequential damages
            arising from the use of or inability to use this Site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Modifications to Terms</h2>
          <p style={styles.paragraph}>
            We reserve the right to modify these Terms at any time. Any changes will be posted on
            this page with an updated &quot;Last Updated&quot; date.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Contact Information</h2>
          <p style={styles.paragraph}>
            For questions regarding these Terms of Service, please contact:{' '}
            <a href="mailto:camiloavilainfo@gmail.com" style={styles.link}>
              camiloavilainfo@gmail.com
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

export default TermsOfService;
