/**
 * Chatbot.test.tsx — Unit tests for the Chatbot component
 *
 * Tests cover:
 * - Initial render (welcome message, input focus)
 * - Sending a message (user message appears, API call made)
 * - API success (AI response displayed)
 * - API error (error message displayed)
 * - Network failure (error message displayed)
 * - Input behavior (Enter key, button disabled state)
 * - Loading state (typing indicator shown)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatbot from './Chatbot';

// Mock VITE_API_URL
const mockApiUrl = 'https://test-api.example.com';
vi.stubEnv('VITE_API_URL', mockApiUrl);

describe('Chatbot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch
    global.fetch = vi.fn();
  });

  it('renders welcome message on mount', () => {
    render(<Chatbot />);
    expect(screen.getByText(/Hi! I'm Camilo's AI Resume Assistant/)).toBeInTheDocument();
  });

  it('renders input and send button', () => {
    render(<Chatbot />);
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('chat-send')).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<Chatbot />);
    const sendBtn = screen.getByTestId('chat-send');
    expect(sendBtn).toBeDisabled();
  });

  it('send button becomes enabled when input has text', async () => {
    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');
    const sendBtn = screen.getByTestId('chat-send');

    await userEvent.type(input, 'What is your experience?');
    expect(sendBtn).not.toBeDisabled();
  });

  it('pressing Enter sends the message', async () => {
    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Test question{Enter}');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/chat'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('clicking send button sends the message', async () => {
    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');
    const sendBtn = screen.getByTestId('chat-send');

    await userEvent.type(input, 'Test question');
    await userEvent.click(sendBtn);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const mockedFetch = global.fetch as ReturnType<typeof vi.fn>;
    const fetchCall = mockedFetch.mock.calls[0] as [string, { body: string }];
    const callBody = JSON.parse(fetchCall[1].body);
    expect(callBody).toEqual({ question: 'Test question' });
  });

  it('displays user message immediately after sending', async () => {
    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'My question');
    await userEvent.click(screen.getByTestId('chat-send'));

    expect(screen.getByText('My question')).toBeInTheDocument();
  });

  it('clears input after sending', async () => {
    render(<Chatbot />);
    const input = screen.getByTestId('chat-input') as HTMLInputElement;

    await userEvent.type(input, 'My question');
    await userEvent.click(screen.getByTestId('chat-send'));

    expect(input.value).toBe('');
  });

  it('shows loading indicator while waiting for response', async () => {
    // Delay the fetch resolution
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ answer: 'Test answer' }),
              }),
            100
          )
        )
    );

    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Question');
    await userEvent.click(screen.getByTestId('chat-send'));

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('displays AI answer on successful response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ answer: 'Here is the answer.' }),
    });

    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Question?');
    await userEvent.click(screen.getByTestId('chat-send'));

    await waitFor(() => {
      expect(screen.getByText('Here is the answer.')).toBeInTheDocument();
    });
  });

  it('displays error message when API returns non-ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Something went wrong' }),
    });

    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Question');
    await userEvent.click(screen.getByTestId('chat-send'));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  it('displays generic error when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Question');
    await userEvent.click(screen.getByTestId('chat-send'));

    await waitFor(() => {
      expect(
        screen.getByText('Could not reach the server. Please check your connection.')
      ).toBeInTheDocument();
    });
  });

  it('does not send message if input is only whitespace', async () => {
    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, '   ');
    await userEvent.click(screen.getByTestId('chat-send'));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('disables input and button while loading', async () => {
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ answer: 'Answer' }),
              }),
            100
          )
        )
    );

    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Question');
    await userEvent.click(screen.getByTestId('chat-send'));

    expect(input).toBeDisabled();
    expect(screen.getByTestId('chat-send')).toBeDisabled();
  });

  it('renders markdown content in AI messages', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ answer: '**Bold** and *italic* text' }),
    });

    render(<Chatbot />);
    const input = screen.getByTestId('chat-input');

    await userEvent.type(input, 'Test');
    await userEvent.click(screen.getByTestId('chat-send'));

    await waitFor(() => {
      const bold = screen.getByText('Bold');
      expect(bold.tagName).toBe('STRONG');
    });
  });
});
