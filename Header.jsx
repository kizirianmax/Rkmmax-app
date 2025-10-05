import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BRAND } from "../config/brand";

export default function Header() {
  // Mostra nome curto em telas pequenas (sem Tailwind)
  const [isSmall, setIsSmall] = useState(
    window.matchMedia("(max-width: 480px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const handler = (e) => setIsSmall(e.matches);
    // compatibilidade com browsers diferentes
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const navStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#111" : "#333",
    fontWeight: isActive ? 700 : 500,
    padding: "6px 8px",
    borderRadius: 8,
    background: isActive ? "#f2f2f2" : "transparent",
  });

  return (
    <header
      style={{
        padding: "10px 16px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link to="/" style={{ fontWeight: 800, textDecoration: "none", color: "#111" }}>
        {isSmall ? BRAND.shortLockup : BRAND.lockup}
      </Link>

      <nav style={{ display: "flex", gap: 12 }}>
        <NavLink to="/agents" style={navStyle}>Agentes</NavLink>
        <NavLink to="/pricing" style={navStyle}>Planos</NavLink>
      </nav>
    </header>
  );
}
