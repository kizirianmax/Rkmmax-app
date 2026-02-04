// src/components/betinho/BetinhoProgress.jsx
import React from 'react';
import { CheckCircle, Circle, Loader } from 'lucide-react';

export default function BetinhoProgress({ progress }) {
  if (!progress) return null;

  const percentage = Math.round((progress.etapa / progress.total) * 100);

  return (
    <div className="betinho-progress-container">
      <div className="progress-header">
        <h3>⚙️ Executando Workflow</h3>
        <span className="progress-percentage">{percentage}%</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>

      <div className="progress-current">
        <Loader size={16} className="spinning" />
        <span>{progress.acao}</span>
      </div>

      <div className="progress-details">
        <small>Etapa {progress.etapa} de {progress.total}</small>
      </div>
    </div>
  );
}