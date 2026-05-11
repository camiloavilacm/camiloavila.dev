# GitHub Actions Errors Report

**Repository:** camiloavilacm/camiloavila.dev
**Period:** May 1, 2026 - May 8, 2026 (7 days)
**Generated:** 2026-05-08
**Last Updated:** 2026-05-09 (fixes applied)

---

## Summary

| Metric | Value |
|--------|-------|
| Total failed workflow runs | 89 |
| Distinct workflows failing | 4 |
| Primary error categories | 3 |

---

## Failed Workflow Runs by Workflow

| Workflow | Failures | % of Total |
|----------|----------|------------|
| visual-regression.yml | 30 | 33.7% |
| pr-coverage-report.yml | 29 | 32.6% |
| PR Checks | 27 | 30.3% |
| Deploy Develop (Staging) | 3 | 3.4% |

---

## Error Categories

### 1. AWS Credentials Not Loaded (PR Checks — Dependabot PRs)

**Affected runs:** 9 PR Checks runs on dependabot branches

**Example run:** [25568073067](https://github.com/camiloavilacm/camiloavila.dev/actions/runs/25568073067) — `deps(deps): update boto3 requirement...`

**Error:**
```
##[error]Credentials could not be loaded, please check your action inputs:
Could not load credentials from any providers
```

**Root cause:** The `aws-actions/configure-aws-credentials@v4` step runs on dependabot PRs but the branch lacks the required OIDC configuration. Dependabot pushes trigger the workflow with `GITHUB_TOKEN` permissions of `Contents: read` and `Metadata: read`, which are insufficient for the AWS OIDC role assumption. The workflow expects AWS credentials to deploy/test, but no credentials are available on these branches.

**Affected branches:**
- `dependabot/pip/backend/boto3-gte-1.43.3`
- `dependabot/pip/backend/guardrails-ai-gte-0.10.0`
- `dependabot/pip/backend/bleach-gte-6.3.0`
- `dependabot/pip/backend/pytest-gte-9.0.3`
- `dependabot/pip/backend/strands-agents-gte-1.38.0`
- `dependabot/npm_and_yarn/frontend/typescript-6.0.3`
- `dependabot/npm_and_yarn/frontend/typescript-eslint-8.59.2`
- `dependabot/pip/backend/allure-pytest-gte-2.16.0`

**Recommended fix:** Add a condition to skip AWS credential configuration on dependabot branches, or request `id-token: write` permission for the job. Alternatively, configure the workflow to only require AWS credentials for jobs that actually need them (deploy, smoke tests), and skip them for lint/test-only runs.

---

### 2. Lambda Layer Size Exceeds Limit (Deploy Develop)

**Affected runs:** 3 runs on `develop` branch

**Example run:** [25366871712](https://github.com/camiloavilacm/camiloavila.dev/actions/runs/25366871712) — `fix: use Lambda layer for heavy dependencies`

**Error:**
```
Resource handler returned message: "Unzipped size must be smaller than
262144000 bytes (Service: Lambda, Status Code: 400, Request ID: ...)"
(HandlerErrorCode: InvalidRequest)
```

**Root cause:** The `StrandsLayera2bb2bfa19` Lambda layer (and the Lambda function deployment package itself) exceeds the 250MB unzipped size limit for Lambda deployments. This is caused by the `strands-agents` package and its heavy dependencies (likely including AI/ML libraries).

**Impact:** Stack `camiloavila-dev-staging` deployment fails with `UPDATE_ROLLBACK_COMPLETE`. CloudFront and frontend deploys are skipped due to the rollback.

**Affected commits:**
- `fix: use Lambda layer for heavy dependencies` (May 5)
- `fix: update frontend dependencies` (May 5)
- `feat: CDK+SAM hybrid infrastructure for local development` (May 5)

**Recommended fix:** Consider using Lambda's larger package size limit (250MB unzipped) with a different packaging approach, or split the strands-agents dependency into a separate layer. Investigate which specific dependency is the largest (likely transformers, pytorch, or similar ML packages) and use Lambda's container image deployment instead of zip for these heavy dependencies.

---

### 3. Actions Version Not Found / Node.js 20 Deprecation (PR Checks)

**Affected runs:** Multiple PR Checks runs (27 total)

**Example run:** [25497228499](https://github.com/camiloavilacm/camiloavila.dev/actions/runs/25497228499) — `Develop` PR

**Error:**
```
##[error]Unable to resolve action `actions/setup-python@0b93645e9fea7318eca82e354496243140350393`,
unable to find version `0b93645e9fea7318eca82e354496243140350393`.
Unable to resolve action `actions/upload-artifact@65c4c4a1ddee5b72f698fdd0850491e297787957`,
unable to find version `65c4c4a1ddee5b72f698fdd0850491e297787957`
```

**Root cause:** Workflows are pinned to specific commit SHAs of GitHub Actions. These commit SHAs have become unavailable or have been removed. The warning at the end of logs confirms this:
```
##[warning]Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and
may not work as expected: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11,
actions/setup-python@v5, aws-actions/configure-aws-credentials@v4, actions/upload-artifact@v4.
Node.js 20 will be removed from the runner on September 16th, 2026.
```

**Recommended fix:**
1. Update all actions to their latest major version tags (e.g., `actions/setup-python@v5` -> `actions/setup-python@v6`, `actions/upload-artifact@v4` -> `actions/upload-artifact@v5`)
2. Or update pinned SHAs to the latest available commits
3. Set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` as a temporary workaround to opt into Node.js 24

---

## Failures by Branch/Event Type

| Event Type | Count | Notes |
|------------|-------|-------|
| pull_request | 22 | Mostly dependabot PRs failing PR Checks |
| push | 65 | Regular pushes, mostly from feature/dependabot branches |
| Workflows with main branch | 3 | `visual-regression.yml` and `pr-coverage-report.yml` on main |

**Key observation:** The majority of failures (65/89) are on push events, not pull request events. This is because every push to a branch (including dependabot branches) triggers the `pr-coverage-report.yml` and `visual-regression.yml` workflows which are configured to run on all pushes.

---

## Dependabot-Specific Failures

All PR Checks failures are from dependabot-created branches:
- 8 Python dependency updates (pip)
- 6 npm dependency updates (frontend)
- 2 npm dev dependency updates (tests)
- 2 multi-package updates

This indicates that the PR Checks workflow is not properly configured for dependabot PRs (likely missing OIDC permissions as noted above).

---

## Recommendations

> **All three high/medium priority fixes have been applied as of 2026-05-09.**

1. **FIXED (2026-05-09) — AWS Credentials on Dependabot PRs:**
   Added `if: github.actor != 'dependabot[bot]'` condition to the AWS credential step in `pr-checks.yml`. Dependabot PRs no longer fail when trying to assume AWS OIDC roles.

2. **FIXED (2026-05-09) — Lambda Layer Size Limit:**
   - Created `backend/.lambdaignore` to exclude `__pycache__`, `.dist-info`, test files, documentation, etc.
   - Created `scripts/build_layer.py` to build a lean Lambda layer with `.lambdaignore` exclusions.
   - Created `backend/requirements-layer.txt` with production-only dependencies (no test deps).
   - Updated `template.yaml` to reference `backend/.lambda_layer/` as local ContentUri.
   - Updated `deploy.yml` and `deploy-develop.yml` to build the layer before `sam build`.
   - Layer is rebuilt fresh on every deploy, keeping it under 250MB.

3. **FIXED (2026-05-09) — GitHub Actions Version Updates:**
   Updated all 6 workflow files to latest action versions:
   - `actions/checkout@v4` (removed pinned SHA)
   - `actions/setup-python@v6` (was v5)
   - `actions/setup-node@v5` (was v4)
   - `actions/upload-artifact@v5` (was v4)
   - `actions/download-artifact@v5` (was v4)
   - `actions/deploy-pages@v5` (was v4)
   - `actions/upload-pages-artifact@v4` (was v3)
   - `actions/configure-pages@v5` (was v4)
   - `aws-actions/setup-sam@v3` (was v2)
   - `actions/setup-java@v4.1` (was v4)
   - `actions/github-script@v7.3` (was v7)
   - `aws-actions/configure-aws-credentials@v4.1` (was v4)

4. **Low Priority — Reduce Redundant Workflow Runs:**
   Consider adding branch filters to `pr-coverage-report.yml` and `visual-regression.yml` to only run on relevant branches (e.g., main, develop, PR branches), avoiding runs on dependabot branches that already trigger PR Checks.
