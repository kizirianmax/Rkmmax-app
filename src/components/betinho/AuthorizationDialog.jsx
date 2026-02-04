// src/components/betinho/AuthorizationDialog.jsx
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function AuthorizationDialog({ resumo, onResponse }) {
  const [selected, setSelected] = useState([]);

  const handleConfirm = () => {
    onResponse({
      acao: 'CONFIRMAR',
      acoesAutorizadas: selected.length > 0 ? selected : 'all',
      aprovado: true
    });
  };

  const handleAdjust = () => {
    onResponse({
      acao: 'AJUSTAR',
      aprovado: false,
      feedback: 'Usuário solicitou ajustes'
    });
  };

  const handleCancel = () => {
    onResponse({
      acao: 'CANCELAR',
      aprovado: false
    });
  };

  return (
    <div className="authorization-overlay">
      <div className="authorization-dialog">
        <div className="dialog-header">
          <h2>{resumo.titulo}</h2>
          <p>{resumo.descricao}</p>
        </div>

        <div className="dialog-body">
          <div className="workflow-summary">
            <h3>📋 Plano de Execução:</h3>
            <ul>
              {resumo.etapas?.map((etapa, i) => (
                <li key={i}>
                  <strong>Etapa {etapa.ordem}:</strong> {etapa.acao}
                  <span className="time-estimate">~{Math.round(etapa.tempo / 60)}min</span>
                </li>
              ))}
            </ul>
          </div>

          {resumo.avisoConteudo && (
            <div className="content-warning">
              <AlertTriangle size={24} />
              <div>
                <h4>{resumo.avisoConteudo.titulo}</h4>
                <p>Algumas ações alteram o conteúdo do seu trabalho:</p>
                <ul>
                  {resumo.avisoConteudo.acoes.map((acao, i) => (
                    <li key={i}>
                      <input
                        type="checkbox"
                        checked={selected.includes(acao.acao)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected([...selected, acao.acao]);
                          } else {
                            setSelected(selected.filter(a => a !== acao.acao));
                          }
                        }}
                      />
                      <span>{acao.descricao}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="time-estimate-total">
            <strong>⏱️ Tempo estimado:</strong> {resumo.tempo}
          </div>
        </div>

        <div className="dialog-actions">
          <button onClick={handleCancel} className="btn-cancel">
            <XCircle size={18} />
            Cancelar
          </button>
          <button onClick={handleAdjust} className="btn-adjust">
            🔧 Ajustar
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