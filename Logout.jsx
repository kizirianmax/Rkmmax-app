// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Erro ao fazer logout:", err?.message || err);
      } finally {
        // Leva o usuário para a tela de login após sair
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="container">
      <p>Saindo...</p>
    </div>
  );
}
