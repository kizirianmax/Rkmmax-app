/**
 * Tests for AutomationStatus Component (Layer 3)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutomationStatus from './AutomationStatus.jsx';

describe('AutomationStatus Component', () => {
  test('renders automation status with INITIATED state', () => {
    render(<AutomationStatus steps={[]} status="INITIATED" />);
    expect(screen.getByText(/Layer 3: Automation Status/i)).toBeInTheDocument();
    expect(screen.getByText('INITIATED')).toBeInTheDocument();
  });

  test('displays all 5 automation phases', () => {
    render(<AutomationStatus steps={[]} status="INITIATED" />);
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Specialist Selection')).toBeInTheDocument();
    expect(screen.getByText('Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(screen.getByText('Execution')).toBeInTheDocument();
  });

  test('shows completed steps with checkmarks', () => {
    const steps = [
      { phase: 'ANALYSIS', status: 'COMPLETED', details: {} },
      { phase: 'SPECIALIST_SELECTION', status: 'COMPLETED', specialist: 'didak' },
    ];

    render(<AutomationStatus steps={steps} status="INITIATED" />);
    
    // Check if progress is shown
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Specialist Selection')).toBeInTheDocument();
  });

  test('displays specialist details when available', () => {
    const steps = [
      { 
        phase: 'SPECIALIST_SELECTION', 
        status: 'COMPLETED', 
        specialist: 'didak',
        details: { specialist: 'didak' }
      },
    ];

    render(<AutomationStatus steps={steps} status="INITIATED" />);
    expect(screen.getByText(/Specialist:/i)).toBeInTheDocument();
  });

  test('shows success message when status is SUCCESS', () => {
    const steps = [
      { phase: 'ANALYSIS', status: 'COMPLETED' },
      { phase: 'SPECIALIST_SELECTION', status: 'COMPLETED' },
      { phase: 'CODE_GENERATION', status: 'COMPLETED' },
      { phase: 'SECURITY_VALIDATION', status: 'COMPLETED' },
      { phase: 'GIT_COMMIT', status: 'COMPLETED' },
    ];

    render(<AutomationStatus steps={steps} status="SUCCESS" />);
    expect(screen.getByText(/Automation completed successfully/i)).toBeInTheDocument();
  });

  test('shows error message when status is FAILED', () => {
    render(<AutomationStatus steps={[]} status="FAILED" />);
    expect(screen.getByText(/Automation failed/i)).toBeInTheDocument();
  });

  test('shows blocked message when status is BLOCKED', () => {
    render(<AutomationStatus steps={[]} status="BLOCKED" />);
    expect(screen.getByText(/Automation blocked by security validation/i)).toBeInTheDocument();
  });

  test('displays file and line information when available', () => {
    const steps = [
      { 
        phase: 'CODE_GENERATION', 
        status: 'COMPLETED',
        filesGenerated: 3,
        linesOfCode: 150,
      },
    ];

    render(<AutomationStatus steps={steps} status="INITIATED" />);
    expect(screen.getByText(/Files: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Lines: 150/i)).toBeInTheDocument();
  });

  test('displays commit hash when available', () => {
    const steps = [
      { 
        phase: 'GIT_COMMIT', 
        status: 'COMPLETED',
        commitHash: 'abc123def456',
      },
    ];

    render(<AutomationStatus steps={steps} status="INITIATED" />);
    expect(screen.getByText(/Commit: abc123d/i)).toBeInTheDocument();
  });
});
