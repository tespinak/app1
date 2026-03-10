import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/home', label: 'Inicio' },
    { to: '/journal', label: 'Diario' },
    { to: '/progress', label: 'Dashboard' },
    { to: '/alerts', label: 'Alertas' },
    { to: '/goals', label: 'Metas' },
    { to: '/badges', label: 'Logros' },
    { to: '/crisis', label: 'Crisis' }
  ];

  return (
    <div className="app-shell">
      <header className="header">
        <h1>STOP</h1>
        <nav>
          {links.map((link) => (
            <Link key={link.to} className={location.pathname === link.to ? 'active' : ''} to={link.to}>
              {link.label}
            </Link>
          ))}
          <button onClick={() => void signOut()}>Salir</button>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default AppShell;
