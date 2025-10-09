// src/components/CrashSwitch.jsx
import React from "react";

export default function CrashSwitch() {
  if (typeof window !== "undefined") {
    const p = new URLSearchParams(window.location.search);
    if (p.get("crash") === "1") {
      throw new Error("Crash test acionado via ?crash=1");
    }
  }
  return null;
}
