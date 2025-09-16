import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./styles.css";

/* Páginas (ajuste caminhos se necessário) */
import Home from "./pages/Home.jsx";
import Agents from "./pages/Agents.jsx";
import AppInfo from "./pages/AppInfo.jsx";
import PlansScreen from "./pages/PlansScreen.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Logout from "./pages/Logout.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

/* Componente utilitário para link com classe ativa */
const LinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "navlink" + (isActive ? " navlink--active" : "")
    }
    aria-current={({ isActive }) => (isActive ? "page" : undefined)}
  >
    {children}
  </NavLink>
);

/* Header fixo com nav responsiva */
const Header = () => {
  return (
    <header className="shell header">
      <div className="header__inner">
        <NavLink to="/" className="brand" aria-label="Ir para RKMMAX (início)">
          RKMMAX
        </NavLink>

        <nav className="nav" aria-label="Navegação principal">
          <LinkItem to="/agents">Agentes</LinkItem>
          <LinkItem to="/info">Info</LinkItem>
          <LinkItem to="/planos">Planos</LinkItem>
        </nav>

        <div className="header__actions">
          <NavLink to="/login" className="ghost-btn">
            Entrar
          </NavLink>
          <NavLink to="/signup" className="cta-btn">
            Criar conta
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Header />
        {/* Espaço para não ficar oculto atrás do header fixo */}
        <div style={{ height: "72px" }} aria-hidden="true" />
        <main className="shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/info" element={<AppInfo />} />
            <Route path="/planos" element={<PlansScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
