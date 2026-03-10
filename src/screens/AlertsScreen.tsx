import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AlertsScreen() {
  const { alertPreferences, profile, impulseEntries, saveAlertPreferences } = useAuth();
  const [teamAlerts, setTeamAlerts] = useState(true);
  const [paydayAlerts, setPaydayAlerts] = useState(true);
  const [riskHoursAlerts, setRiskHoursAlerts] = useState(true);
  const [breathingReminders, setBreathingReminders] = useState(true);
  const [nightlyCheckin, setNightlyCheckin] = useState(true);
  const [milestoneCelebrations, setMilestoneCelebrations] = useState(true);
  const [riskHours, setRiskHours] = useState('18:00, 21:00');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!alertPreferences) return;
    setTeamAlerts(alertPreferences.team_alerts);
    setPaydayAlerts(alertPreferences.payday_alerts);
    setRiskHoursAlerts(alertPreferences.risk_hours_alerts);
    setBreathingReminders(alertPreferences.breathing_reminders);
    setNightlyCheckin(alertPreferences.nightly_checkin);
    setMilestoneCelebrations(alertPreferences.milestone_celebrations);
    setRiskHours(alertPreferences.risk_hours.join(', '));
  }, [alertPreferences]);

  const smartSuggestions = useMemo(() => {
    const hourCount = impulseEntries.reduce<Record<number, number>>((acc, item) => {
      const hour = new Date(item.created_at).getHours();
      acc[hour] = (acc[hour] ?? 0) + 1;
      return acc;
    }, {});

    const topHours = Object.entries(hourCount)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 3)
      .map(([hour]) => `${hour.padStart(2, '0')}:00`);

    const cleanDays = profile ? Math.max(0, Math.floor((Date.now() - new Date(profile.registration_date).getTime()) / 86400000)) : 0;
    const nextMilestone = [7, 30, 100].find((value) => value > cleanDays);

    return { topHours, cleanDays, nextMilestone };
  }, [impulseEntries, profile]);

  const applySmartHours = () => {
    if (!smartSuggestions.topHours.length) return;
    setRiskHours(smartSuggestions.topHours.join(', '));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const error = await saveAlertPreferences({
      team_alerts: teamAlerts,
      payday_alerts: paydayAlerts,
      risk_hours_alerts: riskHoursAlerts,
      breathing_reminders: breathingReminders,
      nightly_checkin: nightlyCheckin,
      milestone_celebrations: milestoneCelebrations,
      risk_hours: riskHours.split(',').map((hour) => hour.trim()).filter(Boolean)
    });
    setMessage(error ?? 'Preferencias de alertas guardadas.');
  };

  return (
    <section className="card">
      <h2>Alertas Inteligentes</h2>
      <p>Activa prevención proactiva basada en tus patrones personales.</p>
      {profile?.trigger_teams?.length ? <p>⚽ Equipos gatillo: {profile.trigger_teams.join(', ')}</p> : null}

      <div className="hint-box">
        <p>⏰ Horas de mayor riesgo detectadas: {smartSuggestions.topHours.length ? smartSuggestions.topHours.join(', ') : 'sin datos aún'}</p>
        <p>🎯 Próximo hito: {smartSuggestions.nextMilestone ? `${smartSuggestions.nextMilestone} días limpio` : 'mantener consistencia'}</p>
        <button type="button" onClick={applySmartHours}>Usar horarios sugeridos</button>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <label><input type="checkbox" checked={teamAlerts} onChange={(e) => setTeamAlerts(e.target.checked)} /> Alertas cuando juega tu equipo gatillo</label>
        <label><input type="checkbox" checked={paydayAlerts} onChange={(e) => setPaydayAlerts(e.target.checked)} /> Alertas en quincena / fin de mes</label>
        <label><input type="checkbox" checked={riskHoursAlerts} onChange={(e) => setRiskHoursAlerts(e.target.checked)} /> Alertas en horarios de riesgo</label>
        <label><input type="checkbox" checked={breathingReminders} onChange={(e) => setBreathingReminders(e.target.checked)} /> Recordatorios de respiración</label>
        <label><input type="checkbox" checked={nightlyCheckin} onChange={(e) => setNightlyCheckin(e.target.checked)} /> Check-in nocturno: "¿Cómo fue tu día?"</label>
        <label><input type="checkbox" checked={milestoneCelebrations} onChange={(e) => setMilestoneCelebrations(e.target.checked)} /> Celebración de hitos (7, 30, 100 días)</label>

        <label htmlFor="hours">Horarios de riesgo (HH:MM, separados por coma)</label>
        <input id="hours" value={riskHours} onChange={(e) => setRiskHours(e.target.value)} />

        <button type="submit">Guardar alertas</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}

export default AlertsScreen;
