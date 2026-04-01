# camiloavila.dev — AI Resume Portfolio

Personal portfolio for **Camilo Avila**, Senior QA Automation Engineer. Features an AI-powered chatbot backed by Amazon Bedrock that answers questions about the resume, and a contact form with automated personalised email replies via SES.

**Live site:** https://camiloavila.dev

---

## What's inside

| Layer          | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| Frontend       | React 18 + Vite + TypeScript                                      |
| Backend        | Python 3.12 AWS Lambda + Strands Agents                           |
| AI             | Amazon Bedrock — `qwen.qwen3-coder-next` via Converse API        |
| Database       | Amazon DynamoDB (contact form submissions)                       |
| Email          | Amazon SES (automated personalised replies)                      |
| Infrastructure | AWS SAM (`template.yaml`)                                         |
| Hosting        | S3 + CloudFront + camiloavila.dev (Route 53 DNS)                 |
| CI/CD          | GitHub Actions (OIDC role assumption — no stored keys)          |
| Unit tests     | Pytest + pytest-html + Allure                                    |
| E2E tests      | Cypress + Puppeteer + Playwright (Allure reports)                |
| Security tests | Pytest + Playwright + Guardrails AI (unit + E2E penetration)   |

---

## Repository structure

```
camiloavila.dev/
├── .github/workflows/
│   ├── pr-checks.yml        # Runs on every PR — lint + unit tests + build check
│   ├── deploy.yml           # Runs on push to main — production deploy + smoke tests
│   └── deploy-develop.yml   # Runs on push to develop — staging deploy + smoke tests
│
├── backend/
│   ├── src/
│   │   ├── handler.py           # Chatbot Lambda entrypoint (POST /chat)
│   │   ├── contact_handler.py   # Contact form Lambda entrypoint (POST /contact)
│   │   ├── agents/
│   │   │   ├── chatbot_agent.py # Strands Agent for Q&A
│   │   │   └── contact_agent.py # Strands Agent for email generation
│   │   ├── tools/
│   │   │   ├── search_resume.py    # Tool: loads KB from S3
│   │   │   ├── get_contact_info.py # Tool: returns contact details
│   │   │   └── generate_reply.py   # Tool: AI email paragraph via Bedrock
│   │   └── utils/
│   │       ├── kb_loader.py     # S3 loader with in-memory cache
│   │       ├── dynamo_client.py # DynamoDB save helpers
│   │       └── ses_client.py    # SES send_email wrapper
│   ├── requirements.txt
│   └── tests/unit/          # Pytest unit tests (6 files, moto mocks)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx          # Name, tagline, CTA buttons
│   │   │   ├── Skills.tsx        # Technical skills grid
│   │   │   ├── Experience.tsx    # Tabbed work history
│   │   │   ├── Certifications.tsx# AWS certs + education
│   │   │   ├── ContactForm.tsx   # Form with validation + API call
│   │   │   └── Chatbot.tsx       # Floating AI chat widget
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── tests/
│   ├── e2e/
│   │   ├── cypress/             # TypeScript E2E tests (chatbot + contact form)
│   │   ├── puppeteer/           # TypeScript browser automation tests
│   │   └── playwright/          # Python smoke + functional tests
│   └── package.json             # Cypress + Puppeteer dependencies
│
├── docs/
│   └── architecture.md          # Full component diagrams and flow descriptions
│
├── knowledge_base.md            # RAG source — Camilo's full CV in structured text
├── template.yaml                # AWS SAM — ALL infrastructure as code
├── samconfig.toml               # SAM deploy configuration
└── CONTRIBUTING.md              # How to contribute
```

For full component diagrams and flow descriptions, see [`docs/architecture.md`](docs/architecture.md).

---

## Local development setup

### Prerequisites

