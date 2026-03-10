import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const DAILY_SAVED_CLP = 5000;

function ProgressScreen() {
  const { profile, impulseEntries } = useAuth();

  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay = (date: Date) => date.toISOString().slice(0, 10);

    const weekly = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const key = startOfDay(day);
      const entries = impulseEntries.filter((item) => item.created_at.slice(0, 10) === key);
      return { label: day.toLocaleDateString('es-CL', { weekday: 'short' }), count: entries.length };
    });

    const monthly = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (27 - i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const count = impulseEntries.filter((entry) => {
        const d = new Date(entry.created_at);
        return d >= weekStart && d <= weekEnd;
      }).length;
      return { label: `S${i + 1}`, count };
    });

    const byHour = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: impulseEntries.filter((entry) => new Date(entry.created_at).getHours() === hour).length
    }));

    const triggerMap = impulseEntries.reduce<Record<string, number>>((acc, entry) => {
      const key = entry.trigger.trim().toLowerCase();
      if (!key) return acc;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const topTriggers = Object.entries(triggerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const cleanDays = profile ? Math.max(0, Math.floor((Date.now() - new Date(profile.registration_date).getTime()) / 86400000)) : 0;

    return {
      weekly,
      monthly,
      byHour,
      topTriggers,
      cleanDays,
      savedMoney: cleanDays * DAILY_SAVED_CLP,
      trendDelta: monthly[3].count - monthly[0].count,
      riskHeat: weekly.map((w) => Math.min(1, w.count / 3))
    };
  }, [impulseEntries, profile]);

  const maxWeekly = Math.max(1, ...stats.weekly.map((w) => w.count));
  const maxMonthly = Math.max(1, ...stats.monthly.map((w) => w.count));
  const maxHour = Math.max(1, ...stats.byHour.map((w) => w.count));

  return (
    <section className="screen-grid two-columns">
      <article className="card">
        <h2>Impulsos por semana (7 días)</h2>
        <div className="bar-chart">
          {stats.weekly.map((item) => (
            <div key={item.label} className="bar-col">
              <div className="bar" style={{ height: `${(item.count / maxWeekly) * 100}%` }} />
              <small>{item.label}</small>
            </div>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>Impulsos por mes (4 semanas)</h2>
        <div className="bar-chart compact">
          {stats.monthly.map((item) => (
            <div key={item.label} className="bar-col">
              <div className="bar alt" style={{ height: `${(item.count / maxMonthly) * 100}%` }} />
              <small>{item.label}</small>
            </div>
          ))}
        </div>
        <p>Línea de tendencia: {stats.trendDelta <= 0 ? '📉 Bajando' : '📈 Subiendo'} ({stats.trendDelta})</p>
      </article>

      <article className="card">
        <h2>Heatmap de riesgo (7 días)</h2>
        <div className="heatmap">
          {stats.riskHeat.map((value, index) => (
            <div key={index} className="heat-cell" style={{ opacity: 0.25 + value * 0.75 }} />
          ))}
        </div>
      </article>

      <article className="card">
        <h2>Dinero ahorrado acumulado</h2>
        <p><strong>${stats.savedMoney.toLocaleString('es-CL')} CLP</strong></p>
        <p>Días limpio: {stats.cleanDays}</p>
      </article>

      <article className="card two-span">
        <h2>Distribución por hora del día</h2>
        <div className="sparkline">
          {stats.byHour.map((hourStat) => (
            <div key={hourStat.hour} className="spark-col" title={`${hourStat.hour}:00 - ${hourStat.count} impulsos`}>
              <div style={{ height: `${(hourStat.count / maxHour) * 100}%` }} />
            </div>
          ))}
        </div>
      </article>

      <article className="card two-span">
        <h2>Top 5 gatillos</h2>
        <ul>
          {stats.topTriggers.length === 0 && <li>No hay suficientes datos aún.</li>}
          {stats.topTriggers.map(([trigger, count]) => (
            <li key={trigger}>{trigger} — {count} registros</li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export default ProgressScreen;
