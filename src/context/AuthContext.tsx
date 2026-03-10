import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import type { AlertPreferences, BetType, ImpulseEntry, RecoveryGoal, UserProfile } from '../types';

interface AuthContextValue {
  session: Session | { user: { id: string; email?: string } } | null;
  profile: UserProfile | null;
  impulseEntries: ImpulseEntry[];
  alertPreferences: AlertPreferences | null;
  goals: RecoveryGoal[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  continueDemo: () => void;
  saveProfile: (payload: Omit<UserProfile, 'id'>) => Promise<string | null>;
  addImpulseEntry: (payload: Omit<ImpulseEntry, 'id' | 'user_id' | 'created_at'> & { created_at?: string }) => Promise<string | null>;
  saveAlertPreferences: (payload: Omit<AlertPreferences, 'id' | 'user_id'>) => Promise<string | null>;
  addGoal: (payload: Omit<RecoveryGoal, 'id' | 'user_id' | 'created_at' | 'current_value'>) => Promise<string | null>;
  updateGoalProgress: (goalId: string, currentValue: number) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_SESSION_KEY = 'stop_demo_session';
const DEMO_PROFILE_KEY = 'stop_demo_profile';
const DEMO_IMPULSES_KEY = 'stop_demo_impulses';
const DEMO_ALERTS_KEY = 'stop_demo_alerts';
const DEMO_GOALS_KEY = 'stop_demo_goals';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthContextValue['session']>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [impulseEntries, setImpulseEntries] = useState<ImpulseEntry[]>([]);
  const [alertPreferences, setAlertPreferences] = useState<AlertPreferences | null>(null);
  const [goals, setGoals] = useState<RecoveryGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      const demoSession = localStorage.getItem(DEMO_SESSION_KEY);
      if (demoSession) {
        setSession(JSON.parse(demoSession));
        setProfile(JSON.parse(localStorage.getItem(DEMO_PROFILE_KEY) ?? 'null'));
        setImpulseEntries(JSON.parse(localStorage.getItem(DEMO_IMPULSES_KEY) ?? '[]'));
        setAlertPreferences(JSON.parse(localStorage.getItem(DEMO_ALERTS_KEY) ?? 'null'));
        setGoals(JSON.parse(localStorage.getItem(DEMO_GOALS_KEY) ?? '[]'));
        setLoading(false);
        return;
      }

      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user.id) await hydrateUserData(data.session.user.id);

