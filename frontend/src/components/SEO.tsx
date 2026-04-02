/**
 * SEO.tsx — SEO Meta Tags Component
 *
 * Manages meta tags, Open Graph, Twitter cards, and structured data
 * for SEO optimization.
 */

import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

const DEFAULT_TITLE = 'Camilo Avila | QA Automation Engineer';
const DEFAULT_DESCRIPTION =
  'QA Automation Engineer with 15+ years building enterprise-grade test automation frameworks. Expert in Selenium, Playwright, Cypress, and cloud-native testing pipelines.';
const CANONICAL_URL = 'https://camiloavila.dev';

const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl = CANONICAL_URL,
}) => {
  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="QA Automation Engineer, Test Automation, Selenium, Playwright, Cypress, CI/CD, AWS, Software Testing"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Camilo Avila Portfolio" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/favicon.svg" />

      {/* Structured Data - Person Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Camilo Avila',
          url: 'https://camiloavila.dev',
          jobTitle: 'QA Automation Engineer',
          description:
            'QA Automation Engineer specializing in test automation frameworks, Selenium, Playwright, Cypress, and CI/CD pipelines.',
          sameAs: ['https://www.linkedin.com/in/camiloavila', 'https://github.com/camiloavila'],
          knowsAbout: [
            'QA Automation',
            'Selenium',
            'Playwright',
            'Cypress',
            'Test Automation',
            'CI/CD',
            'AWS',
            'Python',
            'JavaScript',
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Spain',
            addressCountry: 'ES',
          },
        })}
      </script>
    </>
  );
};

export default SEO;
