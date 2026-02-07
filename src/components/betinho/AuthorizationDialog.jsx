// src/components/betinho/AuthorizationDialog.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Settings } from 'lucide-react';
import './BetinhoUI.css';

export default function AuthorizationDialog({ resumo, onConfirm, onCancel }) {
  const [feedback, setFeedback] = useState('');

  const handleConfirm = () => {
    onConfirm({
      acao: 'CONFIRMAR',
      feedback: feedback.trim(),
      acoesAutorizadas: resumo.github || [],
      timestamp: new Date()
    });
  };

  const handleAdjust = () => {
    onConfirm({
      acao: 'AJUSTAR',
      feedback: feedback.trim(),
      ajustes: {},
      timestamp: new Date()
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="authorization-overlay">
      <div className="authorization-dialog">
        {/* Header */}
        <div className="dialog-header">
          <AlertTriangle size={32} />
          <div>
            <h2>{resumo.titulo}</h2>
            <p>{resumo.descricao}</p>
          </div>
        </div>

        {/* Content */}
        <div className="dialog-content">
          {/* Workflow Summary */}
          <section>
            <h3>📋 O que vou fazer:</h3>
            <div className="workflow-summary">
              <ul>
                {resumo.etapas?.map((etapa, index) => (
                  <li key={index}>
                    <span>
                      <strong>{etapa.ordem}.</strong> {etapa.acao}
                    </span>
                    <span className="time-estimate">
                      <Clock size={14} /> {etapa.tempo}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Time Estimate */}
          {resumo.tempo && (
            <section style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} />
                <span><strong>Tempo estimado:</strong> {resumo.tempo}</span>
              </div>
            </section>
          )}

          {/* Specialists */}
          {resumo.especialistas && resumo.especialistas.length > 0 && (
            <section style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>👥</span>
                <span><strong>Especialistas envolvidos:</strong> {resumo.especialistas.join(', ')}</span>
              </div>
            </section>
          )}

          {/* GitHub Operations */}
          {resumo.github && resumo.github.length > 0 && (
            <section style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💻</span>
                <span><strong>Operações GitHub:</strong> {resumo.github.join(', ')}</span>
              </div>
            </section>
          )}

          {/* Content Warning */}
          {resumo.avisoConteudo && (
            <div className="content-warning">
              <AlertTriangle size={24} />
              <div>
                <h4>{resumo.avisoConteudo.titulo}</h4>
                <p>As seguintes ações vão ALTERAR CONTEÚDO e precisam da sua autorização:</p>
                <ul>
                  {resumo.avisoConteudo.acoes.map((acao, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      <span>
                        <strong>Etapa {acao.etapa}:</strong> {acao.descricao}
                        {acao.exemplo && <em> (Ex: {acao.exemplo})</em>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Feedback Input */}
          <section style={{ marginTop: '1.5rem' }}>
            <label htmlFor="feedback-input" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              💬 Comentários ou ajustes? (opcional)
            </label>
            <textarea
              id="feedback-input"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ex: Por favor, use tom mais formal / Não precisa criar issue no GitHub..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                resize: 'vertical'
              }}
            />
          </section>
        </div>

        {/* Actions */}
        <div className="dialog-actions">
          <button onClick={handleCancel} className="btn-cancel">
            <XCircle size={18} />
            Cancelar
          </button>
          
          <button onClick={handleAdjust} className="btn-adjust">
            <Settings size={18} />
            Ajustar
          </button>
          
          <button onClick={handleConfirm} className="btn-confirm">
            <CheckCircle size={18} />
            Confirmar e Executar
          </button>
        </div>
      </div>
    </div>
  );
}