- Python 3.12
- Node.js 20+
- AWS SAM CLI (`brew install aws-sam-cli` or [see docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- AWS CLI configured with your account
- Docker (for `sam local start-api`)

### 1. Clone and install

```bash
git clone https://github.com/camiloavilacm/camiloavila.dev.git
cd camiloavila.dev

# Backend dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Frontend dependencies
cd frontend && npm install && cd ..

# Test dependencies
cd tests && npm install && cd ..

# Playwright browser
pip install playwright pytest pytest-html
playwright install chromium
```

### 2. Configure environment

```bash
# Backend — set environment variables (or use a .env file with python-dotenv)
export KNOWLEDGE_BUCKET=your-kb-bucket-name
export BEDROCK_MODEL_ID=qwen.qwen3-coder-next
export CONTACT_TABLE=camiloavila-contacts
export SES_SENDER_EMAIL=camiloavilainfo@gmail.com
export ALLOWED_ORIGIN=http://localhost:5173

# Frontend — create local env file
cp frontend/.env.example frontend/.env.local
# Edit .env.local and set: VITE_API_URL=http://localhost:3000

# IMPORTANT: Get knowledge_base.md for local testing
# The file is NOT in the repo (it's in .gitignore to protect personal data)
# Option A: Download from S3
aws s3 cp s3://your-kb-bucket-name/knowledge_base.md ./
# Option B: Ask the owner (Camilo) for a copy
```

### 3. Sync knowledge_base.md

The knowledge base is stored in S3 (source of truth) and excluded from git to protect personal data.

**Get your S3 bucket name:**
```bash
# From CloudFormation stack outputs
aws cloudformation describe-stacks --stack-name camiloavila-dev --query "Stacks[0].Outputs[?OutputKey=='KnowledgeBaseBucketName'].OutputValue" --output text
```

**To update after making changes:**
```bash
aws s3 cp ./knowledge_base.md s3://camiloavila-knowledge-base-<ACCOUNT_ID>/knowledge_base.md
```

**To download latest from S3:**
```bash
aws s3 cp s3://camiloavila-knowledge-base-<ACCOUNT_ID>/knowledge_base.md ./
```

### 3. Run locally

```bash
# Terminal 1 — API (Lambda emulation)
sam local start-api

# Terminal 2 — Frontend (Vite dev server)
cd frontend && npm run dev

# Open http://localhost:5173
```

### Security guardrails

The chatbot and contact form include built-in security guardrails to ensure the AI only responds to appropriate requests and to prevent abuse.

#### Chatbot guardrails (`handler.py`)

- **Pre-validation layer**: Blocks suspicious patterns (prompt injection, jailbreak attempts) and off-topic keywords before the question reaches the AI model
- **System prompt enforcement**: The agent is configured with a strict system prompt that limits responses to Camilo Avila's resume and professional background only
- **Off-topic handling**: Questions about weather, sports, politics, or other unrelated topics receive a polite refusal with contact information

#### Contact form guardrails (`contact_handler.py` + `contact_agent.py`)

- **Input validation**: Messages are checked for suspicious patterns (script tags, JavaScript injection, etc.) before processing
- **Output validation**: AI-generated email replies are validated to ensure no malicious content is included before sending
- **System prompt constraints**: The email generator is restricted to safe, professional 2-3 sentence responses with no HTML, links, or code

#### Blocked patterns

The following are blocked at the pre-validation stage:

| Category           | Examples                                                               |
| ------------------ | ---------------------------------------------------------------------- |
| Prompt injection   | "ignore previous", "system prompt", "you are now", "forget everything" |
| Off-topic keywords | weather, sports, politics, news, stock price, celebrity, health advice |
| Suspicious input   | `<script>`, `javascript:`, `onerror=`, `eval(`                         |
| Malicious output   | `<script>`, `javascript:`, URLs in AI responses                        |

---

## Running tests

### Unit tests (Pytest)

```bash
pytest backend/tests/unit/ -v

# With HTML report:
mkdir -p reports/unit
pytest backend/tests/unit/ -v \
  --html=reports/unit/report.html \
  --self-contained-html \
  --cov=backend/src \
  --cov-report=html:reports/unit/coverage
# Open reports/unit/report.html
```

### Cypress E2E tests (TypeScript)

```bash
# Against local dev server:
cd tests
CYPRESS_BASE_URL=http://localhost:5173 npm run test:cypress

# Interactive mode:
npm run test:cypress:open
# Report: reports/e2e/cypress/index.html
```

### Puppeteer tests (TypeScript)

```bash
cd tests
PUPPETEER_BASE_URL=http://localhost:5173 npm run test:puppeteer
# Report: reports/e2e/puppeteer/report.html
```

### Playwright tests (Python)

```bash
PLAYWRIGHT_BASE_URL=http://localhost:5173 pytest tests/e2e/playwright/ -v
# Report: reports/e2e/playwright/report.html

# Smoke only:
pytest tests/e2e/playwright/ -m smoke -v

# Functional only:
pytest tests/e2e/playwright/ -m functional -v
```

---

## First deployment (manual)

The CI/CD pipeline automates all subsequent deploys. The first deploy requires a few manual steps:

### Step 1 — Request ACM certificate

1. AWS Console → Certificate Manager → Request public certificate
2. Add domains: `camiloavila.dev` and `www.camiloavila.dev`
3. Choose **DNS validation** — ACM gives you two CNAME records
4. Add those CNAMEs in **Route 53** for `camiloavila.dev`
5. Wait for status: "Issued"
6. Copy the Certificate ARN

### Step 2 — Verify SES sender

1. AWS Console → SES → Verified Identities → Create Identity
2. Email address → `camiloavilainfo@gmail.com`
3. Click verification link in your Gmail
4. Request **SES production access** to send to unverified recipients

### Step 3 — Create IAM role for GitHub Actions

1. IAM → Identity providers → Add provider → OpenID Connect
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
2. IAM → Roles → Create role → Web identity → select the OIDC provider
3. Attach policies listed in [docs/architecture.md](docs/architecture.md#7-iam-permissions-least-privilege)
4. Note the role ARN

### Step 4 — Configure GitHub Secrets

Go to your repo → Settings → Secrets and variables → Actions:

| Secret                        | Value                                        |
| ----------------------------- | -------------------------------------------- |
| `AWS_ROLE_TO_ASSUME`          | IAM role ARN from Step 3                     |
| `AWS_REGION`                  | `us-east-1`                                  |
| `ACM_CERTIFICATE_ARN`         | From Step 1                                  |
| `BEDROCK_MODEL_ID`            | `qwen.qwen3-coder-next`                      |
| `SES_SENDER_EMAIL`            | `camiloavilainfo@gmail.com`                  |
| `PLAYWRIGHT_BASE_URL`         | `https://camiloavila.dev`                    |
| `STAGING_PLAYWRIGHT_BASE_URL` | `https://staging.camiloavila.dev` (optional) |
| `STAGING_S3_FRONTEND_BUCKET`  | (add after first staging deploy)             |
| `STAGING_CLOUDFRONT_DIST_ID`  | (add after first staging deploy)             |

### Step 5 — First SAM deploy

```bash
# Update samconfig.toml with your Certificate ARN first
# Then:
sam build && sam deploy --guided
```

After deploy, the stack outputs:

- `ApiUrl` → add as `VITE_API_URL` in your frontend `.env.local`
- `CloudFrontUrl` → use for Route 53 DNS setup (Step 6)
- `FrontendBucketName` → add as `S3_FRONTEND_BUCKET` GitHub Secret
- `CloudFrontDistributionId` → add as `CLOUDFRONT_DISTRIBUTION_ID` GitHub Secret

### Step 6 — Point Route 53 DNS to CloudFront

In AWS Console → Route 53 → Hosted Zones → `camiloavila.dev`:

- Add `ALIAS` record: `camiloavila.dev` → `xyz.cloudfront.net` (from Step 5 output)
- Add `CNAME` record: `www.camiloavila.dev` → `xyz.cloudfront.net`

Wait ~15 minutes for DNS propagation.

From this point, every push to `main` triggers the full deploy pipeline automatically.

### Step 7 — First Staging Deploy (optional)

To enable staging environment:

1. Create and push the `develop` branch:

   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

2. Add staging secrets in GitHub (Settings → Secrets → Actions):
   - `STAGING_PLAYWRIGHT_BASE_URL` = `https://staging.camiloavila.dev`

3. Push any change to `develop` to trigger `deploy-develop.yml`

4. After staging deploy completes, add these secrets:
   - `STAGING_S3_FRONTEND_BUCKET` = FrontendBucketName (from CloudFormation output)
   - `STAGING_CLOUDFRONT_DIST_ID` = CloudFrontDistributionId (from CloudFormation output)

5. Configure DNS in Route 53:
   - Add CNAME: `staging` → `<staging-cloudfront>.cloudfront.net`

---

## CI/CD overview

Three workflows:

**`pr-checks.yml`** — runs on every PR to `main` or `develop`:

- Python lint (flake8) + Pytest unit tests + coverage report
- ESLint + TypeScript check + npm audit + Vite build check
- E2E tests (only on PRs to `develop` against staging)
- Uploads HTML + Allure reports as artifacts

**`deploy-develop.yml`** — runs on push to `develop`:

1. All PR checks (lint + unit tests)
2. SAM build + deploy to staging stack (`camiloavila-dev-staging`)
3. Upload `knowledge_base.md` to staging S3
4. Vite build + S3 sync + CloudFront invalidation
5. Smoke tests against staging site (Cypress + Puppeteer + Playwright)
6. Publish Allure reports to GitHub Pages

**`deploy.yml`** — runs on push to `main`:

1. All PR checks (lint + unit tests)
2. SAM build + deploy (CloudFormation stack update)
3. Upload `knowledge_base.md` to S3
4. Vite build (with real API URL) + S3 sync + CloudFront invalidation
5. Smoke tests against live site (Cypress + Puppeteer + Playwright)
6. Publish Allure reports to GitHub Pages

---

## Environments

| Environment | Branch    | URL                             | Stack Name              |
| ----------- | --------- | ------------------------------- | ----------------------- |
| Production  | `main`    | https://camiloavila.dev         | camiloavila-dev         |
| Staging     | `develop` | https://staging.camiloavila.dev | camiloavila-dev-staging |

### Workflow

```
feature branch → PR to develop → E2E tests → merge to develop → staging deploy
                                      ↓
                              PR to main → E2E tests → merge to main → production deploy
```

### GitHub Pages Reports

Allure test reports are automatically published to GitHub Pages after each deploy:

- Staging: Available after `deploy-develop.yml` completes
- Production: Available after `deploy.yml` completes

Access reports at: `https://camiloavilacm.github.io/camiloavila.dev/`

---

## Adding new content to the chatbot

To update what the chatbot knows, edit [`knowledge_base.md`](knowledge_base.md) and push to `main`. The CI/CD pipeline uploads the updated file to S3 automatically. The Lambda picks up the new content on the next cold start.

---

## Enabling Allure Reports

Allure test reports are published to GitHub Pages after each deploy (staging and production).

### Setup GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to **"GitHub Actions"**
3. Save

### Accessing Reports

After a deploy completes, visit:

- Staging: `https://camiloavilacm.github.io/camiloavila.dev/` (after `deploy-develop.yml`)
- Production: `https://camiloavilacm.github.io/camiloavila.dev/` (after `deploy.yml`)

---

## Contact

**Camilo Avila**
Senior QA Automation Engineer

- Email: camiloavilainfo@gmail.com
- Phone: +34 655 524 297
- LinkedIn: https://www.linkedin.com/in/camiloavila
- Location: Spain — available for remote roles (US working hours)

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/camiloavilacm/camiloavila.dev?utm_source=oss&utm_medium=github&utm_campaign=camiloavilacm%2Fcamiloavila.dev&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
