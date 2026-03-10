/**
 * Chatbot.tsx — AI Resume Assistant Widget
 *
 * A floating chat widget that lets visitors ask questions about Camilo's
 * resume. Powered by the ChatbotAgent Lambda via the API Gateway /chat endpoint.
 *
 * UI behaviour:
 * - A floating button (bottom-right) toggles the chat panel
 * - The panel shows a message thread (user messages right, AI left)
 * - A loading indicator appears while awaiting the API response
 * - Off-topic questions receive a polite refusal from the agent
 * - Errors are shown inline with a retry hint
 *
 * Accessibility:
 * - aria-label on toggle button
 * - aria-live on the message list (announces new messages to screen readers)
 * - Keyboard accessible (Enter to send, Escape to close)
 *
 * The API URL is read from VITE_API_URL environment variable.
 */

import React, { useState, useRef, useEffect } from "react";

/** A single message in the chat thread. */
interface Message {
  /** "user" = visitor's question, "ai" = assistant's response, "error" = error state. */
  role: "user" | "ai" | "error";
  /** Message text content. */
  text: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "";

/** Initial greeting shown when the chat opens. */
const WELCOME_MESSAGE: Message = {
  role: "ai",
  text: "Hi! I'm Camilo's AI Resume Assistant. Ask me anything about his skills, experience, certifications, or availability. 👋",
};

/**
 * Floating chatbot widget component.
 *
 * @returns A fixed-position chat toggle button and collapsible chat panel.
 */
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Scroll to bottom of message list whenever messages change. */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Focus input when chat opens. */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /** Close panel on Escape key. */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  /**
   * Send the current input as a question to the chatbot API.
   * Appends user message immediately, then awaits AI response.
   */
  const sendMessage = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: Message = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (response.ok && data.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: data.answer },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "error",
            text: data.error ?? "Something went wrong. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          text: "Could not reach the server. Please check your connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press in the input field.
   *
   * @param e - Keyboard event.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          style={styles.panel}
          role="dialog"
          aria-label="AI Resume Assistant"
          aria-modal="false"
          data-testid="chatbot-panel"
        >
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerInfo}>
              <span style={styles.statusDot} aria-hidden="true" />
              <span style={styles.headerTitle}>Resume Assistant</span>
            </div>
            <button
              style={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Message thread */}
          <div
            style={styles.messages}
            aria-live="polite"
            aria-label="Chat messages"
            data-testid="chat-messages"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
                  ...(msg.role === "error" ? styles.errorBubble : {}),
                }}
                data-testid={`message-${msg.role}`}
              >
                {msg.text}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ ...styles.bubble, ...styles.aiBubble }} data-testid="loading-indicator">
                <span style={styles.typingDots} aria-label="Thinking">
                  ● ● ●
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div style={styles.inputRow}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Camilo's experience..."
              disabled={isLoading}
              maxLength={500}
              aria-label="Type your question"
              data-testid="chat-input"
              style={styles.input}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              data-testid="chat-send"
              style={styles.sendBtn}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        style={styles.toggleBtn}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI Resume Assistant" : "Open AI Resume Assistant"}
        aria-expanded={isOpen}
        data-testid="chatbot-toggle"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  toggleBtn: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "var(--accent)",
    color: "var(--bg-primary)",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(100, 255, 218, 0.3)",
    zIndex: 1000,
    transition: "var(--transition)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    position: "fixed",
    bottom: "100px",
    right: "32px",
    width: "360px",
    maxWidth: "calc(100vw - 48px)",
    height: "480px",
    maxHeight: "calc(100vh - 140px)",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    zIndex: 999,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-tertiary)",
  },
  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--accent)",
    display: "inline-block",
  },
  headerTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    color: "var(--text-primary)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
    lineHeight: 1,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bubble: {
    maxWidth: "85%",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "var(--accent)",
    color: "var(--bg-primary)",
    borderBottomRightRadius: "4px",
  },
  aiBubble: {
    alignSelf: "flex-start",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    borderBottomLeftRadius: "4px",
    border: "1px solid var(--border)",
  },
  errorBubble: {
    alignSelf: "flex-start",
    background: "rgba(255, 107, 107, 0.1)",
    color: "#ff6b6b",
    border: "1px solid rgba(255, 107, 107, 0.3)",
  },
  typingDots: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--accent)",
    letterSpacing: "4px",
    opacity: 0.7,
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    padding: "12px 16px",
    borderTop: "1px solid var(--border)",
    background: "var(--bg-secondary)",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: "13px",
    borderRadius: "8px",
  },
  sendBtn: {
    background: "var(--accent)",
    color: "var(--bg-primary)",
    border: "none",
    borderRadius: "8px",
    width: "40px",
    height: "40px",
    fontSize: "18px",
    cursor: "pointer",
    transition: "var(--transition)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

export default Chatbot;
