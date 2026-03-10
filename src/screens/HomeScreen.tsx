import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MatchAlertBanner from '../components/MatchAlertBanner';
import UpgradeModal from '../components/UpgradeModal';
import { useRecoveryMetrics } from '../hooks/useRecoveryMetrics';
import { useSubscription } from '../hooks/useSubscription';
import { useUpcomingMatches } from '../hooks/useUpcomingMatches';

function HomeScreen() {
  const { profile, impulseEntries, goals } = useAuth();
  const metrics = useRecoveryMetrics(profile);
  const { nextIn24h } = useUpcomingMatches(profile?.trigger_teams ?? []);
  const { isPremium, loading: loadingSubscription, openCheckout } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const completedGoals = goals.filter((goal) => goal.current_value >= goal.target_value).length;

  return (
    <section className="screen-grid">
      {nextIn24h ? <MatchAlertBanner team={nextIn24h.team} hours={nextIn24h.hours} /> : null}

      <article className="metric-card">
        <h3>Días limpio</h3>
        <p>{metrics.cleanDays}</p>
      </article>

      <article className="metric-card">
        <h3>Dinero recuperado estimado</h3>
        <p>${Math.round(metrics.moneyRecovered).toLocaleString('es-CL')} CLP</p>
        <small>≈ {metrics.wagesEquivalent.toFixed(2)} sueldos mínimos</small>
      </article>

      <article className="metric-card">
        <h3>Tiempo recuperado estimado</h3>
        <p>{metrics.timeRecoveredHours} horas</p>
        <small>{metrics.moviesEquivalent} películas · {metrics.booksEquivalent} libros</small>
      </article>

      <article className="card">
        <h3>Acciones clave</h3>
        <p>Impulsos registrados: {impulseEntries.length}</p>
        <p>Metas completadas: {completedGoals}</p>
        <div className="quick-links">
          <Link to="/journal">Registrar impulso</Link>
          <Link to="/progress">Ver dashboard</Link>
          <Link to="/alerts">Alertas inteligentes</Link>
          <Link to="/goals">Configurar metas</Link>
          <Link to="/badges">Ver logros</Link>
        </div>

        {!isPremium ? <button onClick={() => setShowUpgrade(true)}>Ir a Premium</button> : <p>Plan Premium activo ✅</p>}
      </article>

      <UpgradeModal
        open={showUpgrade}
        loading={loadingSubscription}
        onClose={() => setShowUpgrade(false)}
        onCheckout={() => void openCheckout()}
      />
    </section>
  );
}

export default HomeScreen;
