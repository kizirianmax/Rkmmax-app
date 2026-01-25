/**
 * Tests for ComplianceViewer Component (Layer 4)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComplianceViewer from './ComplianceViewer.jsx';

describe('ComplianceViewer Component', () => {
  test('renders compliance viewer with default state', () => {
    render(<ComplianceViewer />);
    expect(screen.getByText(/Layer 4: Compliance Check/i)).toBeInTheDocument();
    expect(screen.getByText(/ABNT, Legal, and Privacy compliance verification/i)).toBeInTheDocument();
  });

  test('displays all 3 compliance categories', () => {
    render(<ComplianceViewer />);
    expect(screen.getByText('ABNT Formatting')).toBeInTheDocument();
    expect(screen.getByText('Legal Checks')).toBeInTheDocument();
    expect(screen.getByText('Privacy/LGPD')).toBeInTheDocument();
  });

  test('shows compliance score', () => {
    render(<ComplianceViewer />);
    expect(screen.getByText(/Compliance Score/i)).toBeInTheDocument();
  });

  test('displays PENDING status by default', () => {
    render(<ComplianceViewer />);
    const pendingElements = screen.getAllByText('PENDING');
    expect(pendingElements.length).toBeGreaterThan(0);
  });

  test('shows PASS status for compliant checks', () => {
    const compliance = {
      abnt: {
        status: 'PASS',
        checks: [
          { name: 'Paragraph Structure', status: 'PASS', message: 'Looks good' },
        ],
      },
      legal: {
        status: 'PASS',
        checks: [],
      },
      privacy: {
        status: 'PASS',
        checks: [],
      },
    };

    render(<ComplianceViewer compliance={compliance} />);
    const passElements = screen.getAllByText('PASS');
    expect(passElements.length).toBeGreaterThan(0);
  });

  test('displays individual check results', () => {
    const compliance = {
      abnt: {
        status: 'PASS',
        checks: [
          { name: 'Paragraph Structure', status: 'PASS', message: 'Content follows proper structure' },
          { name: 'Citation Format', status: 'PASS', message: 'Citations are correct' },
        ],
      },
      legal: {
        status: 'PASS',
        checks: [],
      },
      privacy: {
        status: 'PASS',
        checks: [],
      },
    };

    render(<ComplianceViewer compliance={compliance} />);
    expect(screen.getByText('Paragraph Structure')).toBeInTheDocument();
    expect(screen.getByText('Citation Format')).toBeInTheDocument();
  });

  test('shows WARNING status when issues are detected', () => {
    const compliance = {
      abnt: {
        status: 'WARNING',
        checks: [
          { name: 'Academic Tone', status: 'WARNING', message: 'Informal language detected' },
        ],
      },
      legal: {
        status: 'PASS',
        checks: [],
      },
      privacy: {
        status: 'PASS',
        checks: [],
      },
    };

    render(<ComplianceViewer compliance={compliance} />);
    expect(screen.getByText('WARNING')).toBeInTheDocument();
    expect(screen.getByText('Academic Tone')).toBeInTheDocument();
  });

  test('displays compliance applied message when content is provided', () => {
    render(<ComplianceViewer content="Sample content" />);
    expect(screen.getByText(/Compliance Applied/i)).toBeInTheDocument();
  });

  test('calculates compliance score correctly', () => {
    const compliance = {
      abnt: {
        status: 'PASS',
        checks: [
          { name: 'Check 1', status: 'PASS' },
          { name: 'Check 2', status: 'PASS' },
        ],
      },
      legal: {
        status: 'PASS',
        checks: [
          { name: 'Check 3', status: 'PASS' },
        ],
      },
      privacy: {
        status: 'WARNING',
        checks: [
          { name: 'Check 4', status: 'WARNING' },
        ],
      },
    };

    render(<ComplianceViewer compliance={compliance} />);
    // Score should be 75% (3 out of 4 passed)
    expect(screen.getByText(/75%/i)).toBeInTheDocument();
  });

  test('handles empty checks gracefully', () => {
    const compliance = {
      abnt: { status: 'PENDING', checks: [] },
      legal: { status: 'PENDING', checks: [] },
      privacy: { status: 'PENDING', checks: [] },
    };

    render(<ComplianceViewer compliance={compliance} />);
    expect(screen.getByText(/Layer 4: Compliance Check/i)).toBeInTheDocument();
  });
});
