/**
 * AUTOMATION DASHBOARD
 * Interface web para gerenciar automações
 * Mostra: Histórico, Estatísticas, Controles, Configurações
 * Enhanced with AutomationStatus visualization component
 */

import React, { useState, useEffect } from 'react';
import { Loader2, Send, Mic, Image as ImageIcon, AlertCircle, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import AutomationStatus from '../components/tools/AutomationStatus';
import './AutomationDashboard.css';

export default function AutomationDashboard() {
  const [command, setCommand] = useState('');
  const [selectedMode, setSelectedMode] = useState('OPTIMIZED');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [automations, setAutomations] = useState([]);
  const [stats, setStats] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [userPlan, setUserPlan] = useState('basic');
  const [dailyUsage, setDailyUsage] = useState({
    automations: 0,
    aiRequests: 0,
    totalCredits: 0,
  });
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('execute');
  
  // NEW: Automation status tracking
  const [automationStatus, setAutomationStatus] = useState({
    steps: [],
    currentStep: 'analysis',
    status: 'pending',
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadSpecialists();
    loadAutomationHistory();
    loadStats();
  }, []);

  /**
   * Carregar lista de especialistas
   */
  const loadSpecialists = async () => {
    try {
      const response = await fetch('/api/automation?action=specialists');
      const data = await response.json();
      setSpecialists(data.specialists || []);
    } catch (error) {
      console.error('Erro ao carregar especialistas:', error);
    }
  };

  /**
   * Carregar histórico de automações
   */
  const loadAutomationHistory = async () => {
    try {
      const response = await fetch(`/api/automation?action=history&userId=user123&limit=10`);
      const data = await response.json();
      setAutomations(data.automations || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  /**
   * Carregar estatísticas
   */
  const loadStats = async () => {
    try {
      const response = await fetch(`/api/automation?action=stats&userId=user123`);
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  /**
   * Executar automação
   */
  const handleExecuteAutomation = async () => {
    if (!command.trim()) {
      alert('Digite um comando');
      return;
    }

    setIsLoading(true);
    setAutomationStatus({
      steps: [],
      currentStep: 'analysis',
      status: 'running',
    });

    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          userId: 'user123',
          username: 'User',
          command,
          mode: selectedMode,
          selectedSpecialist: selectedSpecialist || undefined,
          description: command,
          creditsUsed: selectedMode === 'OPTIMIZED' ? 5 : selectedMode === 'HYBRID' ? 3 : 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update automation status with results
        setAutomationStatus({
          steps: data.result?.steps || [],
          currentStep: 'execution',
          status: 'success',
        });
        
        setCommand('');
        setSelectedSpecialist('');
        loadAutomationHistory();
        loadStats();
        
        setTimeout(() => {
          alert('✅ Automação executada com sucesso!');
        }, 500);
      } else {
        setAutomationStatus({
          steps: data.result?.steps || [],
          currentStep: 'validation',
          status: data.result?.status === 'BLOCKED' ? 'blocked' : 'failed',
        });
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao executar automação:', error);
      setAutomationStatus({
        steps: [],
        currentStep: 'analysis',
        status: 'failed',
      });
      alert('Erro ao executar automação');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Iniciar gravação de áudio
   */
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const reader = new FileReader();

        reader.onload = async (e) => {
          const audioBase64 = e.target.result.split(',')[1];

          // Processar áudio
          const response = await fetch('/api/multimodal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'process-audio',
              audio: audioBase64,
              format: 'mp3',
            }),
          });

          const data = await response.json();
          if (data.success) {
            setCommand(data.result.transcript);
          }
        };

        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setRecordingAudio(true);

      // Parar após 30 segundos
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setRecordingAudio(false);
      }, 30000);
    } catch (error) {
      console.error('Erro ao gravar áudio:', error);
      alert('Erro ao acessar microfone');
    }
  };

  /**
   * Processar imagem selecionada
   */
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const imageBase64 = event.target.result.split(',')[1];

      // Processar imagem
      const response = await fetch('/api/multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'detect-code',
          image: imageBase64,
          format: file.type.split('/')[1],
        }),
      });

      const data = await response.json();
      if (data.success && data.result.code) {
        setCommand(data.result.code);
        setSelectedImage(file.name);
      }
    };

    reader.readAsDataURL(file);
  };

  /**
   * Obter cor de status
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'BLOCKED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Obter ícone de status
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4" />;
      case 'BLOCKED':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="automation-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">🤖 RKMMAX Automação</h1>
          <p className="dashboard-subtitle">Sistema Inteligente de Automação de Repositório</p>
        </div>

        {/* Tabs */}
        <div className="tabs-wrapper">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'execute' ? 'active' : ''}`}
              onClick={() => setActiveTab('execute')}
            >
              Executar
            </button>
            <button 
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Histórico
            </button>
            <button 
              className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Estatísticas
            </button>
          </div>

          {/* TAB: Executar Automação */}
          {activeTab === 'execute' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Novo Comando</h2>
                  <p className="card-description">
                    Digite um comando ou use voz/imagem para automatizar
                  </p>
                </div>
                <div className="card-content">
                  {/* Aviso de limite */}
                  {dailyUsage.automations >= 5 && (
                    <div className="alert warning">
                      <AlertCircle className="alert-icon" />
                      <p className="alert-text">
                        Você atingiu o limite diário de automações para seu plano.
                      </p>
                    </div>
                  )}

                  {/* Input de comando */}
                  <div className="form-group">
                    <label className="form-label">Comando</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Ex: RKM, cria um componente de login com validação..."
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      rows={6}
                    />
                  </div>

                  {/* Botões de entrada multimodal */}
                  <div className="button-group">
                    <button
                      className="btn btn-secondary"
                      onClick={handleStartRecording}
                      disabled={recordingAudio || isLoading}
                    >
                      <Mic className="btn-icon" />
                      {recordingAudio ? 'Gravando...' : 'Voz'}
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => document.getElementById('imageInput')?.click()}
                      disabled={isLoading}
                    >
                      <ImageIcon className="btn-icon" />
                      Imagem
                    </button>

                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden-input"
                    />

                    {selectedImage && (
                      <span className="badge success">{selectedImage}</span>
                    )}
                  </div>

                  {/* Seleção de modo */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Modo</label>
                      <select
                        className="form-select"
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                      >
                        <option value="MANUAL">Manual (1 crédito)</option>
                        <option value="HYBRID">Híbrido (3 créditos)</option>
                        <option value="OPTIMIZED">Otimizado (5 créditos)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Especialista (opcional)</label>
                      <select
                        className="form-select"
                        value={selectedSpecialist}
                        onChange={(e) => setSelectedSpecialist(e.target.value)}
                      >
                        <option value="">Automático</option>
                        {specialists.map((spec) => (
                          <option key={spec.name} value={spec.name}>
                            {spec.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Botão de execução */}
                  <button
                    className="btn btn-primary btn-full"
                    onClick={handleExecuteAutomation}
                    disabled={isLoading || !command.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="btn-icon animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Send className="btn-icon" />
                        Executar Automação
                      </>
                    )}
                  </button>

                  {/* Automation Status Visualization */}
                  {(isLoading || automationStatus.status !== 'pending') && (
                    <div className="status-section">
                      <AutomationStatus
                        steps={automationStatus.steps}
                        currentStep={automationStatus.currentStep}
                        status={automationStatus.status}
                        embedded={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Histórico */}
          {activeTab === 'history' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Histórico de Automações</h2>
                  <p className="card-description">
                    Últimas automações executadas
                  </p>
                </div>
                <div className="card-content">
                  {automations.length === 0 ? (
                    <p className="empty-state">Nenhuma automação executada ainda</p>
                  ) : (
                    <div className="history-list">
                      {automations.map((auto) => (
                        <div key={auto.id} className="history-item">
                          <div className="history-header">
                            <div className="history-info">
                              <p className="history-command">{auto.command}</p>
                              <p className="history-timestamp">
                                {new Date(auto.timestamp).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <span className={`badge ${auto.status.toLowerCase()}`}>
                              {getStatusIcon(auto.status)}
                              <span className="badge-text">{auto.status}</span>
                            </span>
                          </div>
                          {auto.selectedSpecialist && (
                            <p className="history-specialist">
                              Especialista: <strong>{auto.selectedSpecialist}</strong>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Estatísticas */}
          {activeTab === 'stats' && (
            <div className="tab-content">
              {stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3 className="stat-title">Total de Automações</h3>
                    <p className="stat-value purple">{stats.totalAutomations}</p>
                  </div>

                  <div className="stat-card">
                    <h3 className="stat-title">Taxa de Sucesso</h3>
                    <p className="stat-value green">
                      {stats.totalAutomations > 0
                        ? Math.round((stats.successfulAutomations / stats.totalAutomations) * 100)
                        : 0}
                      %
                    </p>
                  </div>

                  <div className="stat-card">
                    <h3 className="stat-title">Automações Bem-Sucedidas</h3>
                    <p className="stat-value green">{stats.successfulAutomations}</p>
                  </div>

                  <div className="stat-card">
                    <h3 className="stat-title">Automações Falhadas</h3>
                    <p className="stat-value red">{stats.failedAutomations}</p>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-content">
                    <p className="empty-state">Carregando estatísticas...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
