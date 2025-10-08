// src/components/BrandTitle.jsx
import { useEffect } from "react";
import { BRAND } from "../config/brand";

export default function BrandTitle() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const old = document.title;

    // monta o título usando lockup + claim, com fallback
    const parts = [];
    if (BRAND?.lockup) parts.push(BRAND.lockup);
    if (BRAND?.claim) parts.push(BRAND.claim);
    const next =
      parts.join(" — ") || BRAND?.shortLockup || "RKMMAX";

    document.title = next;

    // restaura ao desmontar
    return () => {
      document.title = old;
    };
  }, []);

  return null;
}
