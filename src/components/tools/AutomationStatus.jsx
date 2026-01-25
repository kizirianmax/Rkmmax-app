/**
 * AutomationStatus - Layer 3 Automation Status Visualizer
 * Displays the progress of automation tasks with 5 phases
 * Uses Dracula theme to match the app style
 */

import React from 'react';

/**
 * AutomationStatus Component
 * Visualizes the progress of Layer 3 automation tasks
 * 
 * @param {Object} props - Component props
 * @param {Array} props.steps - Array of automation steps with phase, status, and details
 * @param {string} props.status - Overall status: INITIATED, SUCCESS, FAILED, BLOCKED
 * @returns {JSX.Element} - Rendered automation status visualization
 */
const AutomationStatus = ({ steps = [], status = 'INITIATED' }) => {
  // Define the 5 automation phases
  const phases = [
    { key: 'ANALYSIS', label: 'Analysis', icon: '📋', description: 'Analyzing command' },
    { key: 'SPECIALIST_SELECTION', label: 'Specialist Selection', icon: '🎯', description: 'Selecting specialist' },
    { key: 'CODE_GENERATION', label: 'Code Generation', icon: '💻', description: 'Generating code' },
    { key: 'SECURITY_VALIDATION', label: 'Validation', icon: '🔐', description: 'Security validation' },
    { key: 'GIT_COMMIT', label: 'Execution', icon: '📝', description: 'Commit & Push' },
  ];

  // Get status color based on overall status
  const getStatusColor = () => {
    switch (status) {
      case 'SUCCESS':
        return '#50fa7b'; // Dracula green
      case 'FAILED':
        return '#ff5555'; // Dracula red
      case 'BLOCKED':
        return '#ffb86c'; // Dracula orange
      case 'INITIATED':
      default:
        return '#8be9fd'; // Dracula cyan
    }
  };

  // Get step status for a phase
  const getPhaseStatus = (phaseKey) => {
    const step = steps.find(s => s.phase === phaseKey);
    return step ? step.status : 'PENDING';
  };

  // Get step details for a phase
  const getPhaseDetails = (phaseKey) => {
    const step = steps.find(s => s.phase === phaseKey);
    return step ? step : null;
  };

  // Render phase icon with status
  const renderPhaseIcon = (phase) => {
    const phaseStatus = getPhaseStatus(phase.key);
    
    let statusColor;
    switch (phaseStatus) {
      case 'COMPLETED':
        statusColor = '#50fa7b'; // Dracula green
        break;
      case 'IN_PROGRESS':
        statusColor = '#f1fa8c'; // Dracula yellow
        break;
      case 'FAILED':
        statusColor = '#ff5555'; // Dracula red
        break;
      default:
        statusColor = '#6272a4'; // Dracula comment (gray)
    }

    return (
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: statusColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          border: `3px solid ${statusColor}`,
          boxShadow: phaseStatus === 'COMPLETED' ? `0 0 10px ${statusColor}` : 'none',
        }}
      >
        {phaseStatus === 'COMPLETED' ? '✓' : phase.icon}
      </div>
    );
  };

  // Render phase details
  const renderPhaseDetails = (phase) => {
    const details = getPhaseDetails(phase.key);
    if (!details) return null;

    return (
      <div style={{
        marginTop: '8px',
        fontSize: '12px',
        color: '#bd93f9', // Dracula purple
        fontFamily: 'monospace',
      }}>
        {details.specialist && <div>Specialist: {details.specialist}</div>}
        {details.filesGenerated && <div>Files: {details.filesGenerated}</div>}
        {details.linesOfCode && <div>Lines: {details.linesOfCode}</div>}
        {details.warnings !== undefined && <div>Warnings: {details.warnings}</div>}
        {details.commitHash && <div>Commit: {details.commitHash.substring(0, 7)}</div>}
        {details.prNumber && <div>PR: #{details.prNumber}</div>}
      </div>
    );
  };

  return (
    <div style={{
      background: '#282a36', // Dracula background
      borderRadius: '12px',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#f8f8f2', // Dracula foreground
      border: '2px solid #44475a', // Dracula current line
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '600',
          color: '#f8f8f2',
        }}>
          🤖 Layer 3: Automation Status
        </h3>
        <div style={{
          padding: '6px 12px',
          borderRadius: '6px',
          background: `${getStatusColor()}22`,
          color: getStatusColor(),
          fontSize: '14px',
          fontWeight: '600',
          border: `1px solid ${getStatusColor()}`,
        }}>
          {status}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '8px',
        background: '#44475a',
        borderRadius: '4px',
        marginBottom: '32px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: `linear-gradient(90deg, #bd93f9, #ff79c6, #50fa7b)`,
          width: `${(steps.filter(s => s.status === 'COMPLETED').length / phases.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Phases */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
      }}>
        {phases.map((phase, index) => (
          <div key={phase.key} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            {/* Connector line */}
            {index < phases.length - 1 && (
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '50%',
                width: '100%',
                height: '2px',
                background: getPhaseStatus(phase.key) === 'COMPLETED' 
                  ? '#50fa7b' 
                  : '#44475a',
                zIndex: 0,
              }} />
            )}

            {/* Phase icon */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {renderPhaseIcon(phase)}
            </div>

            {/* Phase label */}
            <div style={{
              marginTop: '12px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#f8f8f2',
                marginBottom: '4px',
              }}>
                {phase.label}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6272a4',
              }}>
                {phase.description}
              </div>

              {/* Phase details */}
              {renderPhaseDetails(phase)}
            </div>
          </div>
        ))}
      </div>

      {/* Error or additional info */}
      {status === 'FAILED' && (
        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: '#ff555522',
          border: '1px solid #ff5555',
          borderRadius: '8px',
          color: '#ff5555',
          fontSize: '14px',
        }}>
          ❌ Automation failed. Check the logs for more details.
        </div>
      )}

      {status === 'BLOCKED' && (
        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: '#ffb86c22',
          border: '1px solid #ffb86c',
          borderRadius: '8px',
          color: '#ffb86c',
          fontSize: '14px',
        }}>
          ⚠️ Automation blocked by security validation.
        </div>
      )}

      {status === 'SUCCESS' && (
        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: '#50fa7b22',
          border: '1px solid #50fa7b',
          borderRadius: '8px',
          color: '#50fa7b',
          fontSize: '14px',
        }}>
          ✅ Automation completed successfully!
        </div>
      )}
    </div>
  );
};

export default AutomationStatus;
