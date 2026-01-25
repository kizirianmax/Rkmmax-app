/**
 * AUTOMATION STATUS COMPONENT
 * Visualizes automation workflow steps: Analysis → Selection → Generation → Validation → Execution
 * Dark/Dracula theme - Can be embedded in chat or used on full page
 */

import React from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import './AutomationStatus.css';

const AUTOMATION_STEPS = [
  { id: 'analysis', label: 'Analysis', description: 'Analyzing command' },
  { id: 'selection', label: 'Selection', description: 'Selecting specialist' },
  { id: 'generation', label: 'Generation', description: 'Generating code' },
  { id: 'validation', label: 'Validation', description: 'Security check' },
  { id: 'execution', label: 'Execution', description: 'Committing changes' },
];

/**
 * AutomationStatus Component
 * @param {Object} props
 * @param {Array} props.steps - Array of completed steps with status
 * @param {string} props.currentStep - Current active step id
 * @param {string} props.status - Overall status: 'pending', 'running', 'success', 'failed', 'blocked'
 * @param {boolean} props.embedded - If true, uses compact mode for chat embedding
 */
export default function AutomationStatus({ 
  steps = [], 
  currentStep = 'analysis', 
  status = 'pending',
  embedded = false 
}) {
  const getStepStatus = (stepId) => {
    const step = steps.find(s => s.phase?.toLowerCase() === stepId || s.id === stepId);
    
    if (step) {
      const stepStatus = step.status?.toUpperCase();
      if (stepStatus === 'COMPLETED') return 'completed';
      if (stepStatus === 'FAILED' || stepStatus === 'BLOCKED') return 'failed';
      return 'completed';
    }
    
    if (currentStep === stepId) return 'active';
    
    const stepIndex = AUTOMATION_STEPS.findIndex(s => s.id === stepId);
    const currentIndex = AUTOMATION_STEPS.findIndex(s => s.id === currentStep);
    
    return stepIndex < currentIndex ? 'completed' : 'pending';
  };

  const getStepIcon = (stepId) => {
    const stepStatus = getStepStatus(stepId);
    
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="step-icon completed" />;
      case 'active':
        return <Loader2 className="step-icon active animate-spin" />;
      case 'failed':
        return <AlertCircle className="step-icon failed" />;
      default:
        return <Circle className="step-icon pending" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'status-success';
      case 'failed':
      case 'blocked':
        return 'status-failed';
      case 'running':
        return 'status-running';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className={`automation-status ${embedded ? 'embedded' : 'standalone'}`}>
      <div className={`status-header ${getStatusColor()}`}>
        <h3 className="status-title">
          {status === 'running' && <Loader2 className="status-icon animate-spin" />}
          {status === 'success' && <CheckCircle className="status-icon" />}
          {(status === 'failed' || status === 'blocked') && <AlertCircle className="status-icon" />}
          {status === 'pending' && <Clock className="status-icon" />}
          Automation Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </h3>
      </div>

      <div className="steps-container">
        {AUTOMATION_STEPS.map((step, index) => {
          const stepStatus = getStepStatus(step.id);
          const stepData = steps.find(s => 
            s.phase?.toLowerCase() === step.id || s.id === step.id
          );

          return (
            <div key={step.id} className={`step-item ${stepStatus}`}>
              <div className="step-indicator">
                {getStepIcon(step.id)}
                {index < AUTOMATION_STEPS.length - 1 && (
                  <div className={`step-connector ${stepStatus === 'completed' ? 'completed' : ''}`} />
                )}
              </div>
              
              <div className="step-content">
                <div className="step-header">
                  <span className="step-label">{step.label}</span>
                  {stepStatus === 'active' && (
                    <span className="step-badge active">In Progress</span>
                  )}
                  {stepStatus === 'completed' && (
                    <span className="step-badge completed">Done</span>
                  )}
                  {stepStatus === 'failed' && (
                    <span className="step-badge failed">Failed</span>
                  )}
                </div>
                
                {!embedded && (
                  <p className="step-description">{step.description}</p>
                )}
                
                {stepData && stepData.details && !embedded && (
                  <div className="step-details">
                    {stepData.specialist && (
                      <div className="detail-item">
                        <span className="detail-label">Specialist:</span>
                        <span className="detail-value">{stepData.specialist}</span>
                      </div>
                    )}
                    {stepData.filesGenerated && (
                      <div className="detail-item">
                        <span className="detail-label">Files:</span>
                        <span className="detail-value">{stepData.filesGenerated}</span>
                      </div>
                    )}
                    {stepData.warnings !== undefined && (
                      <div className="detail-item">
                        <span className="detail-label">Warnings:</span>
                        <span className="detail-value">{stepData.warnings}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
