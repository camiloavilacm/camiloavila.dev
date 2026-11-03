# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Engineering leaders, hiring managers, and technical recruiters seeking to evaluate a Senior QA Automation Engineer with deep expertise in full-stack test automation frameworks, cloud architectures, and AI integration.

## Product Purpose
Provide an interactive, high-credibility resume portfolio demonstrating 13+ years of enterprise QA leadership, client impact, and multi-cloud certifications. Enable visitors to explore career milestones, review test strategy depth, and interact with live AI capabilities and contact channels.

## Positioning
An interactive resume that combines 13+ years of automation leadership, client track record, and multi-cloud certifications with real working systems (an Amazon Bedrock AI resume chatbot, live test coverage dashboards, and CI/CD pipelines) rather than static resume bullet points.

## Operating Context
- Web desktop and mobile browsers used during hiring evaluation cycles, technical screenings, and portfolio reviews.
- Connected services include Amazon Bedrock (`amazon.nova-lite-v1:0` via Converse API) for conversational querying of the resume and AWS SES + DynamoDB for verified contact messaging.
- GitHub Actions CI/CD pipelines producing public Allure test reports and coverage dashboards.

## Capabilities and Constraints
- Functional Capabilities:
  - Interactive AI Chatbot: queries resume knowledge base directly via Amazon Bedrock.
  - Case Study & Architecture Showcases: standalone demonstration routes (`/use-case/0293828`).
  - Contact System: form submission persisted in DynamoDB with automated personalized email responses via SES.
  - Interactive Skills, Experience, and Certifications breakdowns.
- Technical & Design Constraints:
  - Stack: React 18, Vite, TypeScript, Tailwind CSS, TanStack Query & Table, ECharts, Lucide React.
  - Serverless backend: Python 3.13 Lambda, Strands Agents, AWS SAM.
  - Strict code quality standards: zero-warning ESLint, Prettier, TypeScript strict mode, comprehensive multi-tier testing (unit, E2E, security, accessibility).

## Brand Commitments
- Name: Camilo Avila
- Title: Senior QA Automation Engineer
- Live Domain: https://camiloavila.dev
- Voice: Authoritative, pragmatic, professional, metrics-driven, and clear.

## Evidence on Hand
- 13+ years of QA Automation engineering records spanning enterprise clients (Credit Mountain, Minded, TeraCode, Naranja Digital Bank, Baufest, Penta Security Solutions, HP Enterprise).
- Active AWS Certifications: AWS Certified Developer – Associate, AWS Certified AI Practitioner (AIF-C01).
- Live interactive chatbot backed by Amazon Bedrock.
- Publicly verifiable test coverage dashboard and Allure test reports on GitHub Pages.
- Repository documentation: [README.md](file:///Users/camiloavila/Documents/website/README.md), [knowledge_base.md](file:///Users/camiloavila/Documents/website/knowledge_base.md).

## Product Principles
1. **Credibility Through Demonstration:** Substantiate claims with working software, live metrics, and verifiable test artifacts.
2. **Clarity of Impact:** Emphasize measurable business and engineering outcomes across roles and frameworks.
3. **Frictionless Navigation:** Allow hiring managers and recruiters to quickly scan experience, verify credentials, and engage directly.

## Accessibility & Inclusion
- Target WCAG 2.1 AA compliance across all components, tested with Playwright automated accessibility suites.
- High-contrast typography, clear keyboard navigation, screen-reader-friendly semantic HTML, and responsive layouts across all device sizes.
