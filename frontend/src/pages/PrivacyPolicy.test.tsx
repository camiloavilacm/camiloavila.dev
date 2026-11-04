import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';

describe('PrivacyPolicy Page', () => {
  it('renders privacy policy heading and back link', () => {
    render(
      <BrowserRouter>
        <PrivacyPolicy />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Portfolio/i })).toBeInTheDocument();
  });

  it('contains essential policy sections', () => {
    render(
      <BrowserRouter>
        <PrivacyPolicy />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: /1\. Introduction/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /2\. Information We Collect/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /3\. How We Use Information/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /7\. Contact Us/i })).toBeInTheDocument();
  });
});
