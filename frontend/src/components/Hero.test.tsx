/**
 * Hero.test.tsx — Unit tests for the Hero component
 *
 * Tests cover:
 * - Rendering greeting, full name heading, and role tagline
 * - Rendering CTA links (contact, LinkedIn, GitHub)
 * - Verifying accessible names and external link attributes
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero', () => {
  it('renders greeting, name, and tagline', () => {
    render(<Hero />);

    expect(screen.getByText('Hi, my name is')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Camilo Avila' })).toBeInTheDocument();
    expect(screen.getByText(/Senior Quality Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/AWS Certified - AI and Cloud/i)).toBeInTheDocument();
  });

  it('renders call-to-action buttons with accessible labels', () => {
    render(<Hero />);

    const contactBtn = screen.getByRole('link', { name: /Go to contact section/i });
    expect(contactBtn).toHaveAttribute('href', '#contact');

    const linkedInBtn = screen.getByRole('link', { name: /View LinkedIn profile/i });
    expect(linkedInBtn).toHaveAttribute('href', 'https://www.linkedin.com/in/camiloavila');
    expect(linkedInBtn).toHaveAttribute('target', '_blank');
    expect(linkedInBtn).toHaveAttribute('rel', 'noopener noreferrer');

    const gitHubBtn = screen.getByRole('link', { name: /View GitHub profile/i });
    expect(gitHubBtn).toHaveAttribute('href', 'https://github.com/camiloavilacm');
    expect(gitHubBtn).toHaveAttribute('target', '_blank');
    expect(gitHubBtn).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
