import { Navigate, Route, Routes } from 'react-router-dom';
import LandingScreen from './screens/LandingScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import CrisisScreen from './screens/CrisisScreen';
import JournalScreen from './screens/JournalScreen';
import ProgressScreen from './screens/ProgressScreen';
import AlertsScreen from './screens/AlertsScreen';
import GoalsScreen from './screens/GoalsScreen';
import BadgesScreen from './screens/BadgesScreen';
import DiagnosticLandingScreen from './screens/DiagnosticLandingScreen';
import AppShell from './components/AppShell';
import { useAuth } from './context/AuthContext';

const APP_ROUTES = ['/home', '/crisis', '/journal', '/progress', '/alerts', '/goals', '/badges'] as const;

function App() {
  const { session, profile, loading } = useAuth();

  if (loading) return <div className="centered">Cargando...</div>;

  const isLoggedIn = Boolean(session);
  const hasProfile = Boolean(profile?.name);

  return (
    <Routes>
      <Route path="/" element={<DiagnosticLandingScreen />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to={hasProfile ? '/home' : '/onboarding'} /> : <LandingScreen />} />
      <Route path="/onboarding" element={isLoggedIn ? <OnboardingScreen /> : <Navigate to="/login" />} />

      {APP_ROUTES.map((path) => (
        <Route
          key={path}
          path={path}
          element={
            isLoggedIn && hasProfile ? (
              <AppShell>
                {path === '/home' && <HomeScreen />}
                {path === '/crisis' && <CrisisScreen />}
                {path === '/journal' && <JournalScreen />}
                {path === '/progress' && <ProgressScreen />}
                {path === '/alerts' && <AlertsScreen />}
                {path === '/goals' && <GoalsScreen />}
                {path === '/badges' && <BadgesScreen />}
              </AppShell>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
