# Security Audit Report — camiloavila.dev

**Date:** 2026-05-04  
**Auditor:** Kilo Code (Automated Security Audit)  
**Scope:** Full codebase review covering backend, frontend, infrastructure, CI/CD, and dependencies

---

## Executive Summary

This security audit examined the camiloavila.dev portfolio website across six key areas: backend Python code, frontend React/TypeScript code, AWS infrastructure (SAM template), CI/CD workflows, dependency versions, and existing security test coverage.

**Overall Security Posture: GOOD with room for improvement**

The project demonstrates strong security awareness with multi-layer defense, proper CORS configuration, security headers, input validation, and comprehensive security tests. However, several vulnerabilities and hardening opportunities were identified.

| Category | Severity | Findings |
|----------|----------|----------|
| Backend | Medium | 4 findings |
| Frontend | Low | 3 findings |
| Infrastructure | Medium | 3 findings |
| CI/CD | Low | 2 findings |
| Dependencies | Medium | 2 findings |
| Test Coverage | Low | 2 findings |

---

## 1. Backend Security Audit

### 1.1 Prompt Injection Defense — [`handler.py`](backend/src/handler.py:64)

**Status:** ✅ Well Implemented (with caveats)

**Strengths:**
- Multi-layer defense: Guardrails AI + custom pattern matching + system prompt
- 20+ injection patterns detected including SQL injection, jailbreak, DAN, developer mode
- Off-topic keyword blocking with 18+ keywords
- Fail-secure behavior when Guardrails raises exceptions

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| BE-01 | Medium | **Injection pattern list is static and bypassable** — Attackers can use encoding (URL encoding, Unicode homoglyphs) or whitespace manipulation to bypass string matching. Example: `ignore%20previous` or `ignоre previous` (Cyrillic 'о') |
| BE-02 | Low | **No rate limiting at application level** — While API Gateway may have throttling, the Lambda itself has no request rate limiting, making it vulnerable to cost-based DoS via expensive Bedrock calls |
| BE-03 | Medium | **Guardrails AI validators use deprecated API** — `Guard.from_pydantic()` with string validator paths like `"guardrails/validators/no-secure-sql-queries"` may not work with current guardrails-ai versions. The API has changed significantly in recent versions |
| BE-04 | Low | **Error messages leak internal details** — The `_validate_with_guardrails` function returns `f"Security validation failed: {str(exc)}"` which could expose internal error details to attackers |

**Recommendations:**
1. Add input normalization (lowercase + whitespace normalization + Unicode NFKC normalization) before pattern matching
2. Implement request rate limiting using DynamoDB or API Gateway usage plans
3. Update Guardrails AI integration to use current API (`Guard()` with `validators` list)
4. Sanitize error messages returned to users — log full details but return generic messages

### 1.2 Contact Form Security — [`contact_handler.py`](backend/src/contact_handler.py:75)

**Status:** ✅ Well Implemented

**Strengths:**
- XSS pattern detection (script, javascript:, event handlers, iframe, svg, img)
- SQL injection pattern detection
- Email format validation with regex
- Message length limits (2000 chars)
- Name length limits (100 chars)

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| BE-05 | Medium | **Email regex is vulnerable to ReDoS** — The pattern `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$` can be exploited with crafted input causing catastrophic backtracking |
| BE-06 | Low | **No CSRF protection** — While the API is stateless and CORS-restricted, adding CSRF tokens would provide defense-in-depth for the contact form |

### 1.3 AI Output Validation — [`contact_agent.py`](backend/src/agents/contact_agent.py:46)

**Status:** ✅ Implemented

**Strengths:**
- Output validation before sending emails
- Blocks script tags, javascript: URLs, HTTP/HTTPS links, DOM access patterns
- Fallback to safe content if output is flagged

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| BE-07 | Low | **URL blocking is overly restrictive** — Blocking all `http://` and `https://` patterns prevents legitimate URLs in AI responses. Consider allowing URLs but validating them against a allowlist or sanitizing them |

### 1.4 Knowledge Base Loader — [`kb_loader.py`](backend/src/utils/kb_loader.py)

**Status:** ✅ Secure

**Strengths:**
- S3 access with proper IAM scoping
- In-memory caching reduces S3 calls
- Proper error handling

### 1.5 SES Email Client — [`ses_client.py`](backend/src/utils/ses_client.py:113)

**Status:** ⚠️ Needs Attention

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| BE-08 | **High** | **XSS vulnerability in HTML email** — The `ai_paragraph` is directly interpolated into HTML email body without sanitization at line 126: `<p>{ai_paragraph.strip()}</p>`. While output validation exists, it uses simple string matching that can be bypassed |
| BE-09 | Low | **Email template uses f-string with user data** — The `to_name` is used in f-strings for HTML email without HTML entity encoding, allowing potential HTML injection in the name field |

