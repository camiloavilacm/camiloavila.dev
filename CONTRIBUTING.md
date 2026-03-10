# Contributing to camiloavila.dev

Thank you for your interest in contributing. This document explains how the repository is structured, how the components connect, and how to propose or make changes.

---

## Understanding the codebase

Before making changes, read [`docs/architecture.md`](docs/architecture.md). It contains:
- Full request flow diagrams (chatbot + contact form)
- CI/CD pipeline stages
- Strands Agent tool graph
- IAM permission boundaries
- Test suite architecture

---

## Repository structure and ownership

| Folder | What it owns | Change impact |
|---|---|---|
| `knowledge_base.md` | CV content for the chatbot | Low — update and push, auto-uploaded to S3 |
| `backend/src/tools/` | Strands Agent tools (skills) | Medium — tool changes affect agent behaviour |
| `backend/src/agents/` | Agent definitions + system prompts | High — prompt changes affect all chatbot answers |
| `backend/src/utils/` | AWS service wrappers (S3, DynamoDB, SES) | High — affects all Lambda invocations |
| `backend/src/handler.py` | Chatbot Lambda entrypoint | High — breaking changes break the chatbot API |
| `backend/src/contact_handler.py` | Contact form Lambda entrypoint | High — breaking changes break the contact form |
| `frontend/src/components/` | React UI components | Low-Medium — visual changes |
| `template.yaml` | All AWS infrastructure | Very High — changes redeploy the entire stack |
| `tests/` | All test suites | Medium — test changes affect CI/CD gate |
| `.github/workflows/` | CI/CD pipeline | Very High — pipeline changes affect all deploys |

---

## How to add a new Strands Agent tool

Tools are skills the agent can invoke. Adding a new tool follows this pattern:

### 1. Create the tool file

Create `backend/src/tools/my_new_tool.py`:

```python
from strands import tool
import logging

logger = logging.getLogger(__name__)

@tool
def my_new_tool(parameter: str) -> str:
    """Brief description of what this tool does.

    When the agent should use this:
        Describe the trigger condition.

    Args:
        parameter: Description of the input.

    Returns:
        str: Description of what is returned.
    """
    logger.info("Tool my_new_tool called with: %s", parameter)
    # Your implementation here
    return "result"
```

### 2. Register the tool with the agent

In `backend/src/agents/chatbot_agent.py`:

```python
from tools.my_new_tool import my_new_tool

agent = Agent(
    model=f"bedrock/{model_id}",
    system_prompt=_CHATBOT_SYSTEM_PROMPT,
    tools=[search_resume, get_contact_info, my_new_tool],  # Add here
)
```

### 3. Update the system prompt if needed

If the new tool requires the agent to understand when to use it, add a line to `_CHATBOT_SYSTEM_PROMPT` in `chatbot_agent.py`.

### 4. Write unit tests

Create or add to `backend/tests/unit/test_tools.py`:

```python
class TestMyNewTool:
    def test_returns_expected_output(self):
        from tools.my_new_tool import my_new_tool
        fn = my_new_tool.__wrapped__ if hasattr(my_new_tool, "__wrapped__") else my_new_tool
        result = fn("test input")
        assert "expected content" in result
```

### 5. Update the architecture doc

Add the new tool to the Strands Agent tool graph in [`docs/architecture.md`](docs/architecture.md).

---

## How to add a new test

### Adding a Pytest unit test

Add test cases to the relevant file in `backend/tests/unit/` or create a new file following the naming pattern `test_<module>.py`.

Each test class and method must have a docstring explaining what is being asserted and why.

```python
class TestMyFeature:
    def test_does_the_right_thing(self):
        """Brief description of what is validated.

        Asserts:
            What the assertion checks.
        """
        # arrange
        # act
        # assert
```

### Adding a Cypress test

Add test cases to an existing spec file in `tests/e2e/cypress/specs/` or create a new `.cy.ts` file:

```typescript
describe("My Feature", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("does the right thing", () => {
    // Use data-testid selectors for reliability
    cy.get("[data-testid='my-element']").should("be.visible");
  });
});
```

Tag tests that require a live API with `@smoke`:
```typescript
it("sends real API request @smoke", () => { ... });
```

### Adding a Puppeteer test

Add test cases to `tests/e2e/puppeteer/specs/`. Use the `screenshot()` helper to capture visual state at key steps.

### Adding a Playwright test

Add test cases to `tests/e2e/playwright/specs/`. Mark tests with `@pytest.mark.smoke` or `@pytest.mark.functional`.

Every Playwright test must have a docstring with:
- What the test verifies (Steps + Asserts)
- Any timing expectations (e.g. Bedrock cold start timeouts)

---

## How to update the knowledge base

The chatbot only knows what is in `knowledge_base.md`. To update Camilo's CV:

1. Edit `knowledge_base.md`
2. Push to `main`
3. The CI/CD pipeline (`deploy.yml`) automatically uploads the file to S3

The Lambda picks up the new content on the next cold start. To force an immediate update, you can manually invoke the Lambda (which will cold-start) or restart it.

---

## Branch and PR conventions

- Branch names: `feat/description`, `fix/description`, `docs/description`, `test/description`
- Commits: imperative present tense — `add contact form validation`, `fix chatbot CORS headers`
- PRs: fill out the description explaining what changed and why
- Every PR must pass all `pr-checks.yml` jobs before merging

---

## Running the full test suite locally before pushing

```bash
# 1. Unit tests (fast — no AWS required)
pytest backend/tests/unit/ -v

# 2. Frontend build check
cd frontend && npm run lint && npm run type-check && npm run build

# 3. E2E tests (requires local dev server + sam local start-api)
sam local start-api &           # Terminal background
cd frontend && npm run dev &     # Terminal background

cd tests
CYPRESS_BASE_URL=http://localhost:5173 npm run test:cypress
PUPPETEER_BASE_URL=http://localhost:5173 npm run test:puppeteer
PLAYWRIGHT_BASE_URL=http://localhost:5173 pytest tests/e2e/playwright/ -v
```

---

## Proposing changes to the infrastructure (`template.yaml`)

Infrastructure changes are high-risk. Before proposing:

1. Use `sam validate` to check your template syntax:
   ```bash
   sam validate --lint
   ```

2. Use `sam deploy --no-execute-changeset` to preview the CloudFormation changeset before applying.

3. Never remove or rename existing resource logical IDs — CloudFormation will delete and recreate the resource, causing downtime.

4. Document the change in `docs/architecture.md`.

---

## Questions?

Open an issue or contact Camilo directly:
- Email: camiloavilainfo@gmail.com
- LinkedIn: https://www.linkedin.com/in/camiloavila
