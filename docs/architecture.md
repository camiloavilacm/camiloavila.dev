# Architecture — camiloavila.dev

This document describes every component of the portfolio system and how they connect.

---

## 1. High-Level Architecture

```
                          ┌─────────────────────────────────────────────┐
                          │                  Visitor                     │
                          └───────────────────┬─────────────────────────┘
                                              │ HTTPS
                                              ▼
                          ┌─────────────────────────────────────────────┐
                          │            CloudFront (CDN + HTTPS)         │
                          │         https://camiloavila.dev              │
                          │    TLS via ACM cert (us-east-1)             │
                          └───────────┬──────────────────────┬──────────┘
                                      │                      │
                             Static   │                      │ API calls
                             assets   │                      │ /chat /contact
                                      ▼                      ▼
                     ┌────────────────────────┐   ┌─────────────────────────┐
                     │  S3 (Frontend Bucket)  │   │  API Gateway HTTP API   │
                     │  index.html, JS, CSS   │   │  POST /chat             │
                     │  (Vite build output)   │   │  POST /contact          │
                     └────────────────────────┘   └──────────┬──────────────┘
                                                             │
                                              ┌──────────────┴─────────────────┐
                                              │                                │
                                              ▼                                ▼
                              ┌───────────────────────────┐  ┌──────────────────────────┐
                              │  ChatbotFunction (Lambda) │  │ ContactFunction (Lambda) │
                              │  handler.py               │  │ contact_handler.py       │
                              │  Python 3.12 / 256MB      │  │ Python 3.12 / 256MB      │
                              │  Timeout: 30s             │  │ Timeout: 30s             │
                              └──────────┬────────────────┘  └─────────┬────────────────┘
                                         │                              │
                         ┌───────────────┼──────────────┐              │
                         │               │              │              │
                         ▼               ▼              ▼              ▼
                  ┌──────────┐   ┌──────────────┐  ┌────────┐  ┌──────────────┐
                  │ Strands  │   │ knowledge_   │  │Bedrock │  │  DynamoDB    │
                  │ Agent    │   │ base.md      │  │Converse│  │  ContactTable│
                  │(chatbot) │   │ (S3, cached) │  │  API   │  │              │
                  └──────────┘   └──────────────┘  └────────┘  └──────────────┘
                         │                                              │
                         └──────────── Tools ────────────────┐         │
                                                             │         ▼
                                         ┌───────────────────┤   ┌──────────┐
                                         │ search_resume     │   │  SES     │
                                         │ get_contact_info  │   │ (email)  │
                                         │ generate_reply    │   └──────────┘
                                         └───────────────────┘
```

---

## 2. Chatbot Request Flow

A visitor types a question in the chat widget:

```
1. Visitor types: "What are your AWS certifications?"

2. React Chatbot.tsx
   → POST https://camiloavila.dev/api/chat
   → body: { "question": "What are your AWS certifications?" }

3. CloudFront forwards to API Gateway

4. API Gateway triggers ChatbotFunction Lambda (handler.py)
   → Validates question (empty check, 500 char limit)
   → Calls agents/chatbot_agent.py::ask(question)

5. ChatbotAgent (Strands Agent)
   → Creates agent with search_resume + get_contact_info tools
   → Invokes Bedrock Converse API (qwen.qwen3-coder-next)
   → Bedrock decides to call search_resume("AWS certifications")

6. search_resume tool
   → Calls utils/kb_loader.py::get_knowledge_base()
   → First call: fetches knowledge_base.md from S3 (cached in memory)
   → Returns full KB content to Bedrock

7. Bedrock generates answer using KB context
   → "Camilo holds two AWS certifications: Developer Associate and AI Practitioner (AIF-C01)."

8. Lambda returns:
   → 200 { "answer": "Camilo holds two AWS certifications..." }

9. React renders answer in chat bubble (left-aligned, navy background)

Total time: ~3-8s (cold start) / ~1-3s (warm)
```

---

## 3. Contact Form Request Flow

A visitor fills the form and clicks Send:

