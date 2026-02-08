// src/components/UserSimulator.jsx
import React, { useState } from "react";
import { useOwnerAccess } from "../hooks/useOwnerAccess.js";

export default function UserSimulator() {
  const { isOwner, canSimulateUsers } = useOwnerAccess();
  const [simulatedRole, setSimulatedRole] = useState("OWNER");

  if (!isOwner || !canSimulateUsers) return null;

  return (
    <div className="user-simulator">
      <h3>🎭 Simulador de Usuário</h3>
      <p style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: 12 }}>
        Simule a experiência de diferentes tipos de usuários
      </p>
      
      <select
        value={simulatedRole}
        onChange={(e) => setSimulatedRole(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid rgba(118,161,220,.2)",
          background: "#0b1626",
          color: "white",
          marginBottom: 12,
        }}
      >
        <option value="OWNER">👑 Modo Dono (Atual)</option>
        <option value="BASIC">🟢 Usuário Básico (10 msg/dia)</option>
        <option value="PREMIUM">⭐ Usuário Premium (100 msg/dia)</option>
        <option value="ADMIN">🔧 Administrador</option>
      </select>

      {simulatedRole !== "OWNER" && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(234, 179, 8, 0.1)",
            border: "1px solid rgba(234, 179, 8, 0.3)",
            color: "#eab308",
          }}
        >
          ⚠️ Simulando experiência de {simulatedRole}
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: "0.85rem", opacity: 0.7 }}>
        <p><strong>Limites Simulados:</strong></p>
        <ul style={{ marginLeft: 20, marginTop: 8 }}>
          {simulatedRole === "BASIC" && (
            <>
              <li>Apenas Serginho disponível</li>
              <li>10 mensagens por dia</li>
              <li>Paywall ativo</li>
            </>
          )}
          {simulatedRole === "PREMIUM" && (
            <>
              <li>Todos os 54 especialistas</li>
              <li>100 mensagens por dia</li>
              <li>Sem paywall</li>
            </>
          )}
          {simulatedRole === "ADMIN" && (
            <>
              <li>Todos os especialistas</li>
              <li>1000 mensagens por dia</li>
              <li>Painel de gerenciamento</li>
            </>
          )}
          {simulatedRole === "OWNER" && (
            <>
              <li>Acesso ilimitado ∞</li>
              <li>Todos os especialistas</li>
              <li>Sem custos (R$ 0,00)</li>
              <li>Modo debug ativo</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
