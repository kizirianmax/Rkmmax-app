// src/components/betinho/AuthorizationDialog.jsx
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function AuthorizationDialog({ resumo, onResponse }) {
  const [selectedAction] = useState('authorize_all');

  const handleConfirm = () => {
    onResponse({
      acao: 'CONFIRMAR',
      feedback: '',
      acoesAutorizadas: selectedAction === 'authorize_all' ? ['all'] : []
    });
  };

  const handleCancel = () => {
    onResponse({
      acao: 'CANCELAR',
      feedback: 'Usuário cancelou a operação'
    });
  };

  return (
    <div className="authorization-overlay">
      <div className="authorization-dialog">
        <div className="dialog-header">
          <AlertTriangle size={32} className="warning-icon" />
          <h2>{resumo.titulo}</h2>
        </div>

        <div className="dialog-content">
          <div className="workflow-summary">
            <h3>📋 Resumo da Tarefa</h3>
            <p>{resumo.descricao}</p>
            
            <div className="workflow-details">
              <div className="detail-item">
                <strong>⏱️ Tempo estimado:</strong>
                <span>{resumo.tempo}</span>
              </div>
              
              {resumo.especialistas?.length > 0 && (
                <div className="detail-item">
                  <strong>👥 Especialistas:</strong>
                  <span>{resumo.especialistas.join(', ')}</span>
                </div>
              )}
              
              {resumo.github?.length > 0 && (
                <div className="detail-item">
                  <strong>🔗 GitHub:</strong>
                  <span>{resumo.github.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="workflow-steps">
            <h3>📝 Etapas ({resumo.etapas?.length})</h3>
            <ul>
              {resumo.etapas?.map((etapa, index) => (
                <li key={index}>
                  <span className="step-number">{etapa.ordem}</span>
                  <span className="step-description">{etapa.acao}</span>
                  <span className="step-time">~{Math.round(etapa.tempo / 60)}min</span>
                </li>
              ))}
            </ul>
          </div>

          {resumo.avisoConteudo && (
            <div className="content-warning">
              <div className="warning-header">
                <AlertTriangle size={20} />
                <strong>{resumo.avisoConteudo.titulo}</strong>
              </div>
              <div className="warning-content">
                <p>⚖️ Algumas ações requerem sua autorização explícita para alterar conteúdo.</p>
                <ul>
                  {resumo.avisoConteudo.acoes?.map((acao, index) => (
                    <li key={index}>
                      <strong>{acao.especialista}:</strong> {acao.descricao}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="dialog-actions">
          <button 
            className="btn-cancel" 
            onClick={handleCancel}
          >
            <XCircle size={20} />
            Cancelar
          </button>
          
          <button 
            className="btn-confirm" 
            onClick={handleConfirm}
          >
            <CheckCircle size={20} />
            Confirmar e Executar
          </button>
        </div>
      </div>
    </div>
  );
}