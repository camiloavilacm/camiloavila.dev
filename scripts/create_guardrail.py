"""
create_guardrail.py — AWS Bedrock Guardrails Setup Script (Disabled)
============================================================
This script creates AWS Bedrock Guardrails for the Camilo Avila portfolio.

CURRENT STATUS: DISABLED - Using guardrails-ai library instead

To enable:
1. Update the variables at the top of this file
2. Uncomment the create_guardrail() function call
3. Run: python scripts/create_guardrail.py
4. Update template.yaml to add guardrailIdentifier

Cost estimate: $184-552/month depending on filters enabled
See: https://aws.amazon.com/bedrock/pricing/

Usage:
    python scripts/create_guardrail.py
"""

import boto3
import json
import sys

# =============================================================================
# Configuration
# =============================================================================

GUARDRAIL_NAME = "camilo_avila_dev_guardrails"
REGION = "us-east-1"
ACCOUNT_ID = "046228935090"

# Note: Get your account ID from AWS Console or run: aws sts get-caller-identity --query Account

# =============================================================================
# Content Filter Configuration (Harmful Content)
# =============================================================================
# Blocks: Hate, Insults, Sexual, Violence, Misconduct, Prompt Attack
# Strength options: NONE, LOW, MEDIUM, HIGH

CONTENT_FILTERS = [
    {"type": "HATE", "inputStrength": "MEDIUM", "outputStrength": "MEDIUM", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
    {"type": "INSULTS", "inputStrength": "MEDIUM", "outputStrength": "MEDIUM", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
    {"type": "SEXUAL", "inputStrength": "MEDIUM", "outputStrength": "MEDIUM", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
    {"type": "VIOLENCE", "inputStrength": "MEDIUM", "outputStrength": "MEDIUM", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
    {"type": "MISCONDUCT", "inputStrength": "MEDIUM", "outputStrength": "MEDIUM", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
    {"type": "PROMPT_ATTACK", "inputStrength": "HIGH", "outputStrength": "HIGH", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
]

# =============================================================================
# Denied Topics Configuration
# =============================================================================
# Topics unrelated to CV/resume - customize as needed

DENIED_TOPICS = [
    {
        "name": "off-topic-weather",
        "definition": "Weather queries unrelated to resume",
        "examples": ["What's the weather?", "Will it rain tomorrow?", "What's the forecast?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-politics",
        "definition": "Political discussions unrelated to resume",
        "examples": ["What do you think about politics?", "Who did you vote for?", "What's your political opinion?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-sports",
        "definition": "Sports queries unrelated to resume",
        "examples": ["Who won the World Cup?", "What's your favorite team?", "Did team win?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-finance",
        "definition": "Stock market and finance queries",
        "examples": ["What's the stock price?", "Should I buy Bitcoin?", "Market prediction?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-celebrity",
        "definition": "Celebrity gossip and entertainment",
        "examples": ["What do you think about celebrity?", "Who is your favorite actor?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-medical",
        "definition": "Medical advice queries",
        "examples": ["What medication should I take?", "Diagnose my symptoms", "Medical advice?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-religion",
        "definition": "Religious discussions",
        "examples": ["What's your religion?", "Which church do you attend?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-dating",
        "definition": "Dating and relationship advice",
        "examples": ["Who should I date?", "How to get a girlfriend?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
    {
        "name": "off-topic-other-careers",
        "definition": "Careers other than software development",
        "examples": ["How do I become a doctor?", "What's the best law school?"],
        "type": "DENY",
        "inputAction": "BLOCK",
        "outputAction": "BLOCK",
        "inputEnabled": True,
        "outputEnabled": True
    },
]

# =============================================================================
# Word Filter Configuration
# =============================================================================
# Custom words to block (in addition to managed profanity list)

CUSTOM_WORDS = [
    {"text": "suicide", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
    # Add more words as needed:
    # {"text": "hack", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
    # {"text": "bypass", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
]

MANAGED_WORD_LISTS = [
    {"type": "PROFANITY", "inputAction": "BLOCK", "outputAction": "BLOCK", "inputEnabled": True, "outputEnabled": True},
]

# =============================================================================
# Sensitive Information (PII) Configuration
# =============================================================================
# Currently disabled - not needed for CV chatbot

PII_ENTITIES = []  # Set to None/empty since you requested no PII filtering

# =============================================================================
# Message Configuration
# =============================================================================

BLOCKED_INPUT_MESSAGE = "Your message was blocked by security filters. For inquiries about Camilo Avila's resume, please ask about his experience, skills, or background."
BLOCKED_OUTPUT_MESSAGE = "This response was blocked by security filters."


# =============================================================================
# Main Function
# =============================================================================

def create_guardrail():
    """Create the Bedrock Guardrail with all configured policies."""
    bedrock = boto3.client('bedrock', region_name=REGION)

    print(f"Creating guardrail: {GUARDRAIL_NAME}")
    print("WARNING: This will cost approximately $184-552/month depending on filters enabled.")
    print("See: https://aws.amazon.com/bedrock/pricing/")
    print()

    try:
        response = bedrock.create_guardrail(
            name=GUARDRAIL_NAME,
            description='Guardrail for Camilo Avila portfolio chatbot - blocks harmful content and off-topic queries',
            topicPolicyConfig={
                'topicsConfig': DENIED_TOPICS,
                'tierConfig': {'tierName': 'STANDARD'}
            },
            contentPolicyConfig={
                'filtersConfig': CONTENT_FILTERS,
                'tierConfig': {'tierName': 'STANDARD'}
            },
            wordPolicyConfig={
                'wordsConfig': CUSTOM_WORDS,
                'managedWordListsConfig': MANAGED_WORD_LISTS
            },
            sensitiveInformationPolicyConfig={
                'piiEntitiesConfig': PII_ENTITIES
            } if PII_ENTITIES else {'piiEntitiesConfig': []},
            blockedInputMessaging=BLOCKED_INPUT_MESSAGE,
            blockedOutputsMessaging=BLOCKED_OUTPUT_MESSAGE
        )

        guardrail_id = response['guardrailArn'].split('/')[-1].split(':')[-1]
        guardrail_version = response['version']

        print(f"✅ Guardrail created successfully!")
        print(f"   Name: {GUARDRAIL_NAME}")
        print(f"   ARN: {response['guardrailArn']}")
        print(f"   ID: {guardrail_id}")
        print(f"   Version: {guardrail_version}")
        print()
        print("To use with Lambda, add to template.yaml:")
        print(f"   guardrailIdentifier: {response['guardrailArn']}")
        print(f"   guardrailVersion: {guardrail_version}")
        print()
        print(f"Estimated monthly cost: $184-552/month")

        return response

    except Exception as e:
        print(f"❌ Error creating guardrail: {e}")
        sys.exit(1)


def delete_guardrail(guardrail_id):
    """Delete an existing guardrail."""
    bedrock = boto3.client('bedrock', region_name=REGION)

    print(f"Deleting guardrail: {guardrail_id}")

    try:
        bedrock.delete_guardrail(guardrailIdentifier=guardrail_id)
        print(f"✅ Guardrail deleted: {guardrail_id}")
    except Exception as e:
        print(f"❌ Error deleting guardrail: {e}")
        sys.exit(1)


def list_guardrails():
    """List all guardrails in the account."""
    bedrock = boto3.client('bedrock', region_name=REGION)

    try:
        response = bedrock.list_guardrails()

        if not response['guardrails']:
            print("No guardrails found.")
            return

        print("Guardrails in account:")
        for g in response['guardrails']:
            print(f"  - {g['name']} (ID: {g['id']}, Status: {g['status']})")

    except Exception as e:
        print(f"❌ Error listing guardrails: {e}")
        sys.exit(1)


# =============================================================================
# Main Entry Point
# =============================================================================

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='AWS Bedrock Guardrails management')
    parser.add_argument('action', choices=['create', 'delete', 'list'],
                      help='Action to perform')
    parser.add_argument('--guardrail-id', help='Guardrail ID (required for delete)')

    args = parser.parse_args()

    if args.action == 'create':
        confirm = input("This will cost ~$184-552/month. Continue? (yes/no): ")
        if confirm.lower() == 'yes':
            create_guardrail()
        else:
            print("Cancelled.")
    elif args.action == 'delete':
        if not args.guardrail_id:
            print("Error: --guardrail-id required for delete")
            sys.exit(1)
        delete_guardrail(args.guardrail_id)
    elif args.action == 'list':
        list_guardrails()