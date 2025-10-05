import { useEffect } from "react";
import { BRAND } from "../config/brand";

export default function BrandTitle() {
  useEffect(() => {
    const old = document.title;
    document.title = `${BRAND.lockup} — Projetos de estudo com fontes verificadas`;
    return () => { document.title = old; };
  }, []);
  return null;
}
