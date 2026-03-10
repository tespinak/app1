import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const questions = [
  '¿Cuántas veces has apostado en el último año? (nunca, 1-2 veces al mes, 1-2 veces por semana, etc.)',
  '¿Has apostado más dinero de lo que planeabas?',
  '¿Has necesitado apostar con más dinero para sentir la emoción?',
  '¿Has tenido problemas para controlar, reducir o parar tus apuestas?',
  '¿Has apostado para recuperar dinero perdido?',
  '¿Has estado preocupado por apostar más de lo debido?',
  '¿Has necesitado mentir a alguien sobre cuánto apuestas?',
  '¿Alguien te ha criticado por tu forma de apostar?',
  '¿Has sentido culpa después de apostar?',
  '¿Has tenido problemas financieros por apostar?'
];

function classify(score: number) {
  if (score === 0) return 'No hay problema';
  if (score <= 2) return 'Riesgo bajo';
  if (score <= 7) return 'Riesgo moderado';
  return 'Problema de juego';
}

function DiagnosticLandingScreen() {
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Test de Ludopatía STOP | Diagnóstico rápido';

    const ensureMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    ensureMeta('description', 'Test CPGI adaptado para Chile y Latinoamérica. Evalúa tu nivel de riesgo y recibe recomendaciones con CTA para usar STOP.');
    ensureMeta('robots', 'index,follow');
  }, []);

  const score = useMemo(() => answers.reduce((acc, value) => acc + value, 0), [answers]);
  const result = classify(score);

  return (
    <section className="card narrow diagnostic">
      <h1>Test de diagnóstico de ludopatía STOP</h1>
      <p>Responde 10 preguntas (CPGI adaptado) para conocer tu nivel de riesgo.</p>

      {questions.map((question, index) => (
        <div key={question} className="question-block">
          <p><strong>{index + 1}. {question}</strong></p>

          {index === 0 ? (
            <select value={answers[index]} onChange={(event) => setAnswers((prev) => prev.map((v, i) => i === index ? Number(event.target.value) : v))}>
              <option value={0}>Nunca</option>
              <option value={1}>1-2 veces al mes</option>
              <option value={1}>1-2 veces por semana</option>
              <option value={1}>Casi todos los días</option>
            </select>
          ) : (
            <div className="inline-options">
              <label><input type="radio" name={`q-${index}`} checked={answers[index] === 0} onChange={() => setAnswers((prev) => prev.map((v, i) => i === index ? 0 : v))} /> No</label>
              <label><input type="radio" name={`q-${index}`} checked={answers[index] === 1} onChange={() => setAnswers((prev) => prev.map((v, i) => i === index ? 1 : v))} /> Sí</label>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => setSubmitted(true)}>Ver resultado</button>

      {submitted && (
        <div className="result-box">
          <h3>Resultado: {result}</h3>
          <p>Puntuación: {score}</p>
          <p>Te recomendamos descargar STOP y comenzar tu plan de recuperación hoy.</p>
          <div className="quick-links">
            <a href="https://stop.app/download" target="_blank" rel="noreferrer">Descargar STOP</a>
            <Link to="/onboarding">Continuar al onboarding</Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default DiagnosticLandingScreen;
