import React from "react";

export default function Login() {
  return (
    <>
      <h1 className="title-hero">Entrar</h1>
      <form
        className="agent-card"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Login (em breve)");
        }}
      >
        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            type="email"
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(118,161,220,.2)",
              background: "#0b1626",
              color: "white",
              marginTop: 6,
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 14 }}>
          Senha
          <input
            type="password"
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(118,161,220,.2)",
              background: "#0b1626",
              color: "white",
              marginTop: 6,
            }}
          />
        </label>

        <button className="btn-chat" type="submit">
          Entrar
        </button>
      </form>
    </>
  );
}
