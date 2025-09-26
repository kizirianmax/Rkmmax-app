import { useEffect, useState } from "react";

/**
 * Lê o plano via /.netlify/functions/me-plan.
 * Por enquanto usa localStorage.getItem("user_email") como fonte do email.
 * Se não tiver email, assume "basic".
 */
export default function usePlan() {
  const [plan, setPlan] = useState("basic");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (!email) {
      setPlan("basic");
      setLoading(false);
      return;
    }

    fetch("/.netlify/functions/me-plan", {
      headers: { "x-user-email": email }
    })
      .then((r) => r.json())
      .then((j) => setPlan(j.plan || "basic"))
      .catch(() => setPlan("basic"))
      .finally(() => setLoading(false));
  }, []);

  return { plan, loading };
}
