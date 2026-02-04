/**
 * COMPLIANCE TOOLS PAGE
 * Standalone page for ABNT/LGPD compliance checking
 * Available at /compliance route
 */

import React, { useState } from 'react';
import { FileText, Send, Loader2, Download, Copy, CheckCircle } from 'lucide-react';
import ComplianceViewer from '../components/tools/ComplianceViewer.jsx';
import './ComplianceTools.css';

// Sample text for demonstration purposes
const SAMPLE_TEXT = `Introdução

Este trabalho apresenta uma análise sobre a Lei Geral de Proteção de Dados (LGPD), conforme estabelecido pela Lei nº 13.709/2018. O objetivo é compreender os impactos da legislação nas organizações brasileiras.

De acordo com Silva (2020), a LGPD representa um marco importante na proteção dos dados pessoais dos cidadãos. O autor afirma que "a privacidade é um direito fundamental que deve ser respeitado por todas as organizações" (SILVA, 2020, p. 45).

Metodologia

A pesquisa utilizou metodologia qualitativa, baseada em revisão bibliográfica de autores como Bioni (2019) e Doneda (2018).

Referências

BIONI, Bruno Ricardo. Proteção de Dados Pessoais: a função e os limites do consentimento. Rio de Janeiro: Forense, 2019.

DONEDA, Danilo. Da privacidade à proteção de dados pessoais. São Paulo: Thomson Reuters Brasil, 2018.

SILVA, João. LGPD e suas implicações. São Paulo: Atlas, 2020.`;

