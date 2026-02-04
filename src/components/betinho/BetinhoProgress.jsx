// src/components/betinho/BetinhoProgress.jsx
import React from 'react';
import { CheckCircle, Circle, Loader } from 'lucide-react';

export default function BetinhoProgress({ progress }) {
  if (!progress) return null;

  const { etapa, total, acao } = progress;
  const percentage = Math.round((etapa / total) * 100);

  return (
    <div className="betinho-progress-container">
      <div className="progress-header">
        <Loader className="spinning" size={20} />
        <span className="progress-title">Executando tarefa...</span>
      </div>
      
      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="progress-percentage">{percentage}%</span>
      </div>

      <div className="progress-steps">
        <div className="current-step">
          <strong>Etapa {etapa} de {total}:</strong>
          <span>{acao}</span>
        </div>
      </div>

      <div className="progress-timeline">
        {Array.from({ length: total }, (_, i) => (
          <div 
            key={i} 
            className={`timeline-step ${i < etapa ? 'completed' : i === etapa - 1 ? 'active' : ''}`}
          >
            {i < etapa ? (
              <CheckCircle size={16} />
            ) : i === etapa - 1 ? (
              <Loader size={16} className="spinning" />
            ) : (
              <Circle size={16} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}