/**
 * ComplianceViewer - Layer 4 Compliance Status Visualizer
 * Displays ABNT formatting, Legal checks, and Privacy/LGPD compliance
 * Uses Dracula theme to match the app style
 */

import React from 'react';

/**
 * ComplianceViewer Component
 * Visualizes Layer 4 compliance checks and status
 * 
 * @param {Object} props - Component props
 * @param {Object} props.compliance - Compliance data with ABNT, legal, and privacy checks
 * @param {string} props.content - The content being checked for compliance
 * @returns {JSX.Element} - Rendered compliance viewer
 */
const ComplianceViewer = ({ 
  compliance = {
    abnt: { status: 'PENDING', checks: [] },
    legal: { status: 'PENDING', checks: [] },
    privacy: { status: 'PENDING', checks: [] },
  },
  content = ''
}) => {
  // Compliance categories
  const categories = [
    {
      key: 'abnt',
      label: 'ABNT Formatting',
      icon: '📄',
      description: 'Academic standards compliance',
      color: '#bd93f9', // Dracula purple
    },
    {
      key: 'legal',
      label: 'Legal Checks',
      icon: '⚖️',
      description: 'Legal and regulatory compliance',
      color: '#ffb86c', // Dracula orange
    },
    {
      key: 'privacy',
      label: 'Privacy/LGPD',
      icon: '🔒',
      description: 'Data protection and privacy',
      color: '#8be9fd', // Dracula cyan
    },
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS':
      case 'COMPLIANT':
        return '#50fa7b'; // Dracula green
      case 'FAIL':
      case 'NON_COMPLIANT':
        return '#ff5555'; // Dracula red
      case 'WARNING':
        return '#f1fa8c'; // Dracula yellow
      case 'PENDING':
      default:
        return '#6272a4'; // Dracula comment (gray)
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
      case 'COMPLIANT':
        return '✓';
      case 'FAIL':
      case 'NON_COMPLIANT':
        return '✗';
      case 'WARNING':
        return '⚠';
      case 'PENDING':
      default:
        return '○';
    }
  };

  // Render compliance category
  const renderCategory = (category) => {
    const data = compliance[category.key] || { status: 'PENDING', checks: [] };
    const statusColor = getStatusColor(data.status);
    const statusIcon = getStatusIcon(data.status);

    return (
      <div
        key={category.key}
        style={{
          background: '#44475a', // Dracula current line
          borderRadius: '8px',
          padding: '16px',
          border: `2px solid ${statusColor}44`,
        }}
      >
        {/* Category header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '24px' }}>{category.icon}</span>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f8f8f2',
              }}>
                {category.label}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6272a4',
              }}>
                {category.description}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: `${statusColor}22`,
            border: `1px solid ${statusColor}`,
            fontSize: '14px',
            fontWeight: '600',
            color: statusColor,
          }}>
            <span>{statusIcon}</span>
            <span>{data.status}</span>
          </div>
        </div>

        {/* Checks list */}
        {data.checks && data.checks.length > 0 && (
          <div style={{
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {data.checks.map((check, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#f8f8f2',
                  padding: '8px',
                  background: '#282a36',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${getStatusColor(check.status)}`,
                }}
              >
                <span style={{ color: getStatusColor(check.status) }}>
                  {getStatusIcon(check.status)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{check.name}</div>
                  {check.message && (
                    <div style={{
                      fontSize: '11px',
                      color: '#6272a4',
                      marginTop: '4px',
                    }}>
                      {check.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Calculate overall compliance score
  const calculateScore = () => {
    let total = 0;
    let passed = 0;

    categories.forEach(cat => {
      const data = compliance[cat.key];
      if (data && data.checks) {
        total += data.checks.length;
        passed += data.checks.filter(c => 
          c.status === 'PASS' || c.status === 'COMPLIANT'
        ).length;
      }
    });

    return total > 0 ? Math.round((passed / total) * 100) : 0;
  };

  const complianceScore = calculateScore();

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
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#f8f8f2',
          }}>
            🛡️ Layer 4: Compliance Check
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '13px',
            color: '#6272a4',
          }}>
            ABNT, Legal, and Privacy compliance verification
          </p>
        </div>

        {/* Compliance score */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `conic-gradient(
              #50fa7b 0% ${complianceScore}%,
              #44475a ${complianceScore}% 100%
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#282a36',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700',
              color: complianceScore >= 80 ? '#50fa7b' : 
                     complianceScore >= 60 ? '#f1fa8c' : '#ff5555',
            }}>
              {complianceScore}%
            </div>
          </div>
          <div style={{
            fontSize: '11px',
            color: '#6272a4',
          }}>
            Compliance Score
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {categories.map(category => renderCategory(category))}
      </div>

      {/* Applied compliance info */}
      {content && (
        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: '#44475a',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#bd93f9',
          fontFamily: 'monospace',
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            ℹ️ Compliance Applied
          </div>
          <div style={{ color: '#6272a4' }}>
            Content has been processed through Layer 4 compliance checks.
            {complianceScore >= 80 ? ' All checks passed!' : 
             complianceScore >= 60 ? ' Some warnings detected.' : 
             ' Issues found - please review.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceViewer;
