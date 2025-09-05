// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate("/login");
      } catch (err) {
        console.error("Erro no logout:", err.message);
        alert("Erro ao sair: " + err.message);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg">Saindo da sua conta...</p>
    </div>
  );
}
