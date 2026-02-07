// src/components/betinho/BetinhoProgress.jsx
import React from 'react';
import { Loader } from 'lucide-react';
import './BetinhoUI.css';

export default function BetinhoProgress({ progress }) {
  const { etapa, total, acao } = progress;
  const percentage = Math.round((etapa / total) * 100);

  return (
    <div className="betinho-progress-container">
      <div className="progress-header">
        <Loader size={18} className="spinning" />
        <span><strong>Executando...</strong></span>
      </div>

      <div className="progress-info">
        <span>Etapa {etapa} de {total}</span>
        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{acao}</span>
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{percentage}%</span>
      </div>

      {total > 1 && (
        <div className="progress-timeline">
          {Array.from({ length: total }, (_, i) => (
            <div 
              key={i}
              className={`timeline-step ${
                i < etapa ? 'completed' : i === etapa - 1 ? 'active' : ''
              }`}
            >
              {i < etapa ? '✓' : i === etapa - 1 ? '⏳' : '○'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}