// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Erro ao sair:", error.message);
      } finally {
        navigate("/login", { replace: true });
      }
    };
    doLogout();
  }, [navigate]);

  return (
    <div className="container">
      <h1>Saindo...</h1>
      <p>Você será redirecionado em instantes.</p>
    </div>
  );
}
