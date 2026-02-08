// src/pages/OwnerDashboard.jsx
import React from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import { useOwnerAccess } from "../hooks/useOwnerAccess.js";
import UserSimulator from "../components/UserSimulator.jsx";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { isOwner, accessConfig } = useOwnerAccess();

  if (!isOwner) {
    return (
      <div className="container" style={{ padding: 20 }}>
        <h1>Acesso Negado</h1>
        <p>Apenas o dono pode acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <div className="owner-dashboard-header">
        <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>👑</span>
          <span>Dashboard do Dono</span>
        </h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          Bem-vindo, {user?.email} - Você tem acesso total ao sistema
        </p>
      </div>

      {/* Status Cards */}
      <div className="owner-stats-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: 20, 
        marginTop: 30 
      }}>
        <div className="stat-card agent-card">
          <h3>🔓 Acesso</h3>
          <p className="stat-value">ILIMITADO</p>
          <p className="stat-label">Todos os 54 especialistas</p>
        </div>

        <div className="stat-card agent-card">
          <h3>💬 Mensagens</h3>
          <p className="stat-value">∞</p>
          <p className="stat-label">Sem limite de uso</p>
        </div>

        <div className="stat-card agent-card">
          <h3>💰 Custo</h3>
          <p className="stat-value">R$ 0,00</p>
          <p className="stat-label">Gratuito total</p>
        </div>

        <div className="stat-card agent-card">
          <h3>🚀 Status</h3>
          <p className="stat-value">ATIVO</p>
          <p className="stat-label">Debug mode ON</p>
        </div>
      </div>

      {/* Configurações do Owner */}
      <div className="owner-config agent-card" style={{ marginTop: 30 }}>
        <h2>⚙️ Configurações Ativas</h2>
        <div style={{ marginTop: 16 }}>
          <div className="config-item" style={{ marginBottom: 8 }}>
            ✅ Bypass de Rate Limits: <strong>Ativo</strong>
          </div>
          <div className="config-item" style={{ marginBottom: 8 }}>
            ✅ Bypass de Paywall: <strong>Ativo</strong>
          </div>
          <div className="config-item" style={{ marginBottom: 8 }}>
            ✅ Acesso a todos os planos: <strong>Ativo</strong>
          </div>
          <div className="config-item" style={{ marginBottom: 8 }}>
            ✅ Modo Debug: <strong>Ativo</strong>
          </div>
          <div className="config-item" style={{ marginBottom: 8 }}>
            ✅ Simulador de Usuários: <strong>Disponível</strong>
          </div>
        </div>
      </div>

      {/* Simulador de Usuário */}
      <div className="agent-card" style={{ marginTop: 30 }}>
        <UserSimulator />
      </div>

      {/* Ações Rápidas */}
      <div className="owner-actions agent-card" style={{ marginTop: 30 }}>
        <h2>⚡ Ações Rápidas</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: 12, 
          marginTop: 16 
        }}>
          <button 
            className="btn-chat"
            onClick={() => window.location.href = "/user-management"}
          >
            👥 Gerenciar Usuários
          </button>
          <button 
            className="btn-chat"
            onClick={() => window.location.href = "/change-password"}
          >
            🔑 Trocar Senha
          </button>
          <button 
            className="btn-chat"
            onClick={() => window.location.href = "/specialists"}
          >
            🤖 Ver Especialistas
          </button>
          <button 
            className="btn-chat"
            onClick={() => console.log("Owner access config:", accessConfig)}
          >
            🔍 Ver Logs
          </button>
        </div>
      </div>

      {/* Informações do Usuário */}
      <div className="agent-card" style={{ marginTop: 30 }}>
        <h2>👤 Informações do Usuário</h2>
        <pre style={{ 
          background: "#0b1626", 
          padding: 16, 
          borderRadius: 8, 
          overflow: "auto",
          marginTop: 12,
          fontSize: "0.85rem"
        }}>
          {JSON.stringify({
            email: user?.email,
            id: user?.id,
            role: "OWNER",
            accessConfig: accessConfig
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