```
1. Visitor fills: name="Jane", email="jane@example.com", message="Interested in your QA skills"

2. React ContactForm.tsx
   → Client-side validation (required fields, email format, max length)
   → POST https://camiloavila.dev/api/contact
   → body: { "name": "Jane", "email": "jane@example.com", "message": "..." }

3. API Gateway triggers ContactFunction Lambda (contact_handler.py)
   → Validates all fields (presence, email regex, length)
   → Calls agents/contact_agent.py::process_contact(name, email, message)

4. ContactAgent (Strands Agent)
   → Calls generate_reply tool with visitor name + message

5. generate_reply tool (tools/generate_reply.py)
   → Calls Bedrock Converse API
   → Returns 3-4 sentence personalised paragraph

6. contact_handler (back in process_contact)
   → Calls utils/ses_client.py::send_contact_reply(email, name, ai_paragraph)
   → SES sends HTML + text email to visitor's address
     FROM: camiloavilainfo@gmail.com
     TO:   jane@example.com
     Body: Fixed opening + AI paragraph + fixed footer with Camilo's contact details

7. Calls utils/dynamo_client.py::save_contact(...)
   → Saves record to DynamoDB ContactTable:
     { id, timestamp, name, email, message, ai_reply, status: "sent" }

8. Lambda returns:
   → 200 { "message": "Thank you, Jane! ... reply has been sent to jane@example.com." }

9. React shows success state — green confirmation box
```

---

## 4. CI/CD Pipeline Flow

```
Developer pushes to main branch
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                 GitHub Actions: deploy.yml               │
│                                                         │
│  Stage 1: backend-checks                                │
│    └─ flake8 lint                                       │
│    └─ pytest unit tests (moto mocks — no real AWS)      │
│    └─ HTML report → artifact                            │
│                                                         │
│  Stage 2: frontend-checks                               │
│    └─ eslint                                            │
│    └─ tsc --noEmit (type check)                         │
│    └─ npm audit                                         │
│    └─ vite build                                        │
│                                                         │
│  Stage 3: deploy-backend  (needs: stages 1+2)           │
│    └─ sam build                                         │
│    └─ sam deploy → CloudFormation stack update          │
│    └─ Outputs: API Gateway URL                          │
│                                                         │
│  Stage 4: upload-kb  (needs: stage 3)                   │
│    └─ aws s3 cp knowledge_base.md → S3 KB bucket        │
│                                                         │
│  Stage 5: deploy-frontend  (needs: stage 3)             │
│    └─ vite build (with real VITE_API_URL from stage 3)  │
│    └─ aws s3 sync dist/ → S3 frontend bucket            │
│    └─ cloudfront create-invalidation /* (cache bust)    │
│                                                         │
│  Stage 6: smoke-tests  (needs: stages 4+5)              │
│    └─ Wait 30s for CloudFront propagation               │
│    └─ Cypress E2E (TypeScript) → HTML report            │
│    └─ Puppeteer (TypeScript) → HTML report              │
│    └─ Playwright smoke+functional (Python) → HTML report│
│    └─ All reports → artifacts (30 day retention)        │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Strands Agent Tool Graph

```
ChatbotAgent
  system_prompt: resume guardrail
  model: bedrock/qwen.qwen3-coder-next
  tools:
    ├── search_resume(query: str) → str
    │     Loads knowledge_base.md from S3 (cached)
    │     Returns full CV text for LLM to extract relevant parts
    │
    └── get_contact_info(intent: str) → str
          Returns Camilo's contact details (email, phone, LinkedIn)
          Called when visitor asks "how do I contact Camilo?"

ContactAgent
  system_prompt: email generation prompt
  model: bedrock/qwen.qwen3-coder-next
  tools:
    └── generate_reply(visitor_name: str, visitor_message: str) → str
          Calls Bedrock to generate a personalised 3-4 sentence paragraph
          Falls back to a template paragraph if Bedrock fails
