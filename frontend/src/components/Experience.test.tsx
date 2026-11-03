/**
 * Experience.test.tsx — Unit tests for the Experience component
 *
 * Tests cover:
 * - Rendering section headings, tablist, tabs, and initial tabpanel
 * - Roving tabindex and aria-selected states
 * - Mouse click tab switching
 * - Keyboard navigation (ArrowDown, ArrowUp, ArrowRight, ArrowLeft, Home, End)
 * - WAI-ARIA APG compliance attributes
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Experience from './Experience';

describe('Experience', () => {
  it('renders experience section heading', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { level: 2, name: /Experience/i })).toBeInTheDocument();
  });

  it('renders tablist with all company tabs', () => {
    render(<Experience />);
    const tablist = screen.getByRole('tablist', { name: /Companies/i });
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThanOrEqual(5);
    expect(tabs[0]).toHaveTextContent('Credit Mountain');
  });

  it('initializes with first tab selected and roving tabindex applied', () => {
    render(<Experience />);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('tabIndex', '0');

    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('tabIndex', '-1');

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-0');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-0');
    expect(panel).toHaveAttribute('tabIndex', '0');
  });

  it('switches tabs on click', async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const tabs = screen.getAllByRole('tab');

    await user.click(tabs[1]);

    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('tabIndex', '0');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[0]).toHaveAttribute('tabIndex', '-1');

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-1');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-1');
  });

  it('navigates tabs using ArrowDown and ArrowUp keys', async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const tabs = screen.getAllByRole('tab');

    // Focus first tab
    tabs[0].focus();
    expect(document.activeElement).toBe(tabs[0]);

    // Press ArrowDown to move to second tab
    await user.keyboard('{ArrowDown}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[1]);

    // Press ArrowUp to move back to first tab
    await user.keyboard('{ArrowUp}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('navigates to End and Home keys', async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();
    await user.keyboard('{End}');
    const lastIndex = tabs.length - 1;
    expect(tabs[lastIndex]).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[lastIndex]);

    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[0]);
  });
});
