import { useEffect, useState } from "react";

export default function usePlan() {
  const [plan, setPlan] = useState("basic");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const email = window.localStorage.getItem("user_email") || "";
      const headers = email ? { "x-user-email": email } : {};

      try {
        const res = await fetch("/api/me-plan", { method: "GET", headers });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setPlan(data?.plan || "basic");
      } catch (e) {
        if (!cancelled) setPlan("basic");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    const onStorage = (e) => {
      if (e.key === "user_email") {
        setLoading(true);
        load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { plan, loading };
}
