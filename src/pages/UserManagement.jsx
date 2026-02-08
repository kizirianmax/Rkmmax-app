// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { useOwnerAccess } from "../hooks/useOwnerAccess.js";

export default function UserManagement() {
  const { isOwner } = useOwnerAccess();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // TODO: Buscar usuários do Supabase
    // Dados mockados por enquanto
    const mockUsers = [
      {
        id: "1",
        email: "robertokizirianmax@gmail.com",
        role: "OWNER",
        status: "active",
        created_at: "2026-02-01",
        messages: "∞",
      },
      {
        id: "2",
        email: "usuario1@example.com",
        role: "PREMIUM",
        status: "active",
        created_at: "2026-02-05",
        messages: 45,
      },
      {
        id: "3",
        email: "usuario2@example.com",
        role: "BASIC",
        status: "active",
        created_at: "2026-02-07",
        messages: 8,
      },
    ];

    setUsers(mockUsers);
    setLoading(false);
  }, []);

  if (!isOwner) {
    return (
      <div className="container" style={{ padding: 20 }}>
        <h1>Acesso Negado</h1>
        <p>Apenas o dono pode acessar esta página.</p>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1 className="title-hero">👥 Gerenciamento de Usuários</h1>

      <div className="agent-card" style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Filtrar por Role:
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid rgba(118,161,220,.2)",
                background: "#0b1626",
                color: "white",
                marginTop: 6,
              }}
            >
              <option value="all">Todos</option>
              <option value="OWNER">👑 Owner</option>
              <option value="ADMIN">🔧 Admin</option>
              <option value="PREMIUM">⭐ Premium</option>
              <option value="BASIC">🟢 Básico</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <div className="users-table">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(118,161,220,.2)" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Email</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Role</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Status</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Mensagens</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Criado em</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: "1px solid rgba(118,161,220,.1)" }}
                  >
                    <td style={{ padding: 12 }}>{user.email}</td>
                    <td style={{ padding: 12 }}>
                      {user.role === "OWNER" && "👑 Owner"}
                      {user.role === "ADMIN" && "🔧 Admin"}
                      {user.role === "PREMIUM" && "⭐ Premium"}
                      {user.role === "BASIC" && "🟢 Básico"}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          background:
                            user.status === "active"
                              ? "rgba(34, 197, 94, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                          color:
                            user.status === "active" ? "#22c55e" : "#ef4444",
                          fontSize: "0.85rem",
                        }}
                      >
                        {user.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>{user.messages}</td>
                    <td style={{ padding: 12 }}>
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={{ padding: 12 }}>
                      {user.role !== "OWNER" && (
                        <button
                          className="btn-chat"
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.85rem",
                          }}
                          onClick={() =>
                            alert(`Ver detalhes de ${user.email}`)
                          }
                        >
                          Ver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <p style={{ textAlign: "center", opacity: 0.7, padding: 20 }}>
            Nenhum usuário encontrado com esse filtro.
          </p>
        )}
      </div>

      <div
        className="agent-card"
        style={{
          marginTop: 20,
          background: "rgba(234, 179, 8, 0.1)",
          border: "1px solid rgba(234, 179, 8, 0.3)",
        }}
      >
        <p style={{ color: "#eab308", margin: 0 }}>
          ℹ️ <strong>Nota:</strong> Esta é uma versão inicial do gerenciamento
          de usuários. Funcionalidades completas (editar, desativar, etc.) serão
          implementadas em breve.
        </p>
      </div>
    </div>
  );
}
