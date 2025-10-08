// src/hooks/usePlan.js
import { useEffect, useState } from "react";

/**
 * Retorna { plan, loading }.
 * Lê o plano via /.netlify/functions/me-plan usando o email do localStorage.
 * Se não houver email ou houver erro, assume "basic".
 */
export default function usePlan() {
  const [plan, setPlan] = useState("basic");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proteção p/ SSR/tests
    if (typeof window === "undefined") {
      setPlan("basic");
      setLoading(false);
      return;
    }

    const load = async () => {
      const email = window.localStorage.getItem("user_email");
      if (!email) {
        setPlan("basic");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/.netlify/functions/me-plan", {
          method: "GET",
          headers: { "x-user-email": email },
        });

        if (!res.ok) {
          // 401/403/500 etc
          setPlan("basic");
          return;
        }

        const j = await res.json().catch(() => ({}));
        setPlan(j.plan || "basic");
      } catch (err) {
        console.error("usePlan fetch error:", err);
        setPlan("basic");
      } finally {
        setLoading(false);
      }
    };

    load();

    // Atualiza se o email mudar em outra aba/janela
    const onStorage = (e) => {
      if (e.key === "user_email") {
        setLoading(true);
        load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { plan, loading };
}