      supabase.auth.onAuthStateChange(async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user.id) {
          await hydrateUserData(nextSession.user.id);
        } else {
          setProfile(null);
          setImpulseEntries([]);
          setAlertPreferences(null);
          setGoals([]);
        }
      });

      setLoading(false);
    };

    void boot();
  }, []);

  const hydrateUserData = async (userId: string) => {
    await Promise.all([fetchProfile(userId), fetchImpulseEntries(userId), fetchAlertPreferences(userId), fetchGoals(userId)]);
  };

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
    setProfile(data as UserProfile | null);
  };

  const fetchImpulseEntries = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('impulse_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setImpulseEntries((data ?? []) as ImpulseEntry[]);
  };

  const fetchAlertPreferences = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('alert_preferences').select('*').eq('user_id', userId).single();
    setAlertPreferences((data as AlertPreferences | null) ?? null);
  };

  const fetchGoals = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('recovery_goals').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setGoals((data ?? []) as RecoveryGoal[]);
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return 'Supabase no configurado. Usa modo demo o configura .env.';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };

  const continueDemo = () => {
    const demo = { user: { id: 'demo-user', email: 'demo@stop.app' } };
    setSession(demo);
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demo));
    setImpulseEntries(JSON.parse(localStorage.getItem(DEMO_IMPULSES_KEY) ?? '[]'));
    setAlertPreferences(JSON.parse(localStorage.getItem(DEMO_ALERTS_KEY) ?? 'null'));
    setGoals(JSON.parse(localStorage.getItem(DEMO_GOALS_KEY) ?? '[]'));
  };

  const saveProfile = async (payload: Omit<UserProfile, 'id'>) => {
    const userId = session?.user.id;
    if (!userId) return 'No hay sesión activa.';

    if (!supabase || userId === 'demo-user') {
      const demoProfile: UserProfile = { ...payload, id: userId, bet_types: payload.bet_types as BetType[] };
      setProfile(demoProfile);
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));
      return null;
    }

    const { error } = await supabase.from('user_profiles').upsert({ id: userId, ...payload });
    if (!error) await fetchProfile(userId);
    return error?.message ?? null;
  };

  const addImpulseEntry: AuthContextValue['addImpulseEntry'] = async (payload) => {
    const userId = session?.user.id;
    if (!userId) return 'No hay sesión activa.';

    if (!supabase || userId === 'demo-user') {
      const demoEntry: ImpulseEntry = {
        id: crypto.randomUUID(),
        user_id: userId,
        created_at: payload.created_at ?? new Date().toISOString(),
        intensity: payload.intensity,
        trigger: payload.trigger,
        action_taken: payload.action_taken,
        emotional_state: payload.emotional_state
      };
      const nextEntries = [demoEntry, ...impulseEntries];
      setImpulseEntries(nextEntries);
      localStorage.setItem(DEMO_IMPULSES_KEY, JSON.stringify(nextEntries));
      return null;
    }

    const { error } = await supabase.from('impulse_entries').insert({ user_id: userId, ...payload });
    if (!error) await fetchImpulseEntries(userId);
    return error?.message ?? null;
  };

  const saveAlertPreferences: AuthContextValue['saveAlertPreferences'] = async (payload) => {
    const userId = session?.user.id;
    if (!userId) return 'No hay sesión activa.';

    if (!supabase || userId === 'demo-user') {
      const nextPrefs: AlertPreferences = { id: 'demo-alerts', user_id: userId, ...payload };
      setAlertPreferences(nextPrefs);
      localStorage.setItem(DEMO_ALERTS_KEY, JSON.stringify(nextPrefs));
      return null;
    }

    const { error } = await supabase.from('alert_preferences').upsert({ user_id: userId, ...payload }, { onConflict: 'user_id' });
    if (!error) await fetchAlertPreferences(userId);
    return error?.message ?? null;
  };

  const addGoal: AuthContextValue['addGoal'] = async (payload) => {
    const userId = session?.user.id;
    if (!userId) return 'No hay sesión activa.';

    if (!supabase || userId === 'demo-user') {
      const goal: RecoveryGoal = {
        id: crypto.randomUUID(),
        user_id: userId,
        created_at: new Date().toISOString(),
        current_value: 0,
        ...payload
      };
      const next = [goal, ...goals];
      setGoals(next);
      localStorage.setItem(DEMO_GOALS_KEY, JSON.stringify(next));
      return null;
    }

    const { error } = await supabase.from('recovery_goals').insert({ user_id: userId, current_value: 0, ...payload });
    if (!error) await fetchGoals(userId);
    return error?.message ?? null;
  };

  const updateGoalProgress: AuthContextValue['updateGoalProgress'] = async (goalId, currentValue) => {
    const userId = session?.user.id;
    if (!userId) return 'No hay sesión activa.';

    if (!supabase || userId === 'demo-user') {
      const next = goals.map((goal) => (goal.id === goalId ? { ...goal, current_value: currentValue } : goal));
      setGoals(next);
      localStorage.setItem(DEMO_GOALS_KEY, JSON.stringify(next));
      return null;
    }

    const { error } = await supabase.from('recovery_goals').update({ current_value: currentValue }).eq('id', goalId).eq('user_id', userId);
    if (!error) await fetchGoals(userId);
    return error?.message ?? null;
  };

  const signOut = async () => {
    if (supabase && session?.user.id !== 'demo-user') await supabase.auth.signOut();
    localStorage.removeItem(DEMO_SESSION_KEY);
    localStorage.removeItem(DEMO_PROFILE_KEY);
    localStorage.removeItem(DEMO_IMPULSES_KEY);
    localStorage.removeItem(DEMO_ALERTS_KEY);
    localStorage.removeItem(DEMO_GOALS_KEY);
    setProfile(null);
    setImpulseEntries([]);
    setAlertPreferences(null);
    setGoals([]);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      profile,
      impulseEntries,
      alertPreferences,
      goals,
      loading,
      signIn,
      continueDemo,
      saveProfile,
      addImpulseEntry,
      saveAlertPreferences,
      addGoal,
      updateGoalProgress,
      signOut
    }),
    [session, profile, impulseEntries, alertPreferences, goals, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
