// src/pages/Signup.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import "../App.css";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("✅ Cadastro realizado:", data);
      setMessage("Conta criada! Verifique seu email para confirmar.");
      // Opcional: já redirecionar após signup
      // navigate("/plans");
    }
  };

  return (
    <div className="signup-container">
      <h2>Criar Conta</h2>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}

export default Signup;
