import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // <-- corrigido

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Erro ao sair:", error);
      } finally {
        navigate("/login", { replace: true });
      }
    };
    doLogout();
  }, [navigate]);

  return (
    <div className="container">
      <p>Saindo...</p>
    </div>
  );
}
