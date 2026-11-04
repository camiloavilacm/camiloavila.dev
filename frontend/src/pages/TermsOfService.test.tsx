import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TermsOfService from './TermsOfService';

describe('TermsOfService Page', () => {
  it('renders terms of service heading and back link', () => {
    render(
      <BrowserRouter>
        <TermsOfService />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /Terms of Service/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Portfolio/i })).toBeInTheDocument();
  });

  it('contains essential terms sections', () => {
    render(
      <BrowserRouter>
        <TermsOfService />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: /1\. Acceptance of Terms/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /2\. Description of the Site/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /3\. Acceptable Use/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /4\. AI Assistant Disclaimer/i })
    ).toBeInTheDocument();
  });
});
