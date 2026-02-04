// src/hooks/useSubscription.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../auth/AuthProvider.jsx";

/**
 * Hook para verificar status de assinatura do usuário
 * Retorna: { hasSubscription, loading, subscription }
 */
export function useSubscription() {
  const { user } = useAuth();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user?.email) {
        setHasSubscription(false);
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Buscar assinatura ativa no Supabase
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("email", user.email)
          .eq("status", "active")
          .order("current_period_end", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Erro ao verificar assinatura:", error);
          setHasSubscription(false);
          setSubscription(null);
          return;
        }

        // Verificar se a assinatura está válida
        if (data) {
          const periodEnd = data.current_period_end ? new Date(data.current_period_end) : null;
          const isValid = !periodEnd || periodEnd > new Date();

          setHasSubscription(isValid);
          setSubscription(data);
        } else {
          setHasSubscription(false);
          setSubscription(null);
        }
      } catch (err) {
        console.error("Erro ao verificar assinatura:", err);
        setHasSubscription(false);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user?.email]);

  return { hasSubscription, loading, subscription };
}