```

---

## 6. DynamoDB Schema

Table name: `camiloavila-contacts`
Billing: PAY_PER_REQUEST

| Attribute  | Type   | Key        | Description                              |
|------------|--------|------------|------------------------------------------|
| id         | String | Partition  | UUID v4 — generated at Lambda runtime   |
| timestamp  | String | Sort       | ISO 8601 UTC — e.g. 2026-03-10T14:00:00Z|
| name       | String |            | Visitor's name from form                 |
| email      | String |            | Visitor's email from form                |
| message    | String |            | Visitor's message from form              |
| ai_reply   | String |            | AI paragraph sent in email (audit trail) |
| status     | String |            | "sent" or "failed"                       |

---

## 7. IAM Permissions (Least Privilege)

### ChatbotFunction Role

| Permission              | Scope                                              |
|-------------------------|----------------------------------------------------|
| s3:GetObject            | `knowledge-bucket/knowledge_base.md` only          |
| bedrock:InvokeModel     | `qwen.qwen3-coder-next` model only                 |
| bedrock:Converse        | `qwen.qwen3-coder-next` model only                 |
| logs:CreateLogGroup     | CloudWatch Logs — Lambda function only             |
| logs:CreateLogStream    | CloudWatch Logs — Lambda function only             |
| logs:PutLogEvents       | CloudWatch Logs — Lambda function only             |

### ContactFunction Role

| Permission              | Scope                                              |
|-------------------------|----------------------------------------------------|
| s3:GetObject            | `knowledge-bucket/knowledge_base.md` only          |
| bedrock:InvokeModel     | `qwen.qwen3-coder-next` model only                 |
| bedrock:Converse        | `qwen.qwen3-coder-next` model only                 |
| dynamodb:PutItem        | `camiloavila-contacts` table only                  |
| ses:SendEmail           | Condition: FromAddress = camiloavilainfo@gmail.com |
| logs:*                  | CloudWatch Logs — Lambda function only             |

### GitHub Actions Role (OIDC)

Policies attached: AmazonS3FullAccess, CloudFrontFullAccess, AWSLambda_FullAccess,
AmazonAPIGatewayAdministrator, AWSCloudFormationFullAccess, AmazonDynamoDBFullAccess,
AmazonSESFullAccess, AmazonBedrockFullAccess, IAMFullAccess

---

## 8. Test Suite Architecture

```
Test Pyramid for camiloavila.dev

                  ┌──────────────┐
                  │  Playwright  │  ← Smoke + Functional (Python)
                  │  (live site) │    Fast smoke: ~10s
                  │              │    Functional: ~60s (Bedrock)
                  └──────┬───────┘
                         │
              ┌──────────┴──────────┐
              │       Cypress       │  ← E2E (TypeScript)
              │  (live site, post-  │    Full user journeys
              │    deploy smoke)    │    ~2-5 min
              └──────────┬──────────┘
                         │
         ┌───────────────┴───────────────┐
         │           Puppeteer           │  ← Browser automation (TypeScript)
         │  (DOM structure, interaction, │    Lower-level than Cypress
         │   screenshot capture)         │    ~2-3 min
         └───────────────┬───────────────┘
                         │
┌────────────────────────┴────────────────────────┐
│                   Pytest (unit)                  │  ← Fast, no AWS (moto mocks)
│  handler, contact_handler, tools, utils          │    ~5-15s
│  All AWS services mocked via moto                │
└──────────────────────────────────────────────────┘
```

---

## 9. File → AWS Resource Mapping

| File                              | AWS Resource                        |
|-----------------------------------|-------------------------------------|
| `backend/src/handler.py`          | ChatbotFunction Lambda              |
| `backend/src/contact_handler.py`  | ContactFunction Lambda              |
| `knowledge_base.md`               | S3 KnowledgeBaseBucket object       |
| `frontend/dist/`                  | S3 FrontendBucket (after build)     |
| `template.yaml`                   | CloudFormation stack (all resources)|
| `.github/workflows/deploy.yml`    | GitHub Actions → triggers all above |

---

## 10. Local Development Setup

See `README.md` for full setup instructions.

Quick reference:
```bash
# Backend (Lambda + API)
pip install -r backend/requirements.txt
sam local start-api          # Runs API on http://localhost:3000

# Frontend
cd frontend
npm install
cp .env.example .env.local   # Set VITE_API_URL=http://localhost:3000
npm run dev                  # Runs on http://localhost:5173

# Unit tests
pytest backend/tests/unit/ -v

# E2E tests (against local Vite + SAM)
cd tests && npm install
CYPRESS_BASE_URL=http://localhost:5173 npm run test:cypress
PUPPETEER_BASE_URL=http://localhost:5173 npm run test:puppeteer
PLAYWRIGHT_BASE_URL=http://localhost:5173 pytest tests/e2e/playwright/
```
