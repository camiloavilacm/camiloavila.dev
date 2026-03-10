# backend/src/agents/__init__.py
# Strands Agent definitions for the camiloavila.dev backend.
#
# Agents are the orchestration layer — they receive a task, decide which
# tools to invoke (and in what order), and return a final response.
#
# Available agents:
#   ChatbotAgent  — answers resume questions using search_resume + get_contact_info
#   ContactAgent  — generates personalized email paragraphs using generate_reply
