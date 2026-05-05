# CDK + SAM Hybrid Architecture

This directory contains a CDK (Cloud Development Kit) project that generates
SAM-compatible CloudFormation templates for local development with SAM CLI.

## Project Structure

```
infrastructure/
├── app.py                 # CDK app entry point
├── cdk.json             # CDK configuration
├── stack.py              # CDK stack definition (all AWS resources)
├── requirements.txt    # Python dependencies
├── sam/
│   └── locals.json     # Environment variable mocks for SAM local
└── tests/
    └── test_stack.py  # CDK unit tests
```

## Quick Start

### 1. Setup CDK Environment

```bash
# Create virtual environment
cd infrastructure
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Or use uv (faster)
uv sync
```

### 2. Synthesize CDK Stack to SAM Template

```bash
# Generate SAM-compatible CloudFormation template
cdk synth --no-staging > sam/template.yaml

# Or with explicit output path
cdk synth -o sam/template.yaml
```

This generates `sam/template.yaml` that SAM CLI can read directly.

### 3. Run Locally with SAM CLI

```bash
# Start API locally with mocked environment variables
sam local start-api \
    --env-vars sam/locals.json \
    --docker-network host
```

The API will be available at `http://localhost:3000`.

### 4. Test Endpoints

```bash
# Chat endpoint
curl -X POST http://localhost:3000/chat \
    -H "Content-Type: application/json" \
    -d '{"question": "What are your AWS certifications?"}'

# Contact endpoint
curl -X POST http://localhost:3000/contact \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test@example.com",
        "message": "Interested in your work!"
    }'
```

## Development Workflow

1. **Edit Lambda code**: Modify `backend/src/handler.py` or `backend/src/contact_handler.py`

2. **Test locally**:
   ```bash
   cdk synth --no-staging > sam/template.yaml
   sam local start-api --env-vars sam/locals.json
   ```

3. **Deploy to AWS**:
   ```bash
   # Option A: Use SAM (from generated template)
   cd sam
   sam deploy --template template.yaml --stack-name camiloavila-portfolio

   # Option B: Use CDK directly
   cdk deploy
   ```

## Environment Variables

### locals.json

The `sam/locals.json` file mocks environment variables that CDK generates dynamically
in production:

| Variable | Description | Mock Value |
|----------|--------------|------------|
| `KNOWLEDGE_BUCKET` | S3 bucket for knowledge_base.md | `test-knowledge-bucket` |
| `KNOWLEDGE_KEY` | S3 object key | `knowledge_base.md` |
| `BEDROCK_MODEL_ID` | Bedrock model for AI | `amazon.nova-lite-v1:0` |
| `CONTACT_TABLE` | DynamoDB table | `test-contacts` |
| `SES_SENDER_EMAIL` | Verified SES sender | `test@example.com` |
| `ALLOWED_ORIGIN` | CORS allowed origin | `http://localhost:5173` |

### CDK Context Variables

Override via CLI:

```bash
cdk deploy \
    -c stage=prod \
    -c bedrock_model_id=amazon.nova-pro \
    -c ses_sender_email=real@email.com \
    -c domain_name=camiloavila.dev
```

Or set in `cdk.json`:

```json
{
  "app": "python3 app.py",
  "context": {
    "stage": "staging",
    "bedrock_model_id": "amazon.nova-lite-v1:0",
    "ses_sender_email": "camiloavilainfo@gmail.com",
    "domain_name": "camiloavila.dev"
  }
}
```

## IAM Permissions

The stack creates two IAM roles with least-privilege permissions:

### ChatbotFunctionRole

| Permission | Resource |
|------------|-----------|
| `s3:GetObject` | `knowledge_base.md` in knowledge bucket |
| `bedrock:InvokeModel` |指定的 Bedrock model |
| `bedrock:Converse` | 指定的 Bedrock 模型 |
| `bedrock:InvokeModelWithResponseStream` | 指定的 Bedrock 模型 |

### ContactFunctionRole

| Permission | Resource |
|------------|-----------|
| `s3:GetObject` | `knowledge_base.md` in knowledge bucket |
| `bedrock:InvokeModel` | 指定的 Bedrock 模型 |
| `bedrock:Converse` | 指定的 Bedrock 模型 |
| `bedrock:InvokeModelWithResponseStream` | 指定的 Bedrock 模型 |
| `dynamodb:PutItem` | Contact table |
| `ses:SendEmail` | From verified sender |

## Troubleshooting

### SAM local can't find handler

Make sure `CodeUri` path is correct. The generated template uses relative paths:

```yaml
CodeUri: ../../backend/src/
```

Run `cdk synth` from the `infrastructure/` directory.

### Docker issues

```bash
# Check Docker is running
docker ps

# Rebuild and retry
sam local start-api --force-image-build
```

### Environment variable not found

Ensure the Lambda function name in `locals.json` matches the generated template:

```bash
# Check the generated function names
grep -A2 "AWS::Serverless::Function" sam/template.yaml
```

## Comparison

| Feature | CDK | SAM |
|---------|-----|-----|
| Language | TypeScript/Python | YAML |
| Local testing | `cdk local` (limited) | `sam local` (full) |
| Deployment | `cdk deploy` | `sam deploy` |
| IDE support | Excellent | Basic |

This hybrid approach gives you CDK's powerful abstractions for defining infrastructure
while maintaining SAM's excellent local development experience.