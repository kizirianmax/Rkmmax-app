import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BRAND } from "../config/brand";

export default function Header() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const handler = (e) => setIsSmall(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    setIsSmall(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const brandText = isSmall ? BRAND.shortLockup : BRAND.lockup;

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
      <Link
        to="/"
        style={{
          fontWeight: 800,
          textDecoration: "none",
          color: "#111",
          whiteSpace: "nowrap", // evita quebra
        }}
        aria-label={BRAND.lockup}
        title={BRAND.lockup}
      >
        {brandText}
      </Link>

      <nav style={{ display: "flex", gap: 12 }}>
        <NavLink to="/agents">Agentes</NavLink>
        <NavLink to="/pricing">Planos</NavLink>
      </nav>
    </header>
  );
}
