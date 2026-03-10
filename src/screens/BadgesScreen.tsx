import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

function BadgesScreen() {
  const { profile, impulseEntries, goals } = useAuth();

  const badges = useMemo(() => {
    const cleanDays = profile ? Math.max(0, Math.floor((Date.now() - new Date(profile.registration_date).getTime()) / 86400000)) : 0;
    const savedMoney = cleanDays * 5000;
    const completedGoals = goals.filter((g) => g.current_value >= g.target_value).length;

    return [
      { title: '🥉 Primera Victoria', achieved: cleanDays >= 1 },
      { title: '🥈 Guerrero', achieved: cleanDays >= 7 },
      { title: '🥇 Campeón', achieved: cleanDays >= 30 },
      { title: '💪 Invencible', achieved: cleanDays >= 100 },
      { title: '🎯 Maestro del Control', achieved: impulseEntries.length >= 10 },
      { title: '💰 Ahorrista', achieved: savedMoney >= 100000 },
      { title: '🏁 Constructor de Metas', achieved: completedGoals >= 1 },
      { title: '📝 Reflexivo', achieved: impulseEntries.length >= 20 }
    ];
  }, [profile, impulseEntries, goals]);

  return (
    <section className="card">
      <h2>Logros y Badges</h2>
      <p>Gamificación para reforzar constancia y progreso.</p>
      <div className="badge-grid">
        {badges.map((badge) => (
          <article key={badge.title} className={badge.achieved ? 'badge achieved' : 'badge'}>
            <h4>{badge.title}</h4>
            <p>{badge.achieved ? 'Desbloqueado' : 'Aún no desbloqueado'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BadgesScreen;
