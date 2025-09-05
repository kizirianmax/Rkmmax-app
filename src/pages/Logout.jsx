// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await supabase.auth.signOut();
      navigate("/login");
    };
    doLogout();
  }, [navigate]);

  return <p>Saindo...</p>;
}

export default Logout;
