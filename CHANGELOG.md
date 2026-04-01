# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Accessibility tests (WCAG 2.1 AA)
- Performance tests (k6 load testing)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- AWS WAF configuration with SQL injection, XSS, and rate limiting rules
- Prettier for code formatting

### Changed
- Improved code quality by extracting shared response builder utility
- Updated README with comprehensive security and testing documentation

### Fixed
- SQL injection patterns added to security guardrails
- CSP header added for XSS protection

---

## [1.0.0] - 2026-04-01

### Added
- AI Resume Chatbot powered by Amazon Bedrock
- Contact form with automated personalized email replies via SES
- Security guardrails with pre-validation (prompt injection, off-topic blocking)
- SEO optimization (meta tags, sitemap, robots.txt, JSON-LD schema)
- Favicon with brand initial (C)
- Weekly automated security scans
- Unit tests for backend (Pytest)
- E2E tests (Cypress, Playwright, Puppeteer)
- GitHub Actions CI/CD pipeline

### Changed
- Migrated to React 18 + Vite + TypeScript
- Implemented AWS Lambda + API Gateway backend
- Added Strands Agents for AI orchestration

---

## [Older Releases]

Initial development and MVP releases prior to v1.0.0 are not listed here.

---

## Migration Guides

### Upgrading to v1.0.0
- Ensure Node.js 20+ is installed
- Run `npm install` to get updated dependencies
- Set up environment variables in `.env.local`
- Deploy to AWS via SAM CLI

---

## Deprecated Features

No features have been deprecated as of v1.0.0.