// src/components/betinho/BetinhoProgress.jsx
import React from 'react';
import { Loader } from 'lucide-react';

export default function BetinhoProgress({ progress }) {
  const percentage = (progress.etapa / progress.total) * 100;

  return (
    <div className="betinho-progress-container">
      <div className="progress-header">
        <div className="progress-current">
          <Loader className="spinning" size={20} />
          <span>
            <strong>Etapa {progress.etapa} de {progress.total}</strong>
          </span>
        </div>
        <span className="progress-percentage">{Math.round(percentage)}%</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="progress-action">
        {progress.acao}
      </div>
    </div>
  );
}