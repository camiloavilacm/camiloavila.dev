# backend/src/tools/__init__.py
# Strands Agent tool definitions for the camiloavila.dev chatbot and contact flow.
#
# Tools are the "skills" that Strands Agents can invoke to fulfil a task.
# Each tool is a Python function decorated with @tool from strands-agents.
#
# Available tools:
#   search_resume      — Retrieves resume content for a given topic/query
#   get_contact_info   — Returns Camilo's contact details
#   generate_reply     — Generates an AI-personalised email paragraph
