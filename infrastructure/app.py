"""
app.py — CDK Application Entry Point

Synthesizes the PortfolioStack and outputs a SAM-compatible CloudFormation template.

Usage:
    # Synthesize to SAM template
    cdk synth --no-staging > sam/template.yaml

    # Deploy to AWS
    cdk deploy --profile your-aws-profile

    # Local development with SAM
    sam local start-api --env-vars sam/locals.json
"""

import os
import sys

# Add the venv path to activate aws-cdk-lib
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".venv/lib/python3.13/site-packages"))

from aws_cdk import App, Environment
from stack import PortfolioStack

# Get context from environment or use defaults
stage = os.environ.get("STAGE", "staging")
bedrock_model_id = os.environ.get("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0")
ses_sender_email = os.environ.get("SES_SENDER_EMAIL", "camiloavilainfo@gmail.com")
domain_name = os.environ.get("DOMAIN_NAME", "camiloavila.dev")

app = App(
    context={
        "stage": stage,
        "bedrock_model_id": bedrock_model_id,
        "ses_sender_email": ses_sender_email,
        "domain_name": domain_name,
    }
)

# Create the stack
portfolio_stack = PortfolioStack(
    app,
    "camiloavila-portfolio",
    env=Environment(
        account="123456789012",
        region="us-east-1",
    ),
)

# Synthesize the app
app.synth()