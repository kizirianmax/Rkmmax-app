// src/hooks/usePlan.js
import { useEffect, useState } from "react";

export default function usePlan() {
  const [plan, setPlan] = useState("basic");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setPlan("basic"); setLoading(false); return;
    }

    const load = async () => {
      const email = window.localStorage.getItem("user_email");
      if (!email) { setPlan("basic"); setLoading(false); return; }

      try {
        const res = await fetch("/api/me-plan", {
          headers: { "x-user-email": email },
        });
        const j = await res.json().catch(() => ({}));
        setPlan(j.plan || "basic");
      } catch {
        setPlan("basic");
      } finally {
        setLoading(false);
      }
    };

    load();

    const onStorage = (e) => {
      if (e.key === "user_email") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { plan, loading };
}
