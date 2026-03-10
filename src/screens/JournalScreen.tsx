import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import type { ImpulseLog } from '../types';

const DEMO_LOGS_KEY = 'stop_demo_impulse_logs';

const triggerOptions = ['aburrimiento', 'estrés', 'partido', 'alcohol', 'dinero ganado/perdido', 'otros'];

function JournalScreen() {
  const { session } = useAuth();
  const [logs, setLogs] = useState<ImpulseLog[]>([]);
  const [filter, setFilter] = useState<'week' | 'all'>('week');
  const [trigger, setTrigger] = useState(triggerOptions[0]);
  const [resisted, setResisted] = useState(true);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const userId = session?.user.id;
      if (!userId) return;

      if (!supabase || userId === 'demo-user') {
        setLogs(JSON.parse(localStorage.getItem(DEMO_LOGS_KEY) ?? '[]'));
        return;
      }

      const { data } = await supabase.from('impulse_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      setLogs((data ?? []) as ImpulseLog[]);
    };
    void load();
  }, [session?.user.id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const userId = session?.user.id;
    if (!userId) return;

    const row = {
      user_id: userId,
      created_at: new Date().toISOString(),
      trigger,
      resisted,
      note: note.trim() || null
    };

    if (!supabase || userId === 'demo-user') {
      const next: ImpulseLog[] = [{ id: crypto.randomUUID(), ...row }, ...logs];
      setLogs(next);
      localStorage.setItem(DEMO_LOGS_KEY, JSON.stringify(next));
      setNote('');
      setMessage('Impulso registrado.');
      return;
    }

    const { error } = await supabase.from('impulse_logs').insert(row);
    if (error) {
      setMessage(error.message);
      return;
    }
    const { data } = await supabase.from('impulse_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setLogs((data ?? []) as ImpulseLog[]);
    setNote('');
    setMessage('Impulso registrado.');
  };

  const visibleLogs = useMemo(() => {
    if (filter === 'all') return logs;
    const limit = Date.now() - 7 * 86400000;
    return logs.filter((log) => new Date(log.created_at).getTime() >= limit);
  }, [logs, filter]);

  const resistedRate = useMemo(() => {
    if (!visibleLogs.length) return 0;
    return Math.round((visibleLogs.filter((log) => log.resisted).length / visibleLogs.length) * 100);
  }, [visibleLogs]);

  const commonTrigger = useMemo(() => {
    if (!visibleLogs.length) return 'Sin datos';
    const map = visibleLogs.reduce<Record<string, number>>((acc, log) => {
      acc[log.trigger] = (acc[log.trigger] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0][0];
  }, [visibleLogs]);

  return (
    <section className="screen-grid two-columns">
      <article className="card">
        <h2>Registrar impulso</h2>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <label>Fecha/hora</label>
          <input value={new Date().toLocaleString('es-CL')} disabled />

          <label>¿Qué gatilló este impulso?</label>
          <select value={trigger} onChange={(e) => setTrigger(e.target.value)}>
            {triggerOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <label>¿Lo resististe?</label>
          <div className="inline-options">
            <label><input type="radio" checked={resisted} onChange={() => setResisted(true)} /> Sí</label>
            <label><input type="radio" checked={!resisted} onChange={() => setResisted(false)} /> No</label>
          </div>

          <label>Nota opcional (50 caracteres)</label>
          <input maxLength={50} value={note} onChange={(e) => setNote(e.target.value)} />

          <button type="submit">Guardar</button>
        </form>
        {message && <p>{message}</p>}
      </article>

      <article className="card">
        <h3>Historial de impulsos</h3>
        <div className="inline-options">
          <button type="button" onClick={() => setFilter('week')}>Última semana</button>
          <button type="button" onClick={() => setFilter('all')}>Todos</button>
        </div>

        <p>% resistidos: <strong>{resistedRate}%</strong></p>
        <p>Gatillante más común: <strong>{commonTrigger}</strong></p>

        <ul className="entry-list">
          {visibleLogs.length === 0 && <li>No hay registros.</li>}
          {visibleLogs.map((log) => (
            <li key={log.id}>
              <strong>{new Date(log.created_at).toLocaleString('es-CL')}</strong>
              <span>Gatillo: {log.trigger}</span>
              <span>Resistido: {log.resisted ? 'Sí' : 'No'}</span>
              {log.note ? <span>Nota: {log.note}</span> : null}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export default JournalScreen;
