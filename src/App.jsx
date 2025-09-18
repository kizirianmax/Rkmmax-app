import React, { useEffect, useState } from "react";

// Se seus arquivos estiverem em /pages, ajuste os caminhos:
import Home from "./pages/Home.jsx";
import Agents from "./pages/Agents.jsx";
import Plans from "./pages/Plans.jsx";

const routes = {
  "/": <Home />,
  "/agents": <Agents />,
  "/plans": <Plans />
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className="topbar">
        <a onClick={() => navigate("/")}>Início</a>
        <a onClick={() => navigate("/agents")}>Agentes</a>
        <a onClick={() => navigate("/plans")}>Planos</a>
      </nav>

      <main className="container">
        {routes[path] ?? <Home />}
      </main>

      <footer className="footer">© 2025 RKMMAX</footer>
    </>
  );
}
