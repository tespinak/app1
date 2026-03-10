import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LandingScreen() {
  const { signIn, continueDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const signInError = await signIn(email, password);
    setError(signInError);
  };

  return (
    <section className="card narrow">
      <h2>Bienvenido a STOP</h2>
      <p>Una app para ayudarte a pausar el impulso, recuperar control y construir días limpios.</p>

      <form onSubmit={(event) => void handleSubmit(event)}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Ingresar</button>
      </form>

      <button className="secondary" onClick={continueDemo}>
        Continuar en modo demo
      </button>

      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default LandingScreen;
