// src/components/betinho/BetinhoProgress.jsx
import React from 'react';
import { Loader } from 'lucide-react';

export default function BetinhoProgress({ progress }) {
  const percentage = (progress.etapa / progress.total) * 100;

  return (
    <div className="betinho-progress-container">
      <div className="progress-info">
        <Loader className="spinning" size={20} />
        <span>
          <strong>Etapa {progress.etapa}/{progress.total}:</strong> {progress.acao}
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-percentage">
        {Math.round(percentage)}% completo
      </div>
    </div>
  );
}