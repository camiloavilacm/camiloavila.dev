"""
stack.py — CDK Stack for camiloavila.dev Portfolio

This stack defines the infrastructure for the AI Resume Portfolio:
  - S3 bucket (knowledge_base.md for RAG)
  - Lambda functions (chatbot + contact)
  - API Gateway HTTP API (SAM-compatible)
  - IAM roles with Bedrock/S3/DynamoDB/SES permissions

The stack is designed to be compatible with SAM CLI for local development.
Run 'cdk synth' to generate sam/template.yaml, then use 'sam local start-api'.
"""

import os
from aws_cdk import (
    Stack,
    aws_iam as iam,
    aws_s3 as s3,
    CfnOutput,
    Fn,
    CfnResource,
    RemovalPolicy,
)
from constructs import Construct


class PortfolioStack(Stack):
    """CDK Stack for camiloavila.dev portfolio infrastructure."""

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Parameters (passed via CDK context or CLI)
        self.stage = self.node.try_get_context("stage") or "staging"
        self.bedrock_model_id = self.node.try_get_context("bedrock_model_id") or "amazon.nova-lite-v1:0"
        self.ses_sender_email = self.node.try_get_context("ses_sender_email") or "camiloavilainfo@gmail.com"
        self.domain_name = self.node.try_get_context("domain_name") or "camiloavila.dev"

        # Get account/region from environment (fallback to env vars or defaults)
        self.aws_account = os.environ.get("CDK_ACCOUNT", "123456789012")
        self.aws_region = os.environ.get("CDK_REGION", "us-east-1")

        # -------------------------------------------------------------------------
        # S3 Bucket — Knowledge Base
        # Stores knowledge_base.md for the RAG chatbot.
        # -------------------------------------------------------------------------
        self.knowledge_bucket = s3.Bucket(
            self,
            "KnowledgeBaseBucket",
            bucket_name=f"camiloavila-knowledge-{self.stage}",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.RETAIN,
        )

        # -------------------------------------------------------------------------
        # IAM Role — Chatbot Function
        # -------------------------------------------------------------------------
        self.chatbot_role = iam.Role(
            self,
            "ChatbotFunctionRole",
            role_name=f"camiloavila-chatbot-lambda-role-{self.stage}",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                ),
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "AWSXRayDaemonWriteAccess"
                ),
            ],
        )

        # Add inline policy for Bedrock and S3
        self.chatbot_role.add_to_policy(
            iam.PolicyStatement(
                sid="AllowKnowledgeBaseRead",
                effect=iam.Effect.ALLOW,
                actions=["s3:GetObject"],
                resources=[self.knowledge_bucket.arn_for_objects("knowledge_base.md")],
            )
        )
        self.chatbot_role.add_to_policy(
            iam.PolicyStatement(
                sid="AllowBedrockInvoke",
                effect=iam.Effect.ALLOW,
                actions=[
                    "bedrock:InvokeModel",
                    "bedrock:Converse",
                    "bedrock:InvokeModelWithResponseStream",
                ],
                resources=[
                    f"arn:aws:bedrock:{self.aws_region}::foundation-model/{self.bedrock_model_id}"
                ],
            )
        )

        # -------------------------------------------------------------------------
        # IAM Role — Contact Function
        # -------------------------------------------------------------------------
        self.contact_role = iam.Role(
            self,
            "ContactFunctionRole",
            role_name=f"camiloavila-contact-lambda-role-{self.stage}",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                ),
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "AWSXRayDaemonWriteAccess"
                ),
            ],
        )

        # Add inline policies for Contact function
        self.contact_role.add_to_policy(
            iam.PolicyStatement(
                sid="AllowKnowledgeBaseRead",
                effect=iam.Effect.ALLOW,
                actions=["s3:GetObject"],
                resources=[self.knowledge_bucket.arn_for_objects("knowledge_base.md")],
            )
        )
        self.contact_role.add_to_policy(
            iam.PolicyStatement(
                sid="AllowBedrockInvoke",
                effect=iam.Effect.ALLOW,
                actions=[
                    "bedrock:InvokeModel",
                    "bedrock:Converse",
                    "bedrock:InvokeModelWithResponseStream",
                ],
                resources=[
                    f"arn:aws:bedrock:{self.aws_region}::foundation-model/{self.bedrock_model_id}"
                ],
            )
        )

        # DynamoDB PutItem for contact submissions
        self.contact_role.add_to_policy(
            iam.PolicyStatement(
                sid="AllowDynamoDBWrite",
                effect=iam.Effect.ALLOW,
                actions=["dynamodb:PutItem"],
                resources=[
                    f"arn:aws:dynamodb:{self.aws_region}:{self.aws_account}:table/camiloavila-contacts-{self.stage}"
                ],
            )
        )

        # SES SendEmail for automated replies
        self.contact_role.add_to_policy(
            iam.PolicyStatement(
                sid="AllowSESEmail",
                effect=iam.Effect.ALLOW,
                actions=["ses:SendEmail", "ses:SendRawEmail"],
                resources=["*"],
            )
        )

        # -------------------------------------------------------------------------
        # SAM-compatible Lambda Functions and API Gateway
        # Using AWS::Serverless::Function and AWS::Serverless::HttpApi
        # -------------------------------------------------------------------------
        self._create_sam_resources()

        # -------------------------------------------------------------------------
        # CloudFormation Outputs
        # -------------------------------------------------------------------------
        CfnOutput(
            self,
            "ApiUrl",
            value=f"https://{Fn.ref('PortfolioApi')}.execute-api.{self.aws_region}.amazonaws.com/prod",
            description="API Gateway URL",
        )
        CfnOutput(
            self,
            "KnowledgeBaseBucketName",
            value=self.knowledge_bucket.bucket_name,
            description="S3 bucket for knowledge base",
        )

    def _create_sam_resources(self) -> None:
        """Create SAM-compatible Lambda functions and HTTP API.

        This generates AWS::Serverless::Function and AWS::Serverless::HttpApi
        resources that SAM CLI can use for local development.
        """
        # API Gateway HTTP API (SAM)
        CfnResource(
            self,
            "PortfolioApi",
            type="AWS::Serverless::HttpApi",
            properties={
                "StageName": "prod",
                "Description": "HTTP API for camiloavila.dev portfolio",
                "CorsConfiguration": {
                    "AllowOrigins": [
                        f"https://{self.domain_name}",
                        "http://localhost:5173",
                    ],
                    "AllowMethods": ["POST", "OPTIONS"],
                    "AllowHeaders": ["Content-Type"],
                    "MaxAge": 300,
                },
            },
        )

        # Chatbot Lambda — SAM Serverless Function
        chatbot_cfn = CfnResource(
            self,
            "ChatbotFunction",
            type="AWS::Serverless::Function",
            properties={
                "FunctionName": f"camiloavila-chatbot-{self.stage}",
                "CodeUri": "../../backend/src/",
                "Handler": "handler.lambda_handler",
                "Role": self.chatbot_role.role_arn,
                "Runtime": "python3.13",
                "Timeout": 30,
                "MemorySize": 256,
                "Tracing": "Active",
                "Description": "RAG chatbot backed by Amazon Bedrock.",
                "Environment": {
                    "Variables": {
                        "KNOWLEDGE_BUCKET": self.knowledge_bucket.bucket_name,
                        "KNOWLEDGE_KEY": "knowledge_base.md",
                        "BEDROCK_MODEL_ID": self.bedrock_model_id,
                        "ALLOWED_ORIGIN": f"https://{self.domain_name}",
                    }
                },
                "Events": {
                    "ChatPost": {
                        "Type": "HttpApi",
                        "Properties": {
                            "ApiId": Fn.ref("PortfolioApi"),
                            "Path": "/chat",
                            "Method": "POST",
                        },
                    },
                    "ChatOptions": {
                        "Type": "HttpApi",
                        "Properties": {
                            "ApiId": Fn.ref("PortfolioApi"),
                            "Path": "/chat",
                            "Method": "OPTIONS",
                        },
                    },
                },
            },
        )
        chatbot_cfn.node.add_dependency(self.chatbot_role.node.default_child)

        # Contact Lambda — SAM Serverless Function
        contact_cfn = CfnResource(
            self,
            "ContactFunction",
            type="AWS::Serverless::Function",
            properties={
                "FunctionName": f"camiloavila-contact-{self.stage}",
                "CodeUri": "../../backend/src/",
                "Handler": "contact_handler.lambda_handler",
                "Role": self.contact_role.role_arn,
                "Runtime": "python3.13",
                "Timeout": 30,
                "MemorySize": 256,
                "Tracing": "Active",
                "Description": "Contact form handler with SES email.",
                "Environment": {
                    "Variables": {
                        "KNOWLEDGE_BUCKET": self.knowledge_bucket.bucket_name,
                        "KNOWLEDGE_KEY": "knowledge_base.md",
                        "BEDROCK_MODEL_ID": self.bedrock_model_id,
                        "CONTACT_TABLE": f"camiloavila-contacts-{self.stage}",
                        "SES_SENDER_EMAIL": self.ses_sender_email,
                        "ALLOWED_ORIGIN": f"https://{self.domain_name}",
                    }
                },
                "Events": {
                    "ContactPost": {
                        "Type": "HttpApi",
                        "Properties": {
                            "ApiId": Fn.ref("PortfolioApi"),
                            "Path": "/contact",
                            "Method": "POST",
                        },
                    },
                    "ContactOptions": {
                        "Type": "HttpApi",
                        "Properties": {
                            "ApiId": Fn.ref("PortfolioApi"),
                            "Path": "/contact",
                            "Method": "OPTIONS",
                        },
                    },
                },
            },
        )
        contact_cfn.node.add_dependency(self.contact_role.node.default_child)