import { useEffect } from "react";
import { BRAND } from "../config/brand";

/**
 * Atualiza o título da aba quando a Home carrega.
 * Ex.: "RKMMAX Infinity | Matrix/Study — Projetos de estudo com fontes verificadas"
 */
export default function BrandTitle() {
  useEffect(() => {
    const old = document.title;
    document.title = `${BRAND.lockup} — Projetos de estudo com fontes verificadas`;
    return () => {
      document.title = old;
    };
  }, []);

  return null;
}
