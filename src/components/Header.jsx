import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BRAND } from "../config/brand";

export default function Header() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const onChange = (e) => setIsSmall(e.matches);

    // compat entre browsers
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    setIsSmall(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
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
        gap: 12,
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: 800,
          textDecoration: "none",
          color: "#111",
          whiteSpace: "nowrap",       // não quebrar
          overflow: "hidden",          // se ficar apertado
          textOverflow: "ellipsis",    // usa reticências
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
