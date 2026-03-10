import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { BetType } from '../types';

const betTypeOptions: BetType[] = ['deportivas', 'casino', 'poker', 'criptos', 'otro'];

function OnboardingScreen() {
  const { saveProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [triggerTeams, setTriggerTeams] = useState('');
  const [estimatedLostAmount, setEstimatedLostAmount] = useState('');
  const [selectedBetTypes, setSelectedBetTypes] = useState<BetType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleBetType = (type: BetType) => {
    setSelectedBetTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const saveError = await saveProfile({
      name,
      registration_date: new Date().toISOString(),
      estimated_lost_amount: estimatedLostAmount ? Number(estimatedLostAmount) : null,
      bet_types: selectedBetTypes,
      trigger_teams: triggerTeams
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    });

    if (saveError) {
      setError(saveError);
      return;
    }

    navigate('/home');
  };

  return (
    <section className="card">
      <h2>Onboarding inicial</h2>
      <p>Completa tus datos para personalizar tus métricas de recuperación.</p>

      <form onSubmit={(event) => void handleSubmit(event)}>
        <label htmlFor="name">Nombre o alias</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />

        <fieldset>
          <legend>Tipo de apuestas</legend>
          <div className="chips">
            {betTypeOptions.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => toggleBetType(type)}
                className={selectedBetTypes.includes(type) ? 'chip active' : 'chip'}
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>

        <label htmlFor="teams">Equipos que gatillan más (separados por coma)</label>
        <input
          id="teams"
          value={triggerTeams}
          onChange={(e) => setTriggerTeams(e.target.value)}
          placeholder="Colo-Colo, U. de Chile"
        />

        <label htmlFor="lost">Monto aproximado perdido (opcional)</label>
        <input
          id="lost"
          type="number"
          min="0"
          value={estimatedLostAmount}
          onChange={(e) => setEstimatedLostAmount(e.target.value)}
        />

        <button type="submit">Guardar y continuar</button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default OnboardingScreen;