export default function ComplianceTools() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [complianceData, setComplianceData] = useState(null);
  const [copied, setCopied] = useState(false);

  /**
   * Analyze text for compliance
   */
  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Por favor, insira algum texto para análise');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call - in production, this would call a real compliance service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock compliance analysis
      const mockData = performMockAnalysis(text);
      setComplianceData(mockData);
    } catch (error) {
      console.error('Error analyzing compliance:', error);
      alert('Erro ao analisar texto');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Mock compliance analysis
   */
  const performMockAnalysis = (textContent) => {
    const wordCount = textContent.split(/\s+/).length;
    const hasReferences = /referências|bibliografia|abnt/i.test(textContent);
    const hasCitations = /\(.*?\d{4}\)|apud|et al/i.test(textContent);
    const hasPersonalData = /cpf|rg|telefone|email|endereço/i.test(textContent);
    const hasSensitiveData = /raça|religião|saúde|política|orientação sexual/i.test(textContent);
    const hasConsent = /consentimento|autorização|concordo|aceito/i.test(textContent);
    
    return {
      abnt: {
        status: 'checked',
        checks: [
          { 
            id: 'formatting', 
            label: 'Formatação NBR', 
            passed: wordCount > 50, 
            message: wordCount > 50 
              ? 'Texto possui extensão adequada para análise' 
              : 'Texto muito curto para análise completa' 
          },
          { 
            id: 'references', 
            label: 'Referências (NBR 6023)', 
            passed: hasReferences, 
            message: hasReferences 
              ? 'Referências identificadas no texto' 
              : 'Nenhuma referência bibliográfica identificada' 
          },
          { 
            id: 'citations', 
            label: 'Citações (NBR 10520)', 
            passed: hasCitations, 
            message: hasCitations 
              ? 'Citações formatadas identificadas' 
              : 'Nenhuma citação formatada identificada' 
          },
          { 
            id: 'structure', 
            label: 'Estrutura de Trabalho', 
            passed: wordCount > 100, 
            message: wordCount > 100 
              ? 'Estrutura de trabalho adequada' 
              : 'Texto necessita de maior desenvolvimento' 
          },
        ],
      },
      lgpd: {
        status: 'checked',
        checks: [
          { 
            id: 'personal_data', 
            label: 'Dados Pessoais', 
            passed: !hasPersonalData, 
            message: hasPersonalData 
              ? '⚠️ Dados pessoais identificados - verifique consentimento' 
              : '✓ Nenhum dado pessoal identificado' 
          },
          { 
            id: 'sensitive_data', 
            label: 'Dados Sensíveis', 
            passed: !hasSensitiveData, 
            message: hasSensitiveData 
              ? '⚠️ Dados sensíveis identificados - atenção redobrada necessária' 
              : '✓ Nenhum dado sensível identificado' 
          },
          { 
            id: 'consent', 
            label: 'Consentimento', 
            passed: hasConsent || !hasPersonalData, 
            message: (hasConsent || !hasPersonalData) 
              ? '✓ Termos de consentimento adequados' 
              : '⚠️ Verifique se há consentimento adequado para uso de dados' 
          },
          { 
            id: 'security', 
            label: 'Medidas de Segurança', 
            passed: true, 
            message: '✓ Nenhuma vulnerabilidade de segurança identificada' 
          },
        ],
      },
      legal: {
        status: 'checked',
        checks: [
          { 
            id: 'copyright', 
            label: 'Direitos Autorais', 
            passed: hasReferences, 
            message: hasReferences 
              ? '✓ Referências indicam respeito aos direitos autorais' 
              : '⚠️ Verifique atribuição de fontes e direitos autorais' 
          },
          { 
            id: 'terms', 
            label: 'Termos e Condições', 
            passed: true, 
            message: '✓ Sem violações de termos identificadas' 
          },
          { 
            id: 'accessibility', 
            label: 'Acessibilidade', 
            passed: wordCount < 500, 
            message: wordCount < 500 
              ? '✓ Texto com boa legibilidade' 
              : '⚠️ Texto longo - considere adicionar sumário ou divisões' 
          },
        ],
      },
    };
  };

  /**
   * Copy text to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      console.error('Clipboard API not available:', error);
      // Try the old execCommand method as fallback
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Copy fallback failed:', fallbackError);
        alert('Falha ao copiar texto. Por favor, copie manualmente.');
      }
    }
  };

  /**
   * Download report
   */
  const handleDownload = () => {
    if (!complianceData) return;
    
    const report = generateTextReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-conformidade-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Generate text report
   */
  const generateTextReport = () => {
    let report = '═══════════════════════════════════════════\n';
    report += '   RELATÓRIO DE CONFORMIDADE - RKMMAX\n';
    report += '═══════════════════════════════════════════\n\n';
    report += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
    report += `Caracteres analisados: ${text.length}\n\n`;
    
    ['abnt', 'lgpd', 'legal'].forEach(section => {
      if (!complianceData[section]) return;
      
      const titles = {
        abnt: 'ABNT - Normas Brasileiras',
        lgpd: 'LGPD - Lei Geral de Proteção de Dados',
        legal: 'Conformidade Legal'
      };
      
      report += `\n${titles[section]}\n`;
      report += '─'.repeat(40) + '\n';
      
      complianceData[section].checks.forEach(check => {
        report += `\n${check.passed ? '✓' : '✗'} ${check.label}\n`;
        report += `  ${check.message}\n`;
      });
    });
    
    report += '\n\n═══════════════════════════════════════════\n';
    report += '⚠️  Este é um relatório automatizado.\n';
    report += '    Para análise completa, consulte um especialista.\n';
    report += '═══════════════════════════════════════════\n';
    
    return report;
  };

  /**
   * Load sample text
   */
  const loadSample = () => {
    setText(SAMPLE_TEXT);
  };

  return (
    <div className="compliance-tools-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <FileText className="header-icon" />
            <div>
              <h1 className="page-title">Ferramentas de Conformidade</h1>
              <p className="page-subtitle">
                Análise de ABNT, LGPD e Conformidade Legal
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          {/* Input Section */}
          <div className="input-section">
            <div className="input-header">
              <h2 className="section-title">Texto para Análise</h2>
              <div className="header-actions">
                <button 
                  className="action-btn secondary"
                  onClick={loadSample}
                  disabled={isAnalyzing}
                >
                  Carregar Exemplo
                </button>
                {text && (
                  <button 
                    className="action-btn secondary"
                    onClick={handleCopy}
                    disabled={isAnalyzing}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="btn-icon" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="btn-icon" />
                        Copiar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <textarea
              className="text-input"
              placeholder="Cole ou digite seu texto aqui para análise de conformidade...

Exemplo: Trabalho acadêmico, documentação técnica, termos de uso, política de privacidade, etc."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isAnalyzing}
              rows={12}
            />

            <div className="input-footer">
              <span className="char-count">
                {text.length} caracteres
              </span>
              <button
                className="action-btn primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="btn-icon animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Send className="btn-icon" />
                    Analisar Conformidade
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {complianceData && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="section-title">Resultados da Análise</h2>
                <button
                  className="action-btn secondary"
                  onClick={handleDownload}
                >
                  <Download className="btn-icon" />
                  Baixar Relatório
                </button>
              </div>

              <ComplianceViewer 
                complianceData={complianceData}
                text={text}
                embedded={false}
              />
            </div>
          )}

          {/* Info Section */}
          {!complianceData && !isAnalyzing && (
            <div className="info-section">
              <h3 className="info-title">O que será verificado?</h3>
              <div className="info-grid">
                <div className="info-card">
                  <FileText className="info-icon" />
                  <h4>ABNT</h4>
                  <ul>
                    <li>Formatação de referências (NBR 6023)</li>
                    <li>Citações (NBR 10520)</li>
                    <li>Estrutura de trabalhos acadêmicos</li>
                    <li>Normas técnicas</li>
                  </ul>
                </div>

                <div className="info-card">
                  <FileText className="info-icon" />
                  <h4>LGPD</h4>
                  <ul>
                    <li>Dados pessoais sensíveis</li>
                    <li>Termos de consentimento</li>
                    <li>Medidas de segurança</li>
                    <li>Direitos dos titulares</li>
                  </ul>
                </div>

                <div className="info-card">
                  <FileText className="info-icon" />
                  <h4>Legal</h4>
                  <ul>
                    <li>Direitos autorais</li>
                    <li>Termos e condições</li>
                    <li>Acessibilidade</li>
                    <li>Conformidade geral</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
