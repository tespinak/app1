import { Link } from 'react-router-dom';

interface Props {
  team: string;
  hours: number;
}

function MatchAlertBanner({ team, hours }: Props) {
  return (
    <div className="match-alert">
      <p>⚠️ Partido de <strong>{team}</strong> en <strong>{hours} horas</strong>. Prepárate ahora para cuidar tu proceso.</p>
      <Link to="/crisis" className="primary-link">Prepararme</Link>
    </div>
  );
}

export default MatchAlertBanner;
