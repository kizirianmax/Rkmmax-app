// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bem-vindo ao RKMMax 🚀</h1>
      <p style={styles.subtitle}>
        Sua plataforma de inteligência artificial modular.
      </p>

      <div style={styles.buttons}>
        <Link to="/login" style={styles.buttonLogin}>
          Entrar
        </Link>
        <Link to="/signup" style={styles.buttonSignup}>
          Criar Conta
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  buttonLogin: {
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
  buttonSignup: {
    padding: "12px 24px",
    backgroundColor: "#2ecc71",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};