**Recommendations:**
1. Use a proper HTML sanitizer (e.g., `bleach` library) before embedding AI content in HTML emails
2. HTML-encode all user-provided values before embedding in email templates

### 1.6 DynamoDB Client — [`dynamo_client.py`](backend/src/utils/dynamo_client.py)

**Status:** ✅ Secure

**Strengths:**
- Uses boto3 resource with proper error handling
- No SQL injection risk (NoSQL)
- Proper type hints with TypedDict

---

## 2. Frontend Security Audit

### 2.1 Chatbot Component — [`Chatbot.tsx`](frontend/src/components/Chatbot.tsx)

**Status:** ⚠️ Needs Attention

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| FE-01 | **High** | **Stored XSS via ReactMarkdown** — The chatbot renders AI responses through `ReactMarkdown` at line 112-138. While ReactMarkdown sanitizes by default, custom component overrides could introduce vulnerabilities if the AI generates malicious markdown. The `code` and `strong` component customizations pass children directly |
| FE-02 | Low | **No input sanitization on client side** — User input is sent directly to the API without client-side sanitization. While server-side validation exists, client-side sanitization provides defense-in-depth |
| FE-03 | Low | **API URL exposed in client bundle** — The `VITE_API_URL` is embedded in the client-side JavaScript bundle, making the API endpoint visible to anyone inspecting the source |

**Recommendations:**
1. Configure ReactMarkdown with `allowedElements` to restrict which HTML elements can be rendered
2. Add client-side input validation/sanitization before sending to API
3. Consider that API URL exposure is acceptable for this use case (public API)

### 2.2 Contact Form Component — [`ContactForm.tsx`](frontend/src/components/ContactForm.tsx)

**Status:** ✅ Well Implemented

**Strengths:**
- Client-side validation with regex
- Field length limits
- Email format validation
- Proper `noValidate` attribute with custom validation
- ARIA attributes for accessibility
- External links use `rel="noopener noreferrer"`

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| FE-04 | Low | **Same email regex ReDoS vulnerability** — The frontend uses the same vulnerable regex pattern as the backend |

### 2.3 SEO Component — [`SEO.tsx`](frontend/src/components/SEO.tsx)

**Status:** ✅ Secure

### 2.4 General Frontend Security

**Strengths:**
- TypeScript strict mode enabled
- No `dangerouslySetInnerHTML` usage found
- CSP headers configured in backend
- HSTS, X-Frame-Options, X-Content-Type-Options headers set

---

## 3. Infrastructure Security Audit (SAM Template)

### 3.1 IAM Roles — [`template.yaml`](template.yaml:190)

**Status:** ✅ Well Configured

**Strengths:**
- Separate roles for each Lambda function
- Least privilege principle applied
- Resource-level permissions for S3 and DynamoDB
- SES condition-based restriction on FromAddress

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| INF-01 | Medium | **Bedrock permissions are too broad** — The policy allows `bedrock:*` on `arn:aws:bedrock:${AWS::Region}::foundation-model/*`. This should be restricted to the specific model ID used |
| INF-02 | Low | **X-Ray tracing enabled but may not be used** — `AWSXRayDaemonWriteAccess` is attached but X-Ray may not be actively used, adding unnecessary permissions |

### 3.2 S3 Buckets

**Status:** ✅ Secure

**Strengths:**
- Public access blocked on knowledge base bucket
- CloudFront OAC for frontend bucket (not legacy OAI)
- Bucket policy restricts access to specific CloudFront distribution

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| INF-03 | Low | **Frontend bucket has duplicate tags** — Lines 135-138 repeat the same tags, which is a configuration error (not security but indicates lack of review) |

### 3.3 API Gateway

**Status:** ✅ Secure

**Strengths:**
- CORS properly configured with specific origins
- HTTP API (not REST API) — lower cost and attack surface
- MaxAge set for CORS preflight caching

### 3.4 CloudFront

**Status:** ✅ Secure

**Strengths:**
- TLS 1.2 minimum protocol version
- HTTP to HTTPS redirect
- PriceClass_100 for cost optimization
- OAC for S3 access

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| INF-04 | Low | **No WAF association** — The CloudFront distribution does not have a Web Application Firewall (WAF) attached. For a production site handling contact form submissions, a WAF would provide additional protection against common web attacks |

---

## 4. CI/CD Security Audit

### 4.1 GitHub Actions Workflows

**Status:** ✅ Well Configured

