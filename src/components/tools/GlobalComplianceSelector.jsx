import React, { useState } from 'react';
import { Globe, Book, Shield, Settings } from 'lucide-react';

const GlobalComplianceSelector = ({ onStandardSelect, currentStandard = 'ABNT' }) => {
  // This would ideally come from the StandardsRegistry, but for UI we mock it or pass it as props
  const standards = [
    { id: 'ABNT', name: 'ABNT (Brasil)', region: '🇧🇷 Brasil', type: 'Academic/Technical', color: '#50fa7b' },
    { id: 'ISO', name: 'ISO (Global)', region: '🌍 Global', type: 'Quality/Process', color: '#8be9fd' },
    { id: 'APA', name: 'APA (Internacional)', region: '🇺🇸 USA/Intl', type: 'Academic (Social Sciences)', color: '#ffb86c' },
    { id: 'IEEE', name: 'IEEE (Tech)', region: '🌍 Global', type: 'Engineering/Tech', color: '#ff79c6' },
    { id: 'Vancouver', name: 'Vancouver', region: '🌍 Global', type: 'Medical/Health', color: '#bd93f9' }
  ];

  const [selected, setSelected] = useState(currentStandard);

  const handleSelect = (id) => {
    setSelected(id);
    if (onStandardSelect) onStandardSelect(id);
  };

  return (
    <div style={{
      background: '#282a36',
      padding: '20px',
      borderRadius: '12px',
      color: '#f8f8f2',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <Globe size={24} color="#bd93f9" />
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Global Standards Selector</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {standards.map((std) => (
          <div
            key={std.id}
            onClick={() => handleSelect(std.id)}
            style={{
              background: selected === std.id ? `${std.color}22` : '#44475a',
              border: `2px solid ${selected === std.id ? std.color : 'transparent'}`,
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{std.id}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{std.region}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#f8f8f2', opacity: 0.9 }}>{std.name}</div>
            <div style={{ fontSize: '0.75rem', marginTop: '6px', color: std.color }}>{std.type}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '12px', background: '#44475a', borderRadius: '8px', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Shield size={16} color="#50fa7b" />
          <strong>Active Configuration:</strong>
        </div>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Applying rules for <strong>{standards.find(s => s.id === selected)?.name}</strong>. 
          Serginho will validate project compliance against these standards automatically.
        </p>
      </div>
    </div>
  );
};

export default GlobalComplianceSelector;