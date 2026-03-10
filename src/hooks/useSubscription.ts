import { useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useSubscription() {
  const { profile, session } = useAuth();
  const [loading, setLoading] = useState(false);

  const isPremium = useMemo(() => {
    const tier = (profile as unknown as { subscription_tier?: string } | null)?.subscription_tier;
    return tier === 'premium';
  }, [profile]);

  const openCheckout = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      // MVP: delega a endpoint backend/serverless que crea customer + checkout session.
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, email: session.user.email })
      });
      const payload = await response.json();
      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      // fallback demo: marca premium localmente si no hay backend.
      if (!supabase || session.user.id === 'demo-user') {
        localStorage.setItem('stop_demo_subscription', 'premium');
      }
    } finally {
      setLoading(false);
    }
  };

  return { isPremium, loading, openCheckout };
}