**Strengths:**
- OIDC role assumption (no stored AWS keys)
- Specific permissions declared
- Dependency caching enabled
- PR checks required before merge

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| CI-01 | Low | **No pinned action versions** — Actions use `@v4`, `@v5` etc. without SHA pinning. If a tag is compromised, malicious code could be injected. Best practice is to pin to specific commit SHAs |
| CI-02 | Low | **`continue-on-error: true` in E2E tests** — E2E tests in PR checks are allowed to fail, which means security-relevant E2E tests may not block merges |
| CI-03 | Medium | **No dependency review workflow** — No automated dependency version checking (e.g., Dependabot, Renovate, or GitHub's dependency review). Vulnerable dependencies may go unnoticed between weekly scans |

### 4.2 Secret Management

**Status:** ✅ Secure

**Strengths:**
- AWS credentials via OIDC (no long-lived keys)
- Secrets referenced via `${{ secrets.* }}` syntax
- No hardcoded secrets in codebase

---

## 5. Dependency Security Audit

### 5.1 Backend Dependencies — [`backend/requirements.txt`](backend/requirements.txt)

| Package | Current | Risk | Notes |
|---------|---------|------|-------|
| boto3 | >=1.34.0 | Low | Generally kept up to date |
| strands-agents | >=0.1.0 | Low | Early version, monitor for security updates |
| guardrails-ai | >=0.2.0 | **Medium** | Rapidly evolving project; API changes may break integration |
| moto | >=5.0.0 | Low | Test dependency only |
| pytest | >=8.0.0 | Low | Test dependency only |

### 5.2 Frontend Dependencies — [`frontend/package.json`](frontend/package.json)

| Package | Current | Risk | Notes |
|---------|---------|------|-------|
| react | ^18.3.1 | Low | Stable |
| react-markdown | ^10.1.0 | Low | Sanitizes by default |
| vite | ^6.0.0 | Low | Stable |
| eslint | ^8.57.0 | Low | ESLint v8 is EOL; v9 is current |
| typescript-eslint | ^8.57.1 | Low | Compatible with ESLint v9 |

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| DEP-01 | Medium | **ESLint v8 is end-of-life** — The project uses ESLint v8.57.0 while v9 is the current major version. EOL versions do not receive security updates |
| DEP-02 | Low | **No lock file commit hash verification** — package-lock.json should be committed and verified in CI to prevent dependency confusion attacks |

---

## 6. Security Test Coverage Evaluation

### 6.1 Existing Security Tests — [`test_security.py`](backend/tests/unit/test_security.py)

**Status:** ✅ Comprehensive

**Coverage:**
- 15 prompt injection pattern tests (parametrized)
- 12 off-topic question tests (parametrized)
- 10 contact form input validation tests (parametrized)
- 4 AI output validation tests
- 5 Guardrails AI integration tests
- 3 handler integration tests
- **Total: ~50+ security test cases**

**Strengths:**
- OWASP LLM01 (Prompt Injection) covered
- OWASP LLM05 (Improper Output Handling) covered
- Allure reporting integration
- Parametrized tests for comprehensive coverage

**Findings:**

| ID | Severity | Description |
|----|----------|-------------|
| TC-01 | Low | **No tests for email ReDoS vulnerability** — The email regex should be tested with ReDoS attack patterns |
| TC-02 | Low | **No tests for Unicode homoglyph bypass** — Injection patterns using Unicode lookalike characters are not tested |
| TC-03 | Medium | **No E2E security tests against real API** — Security tests are unit tests only. E2E security tests against the deployed API are skipped by default (noted in workflow) |
| TC-04 | Low | **No tests for rate limiting / DoS** — No tests verify that the API handles rapid successive requests appropriately |

---

## 7. Risk Summary Matrix

| Risk ID | Category | Severity | Description | Effort to Fix |
|---------|----------|----------|-------------|---------------|
| BE-08 | Backend | **High** | XSS in HTML email via unsanitized AI content | Medium |
| FE-01 | Frontend | **High** | Potential XSS via ReactMarkdown custom components | Low |
| BE-01 | Backend | Medium | Static injection patterns bypassable via encoding | Medium |
| BE-03 | Backend | Medium | Guardrails AI API may be deprecated/broken | Medium |
| BE-05 | Backend | Medium | Email regex ReDoS vulnerability | Low |
| INF-01 | Infra | Medium | Overly broad Bedrock IAM permissions | Low |
| DEP-01 | Deps | Medium | ESLint v8 is EOL | Low |
| CI-03 | CI/CD | Medium | No automated dependency review | Low |
| TC-03 | Testing | Medium | No E2E security tests against real API | Medium |
| BE-02 | Backend | Low | No application-level rate limiting | Medium |
| BE-04 | Backend | Low | Error messages may leak internals | Low |
| BE-06 | Backend | Low | No CSRF protection | Low |
| BE-07 | Backend | Low | URL blocking overly restrictive | Low |
| BE-09 | Backend | Low | HTML injection in email name field | Low |
| FE-02 | Frontend | Low | No client-side input sanitization | Low |
| FE-03 | Frontend | Low | API URL in client bundle (acceptable) | N/A |
| FE-04 | Frontend | Low | Same ReDoS regex in frontend | Low |
| INF-02 | Infra | Low | Unused X-Ray permissions | Low |
| INF-03 | Infra | Low | Duplicate tags in SAM template | Low |
| INF-04 | Infra | Low | No WAF on CloudFront | Medium |
| CI-01 | CI/CD | Low | Actions not pinned to SHAs | Low |
| CI-02 | CI/CD | Low | E2E tests allowed to fail | Low |
| TC-01 | Testing | Low | No ReDoS tests | Low |
| TC-02 | Testing | Low | No Unicode bypass tests | Low |
| TC-04 | Testing | Low | No rate limiting tests | Low |
| DEP-02 | Deps | Low | No lock file hash verification | Low |

---

## 8. Prioritized Recommendations

### Critical (Fix Immediately)

1. **Sanitize AI-generated content before HTML email** (BE-08)
   - Add `bleach` library to sanitize `ai_paragraph` before embedding in HTML email
   - Or use plain-text-only emails

2. **Harden ReactMarkdown configuration** (FE-01)
   - Add `allowedElements` prop to restrict renderable HTML elements
   - Add `unwrapDisallowed` to safely handle disallowed elements

### High Priority (Fix Within Sprint)

3. **Add input normalization to injection detection** (BE-01)
   - Normalize Unicode (NFKC) before pattern matching
   - Normalize whitespace and strip null bytes

4. **Fix Guardrails AI integration** (BE-03)
   - Verify current guardrails-ai API compatibility
   - Update to current API or remove if not functional

5. **Fix email regex ReDoS** (BE-05, FE-04)
   - Use a simpler regex or a dedicated email validation library
   - Add timeout to validation function

### Medium Priority (Fix Within Month)

6. **Restrict Bedrock IAM permissions** (INF-01)
   - Scope to specific model ID instead of `foundation-model/*`

7. **Add dependency review workflow** (CI-03)
   - Enable Dependabot or Renovate
   - Add GitHub dependency review action

8. **Enable E2E security tests** (TC-03)
   - Run security E2E tests against staging environment in CI

### Low Priority (Backlog)

9. **Pin GitHub Actions to commit SHAs** (CI-01)
10. **Add WAF to CloudFront** (INF-04)
11. **Update ESLint to v9** (DEP-01)
12. **Add rate limiting** (BE-02)
13. **Add Unicode homoglyph tests** (TC-02)

---

## 9. OWASP Top 10 for LLM Applications Assessment

| OWASP LLM Risk | Status | Coverage |
|----------------|--------|----------|
| LLM01: Prompt Injection | ✅ Mitigated | Multi-layer defense + tests |
| LLM02: Insecure Output Handling | ⚠️ Partial | Output validation exists but HTML email is vulnerable |
| LLM03: Training Data Poisoning | N/A | Not applicable (no fine-tuning) |
| LLM04: Model Denial of Service | ⚠️ Partial | Input length limits but no rate limiting |
| LLM05: Supply Chain Vulnerabilities | ⚠️ Partial | Dependencies not actively monitored |
| LLM06: Sensitive Information Disclosure | ✅ Mitigated | System prompt protection + no data leakage in responses |
| LLM07: Insecure Plugin Design | ✅ Mitigated | Tools are read-only, no destructive operations |
| LLM08: Excessive Agency | ✅ Mitigated | Agent has limited tool set and strict system prompt |
| LLM09: Overreliance | N/A | Application design acknowledges AI limitations |
| LLM10: Model Theft | N/A | Model is hosted on Bedrock, not distributed |

---

## 10. Conclusion

The camiloavila.dev portfolio demonstrates a strong security foundation with:
- Multi-layer defense in depth
- Comprehensive security test suite (~50+ test cases)
- Proper infrastructure security (OIDC, least privilege IAM, OAC)
- Security headers and CORS configuration
- Regular automated security scanning in CI/CD

The two **High** severity findings (XSS in HTML email and ReactMarkdown configuration) should be addressed promptly. The remaining Medium and Low findings represent hardening opportunities that can be prioritized based on risk tolerance and development capacity.

**Overall Grade: B+ (Good, with actionable improvements identified)**
