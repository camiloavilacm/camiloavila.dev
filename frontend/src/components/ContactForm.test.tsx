/**
 * ContactForm.test.tsx — Unit tests for the ContactForm component
 *
 * Tests cover:
 * - Initial render (empty form, intro text)
 * - Field validation (required, email format, max length)
 * - Input changes clear errors
 * - Form submission (success, server error, network error)
 * - Success state (message display, reset button)
 * - Loading state
 * - Character count display
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

// Mock VITE_API_URL
const mockApiUrl = 'https://test-api.example.com';
vi.stubEnv('VITE_API_URL', mockApiUrl);

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('Initial Render', () => {
    it('renders the contact section heading', () => {
      render(<ContactForm />);
      expect(screen.getByRole('heading', { name: /Get In Touch/i })).toBeInTheDocument();
    });

    it('renders intro text', () => {
      render(<ContactForm />);
      expect(
        screen.getByText(/currently available for Senior QA Automation Engineer roles/i)
      ).toBeInTheDocument();
    });

    it('renders empty form fields', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/Name/i)).toHaveValue('');
      expect(screen.getByLabelText(/Email/i)).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /Message/i })).toHaveValue('');
    });

    it('renders send button', () => {
      render(<ContactForm />);
      expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
    });

    it('does not show any status messages initially', () => {
      render(<ContactForm />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Field Validation', () => {
    it('shows error when name is empty on submit', async () => {
      render(<ContactForm />);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'Test message');

      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    });

    it('shows error when email is empty on submit', async () => {
      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(messageInput, 'Test message');

      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.type(messageInput, 'Test message');

      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
    });

    it('shows error when message is empty on submit', async () => {
      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'test@example.com');

      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(await screen.findByText('Message is required.')).toBeInTheDocument();
    });

    it('shows error when message exceeds 2000 characters', async () => {
      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });
      const longMessage = 'a'.repeat(2001);

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, longMessage);
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(await screen.findByText('Message must be under 2000 characters.')).toBeInTheDocument();
    });

    it('clears field error when user types in that field', async () => {
      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);

      // Submit empty form to trigger errors
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));
      expect(await screen.findByText('Name is required.')).toBeInTheDocument();

      // Type in name field
      await userEvent.type(nameInput, 'John');
      expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();
    });
  });

  describe('Character Count', () => {
    it('displays character count for message', () => {
      render(<ContactForm />);
      expect(screen.getByText('0/2000')).toBeInTheDocument();
    });

    it('updates character count as user types', async () => {
      render(<ContactForm />);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(messageInput, 'Hello');

      expect(screen.getByText('5/2000')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form with correct data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test message');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contact'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const fetchCall = global.fetch.mock.calls[0] as [string, { body: string }];
      const callBody = JSON.parse(fetchCall[1].body);
      expect(callBody).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      });
    });

    it('shows loading state during submission', async () => {
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ message: 'Success' }),
                }),
              100
            )
          )
      );

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      const sendBtn = screen.getByRole('button', { name: /Send message/i });
      expect(sendBtn).toHaveTextContent('Sending...');
      expect(sendBtn).toBeDisabled();
    });

    it('shows success message on successful submission', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Message sent successfully!' }),
      });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(screen.getByText(/Message sent successfully!/i)).toBeInTheDocument();
      });
    });

    it('clears form after successful submission', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      // On success, the form is replaced by a success message
      await waitFor(() => {
        expect(screen.getByText(/Message sent successfully!/i)).toBeInTheDocument();
      });
    });

    it('shows server error message on API error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error occurred' }),
      });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(screen.getByText('Server error occurred')).toBeInTheDocument();
      });
    });

    it('shows generic error on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(
          screen.getByText(
            'Could not reach the server. Please check your connection and try again.'
          )
        ).toBeInTheDocument();
      });
    });

    it('allows resubmission after error', async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' }),
        });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      // First submission fails
      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(
          screen.getByText(
            'Could not reach the server. Please check your connection and try again.'
          )
        ).toBeInTheDocument();
      });

      // Second submission succeeds
      await userEvent.type(nameInput, 'John2');
      await userEvent.type(emailInput, 'john2@example.com');
      await userEvent.type(messageInput, 'Test2');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(screen.getByText(/Message sent successfully!/i)).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Success State', () => {
    it('shows success box with message after successful submission', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Message sent successfully!' }),
      });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert', { name: /success/i })).toBeInTheDocument();
      });
    });

    it('shows "Send another message" button in success state', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Send another message/i })).toBeInTheDocument();
      });
    });

    it('resets to idle state when "Send another message" is clicked', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      });

      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const messageInput = screen.getByRole('textbox', { name: /Message/i });

      await userEvent.type(nameInput, 'John');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(messageInput, 'Test');
      await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Send another message/i })).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: /Send another message/i }));

      // Form should be visible again
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria labels on form', () => {
      render(<ContactForm />);
      expect(screen.getByRole('form', { name: /Contact form/i })).toBeInTheDocument();
    });

    it('has proper aria-invalid on errored fields', async () => {
      render(<ContactForm />);
      const submitBtn = screen.getByRole('button', { name: /Send Message/i });

      await userEvent.click(submitBtn);

      const nameInput = screen.getByLabelText(/Name/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('has proper aria-describedby on errored fields', async () => {
      render(<ContactForm />);
      const submitBtn = screen.getByRole('button', { name: /Send Message/i });

      await userEvent.click(submitBtn);

      const nameInput = screen.getByLabelText(/Name/i);
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });
  });
});
