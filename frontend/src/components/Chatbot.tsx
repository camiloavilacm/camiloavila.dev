/**
 * Chatbot.tsx — AI Resume Assistant (Inline Version)
 *
 * A search-bar style chat widget that appears inline in the page flow,
 * immediately after the Hero/About section. Always visible, no toggle.
 *
 * Powered by the ChatbotAgent Lambda via the API Gateway /chat endpoint.
 *
 * The API URL is read from VITE_API_URL environment variable.
 */

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

/** A single message in the chat thread. */
interface Message {
  role: 'user' | 'ai' | 'error';
  text: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? '';

/** Initial greeting shown on load. */
const WELCOME_MESSAGE: Message = {
  role: 'ai',
  text: "Hi! I'm Camilo's AI Resume Assistant. Ask me anything about his skills, experience, certifications, or availability. 👋",
};

/**
 * Inline chatbot component (always visible, no toggle).
 *
 * @returns An always-visible chat widget styled like a search bar.
 */
const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: Message = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (response.ok && data.answer) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            text: data.error ?? 'Something went wrong. Please try again.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          text: 'Could not reach the server. Please check your connection.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container} aria-label="AI Resume Assistant">
      {/* Messages */}
      <div style={styles.messages} aria-live="polite">
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble),
              ...(msg.role === 'error' ? styles.errorBubble : {}),
            }}
            data-testid={`message-${msg.role}`}
          >
            {msg.role === 'ai' ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
                  ul: ({ children }) => (
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>
                  ),
                  li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                  strong: ({ children }) => (
                    <strong style={{ color: 'var(--accent)' }}>{children}</strong>
                  ),
                  code: ({ children }) => (
                    <code
                      style={{
                        background: 'rgba(100, 255, 218, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '13px',
                      }}
                    >
                      {children}
                    </code>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ ...styles.bubble, ...styles.aiBubble }} data-testid="loading-indicator">
            <span style={styles.typingDots} aria-label="Thinking">
              ● ● ●
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputWrapper}>
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
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto 80px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  bubble: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  userBubble: {
    alignSelf: 'flex-end',
    background: 'var(--accent)',
    color: 'var(--bg-primary)',
    borderBottomRightRadius: '4px',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    borderBottomLeftRadius: '4px',
    border: '1px solid var(--border)',
  },
  errorBubble: {
    alignSelf: 'flex-start',
    background: 'rgba(255, 107, 107, 0.1)',
    color: '#ff6b6b',
    border: '1px solid rgba(255, 107, 107, 0.3)',
  },
  typingDots: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--accent)',
    letterSpacing: '4px',
    opacity: 0.7,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: '24px',
    padding: '4px 8px 4px 20px',
    transition: 'var(--transition)',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    padding: '8px 0',
  },
  sendBtn: {
    background: 'var(--accent)',
    color: 'var(--bg-primary)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
};

export default Chatbot;
