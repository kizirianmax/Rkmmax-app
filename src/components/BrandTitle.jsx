// src/components/BrandTitle.jsx
import { useEffect } from "react";
import { BRAND } from "../config/brand";

export default function BrandTitle() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const old = document.title;

    // Monta lockup + claim; se faltar algo, usa shortLockup ou um default
    const parts = [];
    if (BRAND?.lockup) parts.push(BRAND.lockup);
    if (BRAND?.claim) parts.push(BRAND.claim);

    const next = parts.join(" — ") || BRAND?.shortLockup || "RKMMAX";

    document.title = next;

    // Restaura ao desmontar
    return () => {
      document.title = old;
    };
  }, []);

  return null;
}
