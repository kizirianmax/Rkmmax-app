// src/components/betinho/BetinhoProgress.jsx
import React from 'react';
import { Loader, CheckCircle } from 'lucide-react';
import './BetinhoUI.css';

export default function BetinhoProgress({ progress }) {
  if (!progress) return null;

  const { etapa, total, acao } = progress;
  const percentual = Math.round((etapa / total) * 100);

  return (
    <div className="betinho-progress-container">
      <div className="progress-header">
        <Loader size={20} className="spinning" />
        <h3>Executando automação...</h3>
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span style={{ fontWeight: 600, color: '#667eea' }}>
          {percentual}%
        </span>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#64748b' }}>
        <strong>Etapa {etapa} de {total}:</strong> {acao}
      </div>

      {/* Timeline visual */}
      <div className="progress-timeline">
        {Array.from({ length: total }, (_, i) => (
          <div 
            key={i}
            className={`timeline-step ${i < etapa ? 'completed' : i === etapa - 1 ? 'active' : ''}`}
          >
            {i < etapa ? (
              <CheckCircle size={18} />
            ) : (
              <div style={{ 
                width: 18, 
                height: 18, 
                borderRadius: '50%', 
                border: '2px solid currentColor',
                opacity: i === etapa - 1 ? 1 : 0.3
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}