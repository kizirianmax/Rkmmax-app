// src/components/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { BRAND } from "../config/brand";

export default function Header() {
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
        style={{ fontWeight: 800, textDecoration: "none", color: "#111" }}
      >
        <span className="hidden sm:inline">{BRAND.lockup}</span>
        <span className="sm:hidden">{BRAND.shortLockup}</span>
      </Link>

      <nav style={{ display: "flex", gap: 12 }}>
        <NavLink to="/agents">Agentes</NavLink>
        <NavLink to="/plans">Planos</NavLink>
      </nav>
    </header>
  );
}
