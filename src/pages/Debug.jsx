// src/pages/Debug.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import usePlan from "../hooks/usePlan";

export default function Debug() {
  const { plan, loading } = usePlan();
  const [email, setEmail] = useState(
    typeof window !== "undefined" ? localStorage.getItem("user_email") || "" : ""
  );
  const [resp, setResp] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("user_email") || "");
    }
  }, []);

  const saveEmail = (value) => {
    if (typeof window === "undefined") return;
    const v = value.trim().toLowerCase();
    setEmail(v);
    if (v) localStorage.setItem("user_email", v);
    else localStorage.removeItem("user_email");
  };

  const callApi = async () => {
    try {
      setBusy(true);
      setResp(null);
      const res = await fetch(`/api/me-plan?email=${encodeURIComponent(email)}`, {
        headers: { "x-user-email": email },
      });
      const text = await res.text();
      let body;
      try { body = JSON.parse(text); } catch { body = { raw: text }; }
      setResp({ ok: res.ok, status: res.status, body });
    } catch (err) {
      setResp({ ok: false, error: String(err) });
    } finally {
      setBusy(false);
    }
  };

  const setPremium = () => saveEmail("premium@exemplo.com");
  const clearEmail = () => saveEmail("");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Debug</h1>
      <p style={{ color: "#475569" }}>
        Ferramentas para testar <code>/api/me-plan</code> e o fluxo Basic/Premium. (Pode apagar depois.)
      </p>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20 }}>Estado atual</h2>
        <p><strong>plan:</strong> {loading ? "carregando…" : plan}</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20 }}>E-mail no localStorage</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
            placeholder="seu-email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => saveEmail(email)} style={btn()}>Salvar</button>
          <button onClick={clearEmail} style={btn()}>Limpar</button>
          <button onClick={setPremium} style={btn()}>Usar premium@exemplo.com</button>
        </div>
        <small style={{ color: "#64748b" }}>
          Ao mudar o e-mail, o <code>usePlan</code> recalcula sozinho.
        </small>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20 }}>/api/me-plan</h2>
        <button onClick={callApi} disabled={busy} style={btn()}>
          {busy ? "Chamando…" : "Testar API"}
        </button>
        {resp && (
          <pre style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginTop: 12 }}>
            {JSON.stringify(resp, null, 2)}
          </pre>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20 }}>Crash / ErrorBoundary</h2>
        <p>
          Para simular um crash, acesse{" "}
          <a href={`${origin}/?crash=1`}>{origin}/?crash=1</a> (precisa do <code>CrashSwitch</code> montado).
        </p>
        <p>
          Para ver detalhes, abra com <a href={`${origin}/?debug=1`}>?debug=1</a>.
        </p>
      </section>

      <p style={{ marginTop: 32 }}>
        <Link to="/">← Voltar</Link>
      </p>
    </div>
  );
}

function btn() {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#e2e8f0",
    cursor: "pointer",
    fontWeight: 600,
  };
}
