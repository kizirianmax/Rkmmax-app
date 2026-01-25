/**
 * COMPLIANCE VIEWER COMPONENT
 * Displays ABNT formatting rules, LGPD checks, and legal compliance validation
 * Shows visual indicators (Green checkmarks for passed checks)
 */

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, FileText, Shield, Scale } from 'lucide-react';
import './ComplianceViewer.css';

/**
 * ComplianceViewer Component
 * @param {Object} props
 * @param {Object} props.complianceData - Compliance check results
 * @param {string} props.text - Text being analyzed
 * @param {boolean} props.embedded - If true, uses compact mode for chat embedding
 */
export default function ComplianceViewer({ 
  complianceData = null, 
  text = '',
  embedded = false 
}) {
  // Default compliance data if none provided
  const defaultData = {
    abnt: {
      status: 'checking',
      checks: [
        { id: 'formatting', label: 'Formatação NBR', passed: false, message: 'Verificando...' },
        { id: 'references', label: 'Referências (NBR 6023)', passed: false, message: 'Verificando...' },
        { id: 'citations', label: 'Citações (NBR 10520)', passed: false, message: 'Verificando...' },
        { id: 'structure', label: 'Estrutura de Trabalho', passed: false, message: 'Verificando...' },
      ],
    },
    lgpd: {
      status: 'checking',
      checks: [
        { id: 'personal_data', label: 'Dados Pessoais', passed: false, message: 'Verificando...' },
        { id: 'sensitive_data', label: 'Dados Sensíveis', passed: false, message: 'Verificando...' },
        { id: 'consent', label: 'Consentimento', passed: false, message: 'Verificando...' },
        { id: 'security', label: 'Medidas de Segurança', passed: false, message: 'Verificando...' },
      ],
    },
    legal: {
      status: 'checking',
      checks: [
        { id: 'copyright', label: 'Direitos Autorais', passed: false, message: 'Verificando...' },
        { id: 'terms', label: 'Termos e Condições', passed: false, message: 'Verificando...' },
        { id: 'accessibility', label: 'Acessibilidade', passed: false, message: 'Verificando...' },
      ],
    },
  };

  const data = complianceData || defaultData;

  const getOverallStatus = (section) => {
    if (!data[section]) return 'unknown';
    
    const checks = data[section].checks || [];
    if (checks.length === 0) return 'unknown';
    
    const allPassed = checks.every(check => check.passed === true);
    const anyFailed = checks.some(check => check.passed === false);
    const allChecking = checks.every(check => check.passed === undefined || check.passed === null);
    
    if (allPassed) return 'passed';
    if (anyFailed) return 'failed';
    if (allChecking) return 'checking';
    return 'warning';
  };

  const renderCheckIcon = (check) => {
    if (check.passed === true) {
      return <CheckCircle className="check-icon passed" />;
    } else if (check.passed === false) {
      return <XCircle className="check-icon failed" />;
    } else {
      return <AlertTriangle className="check-icon warning" />;
    }
  };

  const renderSection = (sectionKey, sectionData, icon, title) => {
    const status = getOverallStatus(sectionKey);
    
    return (
      <div className={`compliance-section ${status}`}>
        <div className="section-header">
          <div className="section-title-wrapper">
            {icon}
            <h3 className="section-title">{title}</h3>
          </div>
          <span className={`status-badge ${status}`}>
            {status === 'passed' && 'Aprovado'}
            {status === 'failed' && 'Reprovado'}
            {status === 'warning' && 'Atenção'}
            {status === 'checking' && 'Verificando...'}
          </span>
        </div>

        <div className="checks-list">
          {sectionData.checks.map((check) => (
            <div key={check.id} className={`check-item ${check.passed ? 'passed' : check.passed === false ? 'failed' : 'checking'}`}>
              <div className="check-header">
                {renderCheckIcon(check)}
                <span className="check-label">{check.label}</span>
              </div>
              {check.message && !embedded && (
                <p className="check-message">{check.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const overallPassed = ['abnt', 'lgpd', 'legal'].every(
    section => getOverallStatus(section) === 'passed'
  );

  const hasFailures = ['abnt', 'lgpd', 'legal'].some(
    section => getOverallStatus(section) === 'failed'
  );

  return (
    <div className={`compliance-viewer ${embedded ? 'embedded' : 'standalone'}`}>
      <div className={`viewer-header ${overallPassed ? 'success' : hasFailures ? 'failed' : 'neutral'}`}>
        <h2 className="viewer-title">
          {overallPassed && <CheckCircle className="title-icon" />}
          {hasFailures && <XCircle className="title-icon" />}
          {!overallPassed && !hasFailures && <Shield className="title-icon" />}
          Relatório de Conformidade
        </h2>
        {text && !embedded && (
          <p className="viewer-subtitle">
            Analisando {text.length} caracteres
          </p>
        )}
      </div>

      <div className="sections-container">
        {data.abnt && renderSection(
          'abnt',
          data.abnt,
          <FileText className="section-icon" />,
          'ABNT - Normas Brasileiras'
        )}

        {data.lgpd && renderSection(
          'lgpd',
          data.lgpd,
          <Shield className="section-icon" />,
          'LGPD - Lei Geral de Proteção de Dados'
        )}

        {data.legal && renderSection(
          'legal',
          data.legal,
          <Scale className="section-icon" />,
          'Conformidade Legal'
        )}
      </div>

      {!embedded && (
        <div className="viewer-footer">
          <p className="footer-note">
            ⚠️ Este é um relatório automatizado. Para análise completa, consulte um especialista.
          </p>
        </div>
      )}
    </div>
  );
}
