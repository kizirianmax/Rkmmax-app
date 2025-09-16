import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./styles.css";

// Páginas (ajuste os caminhos se seu projeto for diferente)
import Home from "./pages/Home.jsx";
import Agents from "./pages/Agents.jsx";
import AppInfo from "./pages/AppInfo.jsx";
import PlansScreen from "./pages/PlansScreen.jsx";
import Pricing from "./pages/Pricing.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Logout from "./pages/Logout.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

function NavBar() {
  const active = ({ isActive }) => (isActive ? "tab tab--active" : "tab");
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "saturate(120%) blur(6px)",
        background: "rgba(14,18,32,.7)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <nav
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          gap: 8,
          padding: "12px 16px",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <NavLink to="/" className={active} end>
          RKMMAX
        </NavLink>
        <NavLink to="/agents" className={active}>
          Agentes
        </NavLink>
        <NavLink to="/info" className={active}>
          Info
        </NavLink>
        <NavLink to="/plans" className={active}>
          Planos
        </NavLink>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <NavLink to="/login" className={active}>
            Entrar
          </NavLink>
          <NavLink to="/signup" className="btn">
            Criar conta
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        maxWidth: 1120,
        margin: "32px auto",
        padding: "24px 16px",
        color: "var(--muted)",
        borderTop: "1px solid var(--card-border)",
      }}
    >
      <small>
        © {new Date().getFullYear()} RKMMAX — todos os direitos reservados.
      </small>
    </footer>
  );
}

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <NavBar />
          <main style={{ maxWidth: 1120, margin: "24px auto", padding: "0 16px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/info" element={<AppInfo />} />

              {/* Duas rotas para a página de planos (use a que preferir) */}
              <Route path="/plans" element={<PlansScreen />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Fluxo de autenticação/assinatura */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/subscribe" element={<Subscribe />} />

              {/* Fallback opcional: você pode adicionar uma 404 page aqui */}
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
