// src/hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkSubscription();
  }, []);

  async function checkSubscription() {
    try {
      setLoading(true);
      
      // 1. Pegar usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      // 2. Buscar assinatura ativa no Supabase
      const { data, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'active')
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) throw subError;

      setSubscription(data);
      setLoading(false);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  return {
    subscription,
    hasActiveSubscription: !!subscription,
    loading,
    error,
    refresh: checkSubscription
  };
}