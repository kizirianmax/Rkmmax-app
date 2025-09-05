// src/pages/Logout.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await supabase.auth.signOut();
      navigate("/login"); // redireciona pro login depois de sair
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <p>Saindo da conta...</p>
    </div>
  );
}

export default Logout;
