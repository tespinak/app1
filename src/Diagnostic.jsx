import { ArrowRight, Brain, CircleHelp, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import { getPgsiResult, pgsiOptions, pgsiQuestions } from './screening.js'
import { getTheme } from './theme.js'

function getResultAccent(result) {
  if (result.level === 'alto') return 'Necesitas m\u00e1s barreras y m\u00e1s acompa\u00f1amiento.'
  if (result.level === 'moderado') return 'Ya hay impacto real. Vale la pena intervenir antes de que siga creciendo.'
  return 'Est\u00e1s en un punto donde actuar temprano puede cambiar mucho el curso.'
}

function getActionPlan(result) {
  if (result.level === 'alto') {
    return [
      'Activa el bot\u00f3n de crisis y \u00fasalo antes de cualquier impulso fuerte.',
      'Corta el acceso r\u00e1pido a apps, sitios y cuentas que te arrastran.',
      'Cu\u00e9ntale a una persona de confianza que necesitas apoyo real esta semana.',
    ]
  }

  if (result.level === 'moderado') {
    return [
      'Empieza un check-in diario para detectar cu\u00e1ndo sube el impulso.',
      'Activa fricci\u00f3n antes de horarios o torneos que te suelen gatillar.',
      'Usa la biblioteca y el asistente para no improvisar cuando aparezca el impulso.',
    ]
  }

  return [
    'Define l\u00edmites claros antes de que el problema gane m\u00e1s espacio.',
    'Mant\u00e9n el check-in diario para detectar cambios temprano.',
    'Refuerza tu motivo para cambiar y no normalices peque\u00f1as reca\u00eddas.',
  ]
}

function OptionButton({ option, selected, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: 'none',
        borderRadius: 18,
        padding: '14px 16px',
        fontWeight: 800,
        textAlign: 'left',
        background: selected ? '#1d4ed8' : theme.mode === 'dark' ? '#0f172a' : '#e2e8f0',
        color: selected ? '#fff' : theme.text,
        transform: selected ? 'translateY(-2px) scale(1.01)' : 'translateY(0)',
        boxShadow: selected ? '0 18px 36px rgba(29,78,216,0.18)' : 'none',
        transition: theme.transition,
      }}
    >
      {option.label}
    </button>
  )
}

export default function Diagnostic({ initialProfile, onContinue, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [answers, setAnswers] = useState(Array(pgsiQuestions.length).fill(null))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const score = useMemo(() => answers.reduce((total, value) => total + (value ?? 0), 0), [answers])
  const answeredCount = useMemo(() => answers.filter((value) => value !== null).length, [answers])
  const result = getPgsiResult(score)
  const currentQuestion = pgsiQuestions[questionIndex]
  const currentAnswer = answers[questionIndex]
  const actionPlan = useMemo(() => getActionPlan(result), [result])

  const finalPayload = useMemo(
    () => ({
      diagnosticScore: score,
      diagnosticLevel: result.level,
      checkIn: Math.max(2, 10 - Math.min(score, 8)),
      motivation:
        initialProfile.ageRange === '18-24'
          ? 'Todav\u00eda est\u00e1s a tiempo de cortar esto antes de que se vuelva parte de tu identidad adulta.'
          : `Cambiar ahora te ayuda a recuperar ${initialProfile.goal.toLowerCase()} antes de que el costo siga creciendo.`,
    }),
    [initialProfile.ageRange, initialProfile.goal, result.level, score],
  )

  const setAnswer = (index, value) => {
    setAnswers((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const handleSelectAnswer = (value) => {
    setAnswer(questionIndex, value)
    setIsAdvancing(true)

    if (questionIndex < pgsiQuestions.length - 1) {
      window.setTimeout(() => {
        setQuestionIndex((current) => (current < pgsiQuestions.length - 1 ? current + 1 : current))
        setIsAdvancing(false)
      }, 170)
      return
    }

    window.setTimeout(() => {
      setIsAdvancing(false)
      setShowResult(true)
    }, 200)
  }

  if (showResult) {
    return (
      <div style={{ minHeight: '100vh', padding: '24px 20px 40px', background: theme.canvas, transition: theme.transition }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
          </div>

          <section style={{ position: 'relative', overflow: 'hidden', background: theme.hero, color: '#fff', borderRadius: 34, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
            <div style={{ position: 'absolute', top: -36, right: -20, width: 170, height: 170, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 70%)' }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
              <Sparkles size={16} color="#bfdbfe" />
              Screening completado
            </div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.03 }}>Aqu\u00ed est\u00e1 tu punto de partida</h1>
            <p style={{ margin: '12px 0 0', color: '#dbeafe', lineHeight: 1.6 }}>
              Este no es un diagn\u00f3stico cl\u00ednico, pero s\u00ed una se\u00f1al \u00fatil para personalizar STOP y mostrarte un plan inicial m\u00e1s realista.
            </p>
          </section>

          <section style={{ background: theme.elevated, borderRadius: 30, padding: 22, color: theme.mode === 'dark' ? '#fff' : '#0f172a', boxShadow: theme.shadow, marginBottom: 18, border: `1px solid ${theme.border}`, transition: theme.transition }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Brain size={18} color={result.color} />
              <div style={{ fontWeight: 800 }}>Resultado del screening</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: result.color, marginBottom: 8 }}>{result.band.toUpperCase()}</div>
            <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 12 }}>{result.copy}</div>
            <div style={{ color: theme.text, fontWeight: 800, marginBottom: 6 }}>Puntaje PGSI adaptado: {score}/{pgsiQuestions.length * 3}</div>
            <div style={{ color: theme.subtle, fontSize: 14, lineHeight: 1.55 }}>{getResultAccent(result)}</div>
          </section>

          <section style={{ background: theme.surface, borderRadius: 28, padding: 20, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, backdropFilter: 'blur(18px)', transition: theme.transition }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <ShieldCheck size={18} color="#2563eb" />
              <div style={{ color: theme.text, fontWeight: 800 }}>Plan de acci\u00f3n inicial</div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {actionPlan.map((item) => (
                <div key={item} style={{ background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : '#eff6ff', borderRadius: 18, padding: '14px 16px', color: theme.text, lineHeight: 1.55, fontWeight: 700, transition: theme.transition }}>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: theme.info, borderRadius: 22, padding: 18, color: theme.infoText, lineHeight: 1.55, marginBottom: 18, transition: theme.transition }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, marginBottom: 6 }}>
              <ShieldCheck size={16} />
              \u00bfQu\u00e9 har\u00e1 STOP con esto?
            </div>
            Ajustaremos tono, nivel de alerta, prioridad de crisis, profundidad educativa y futuras capas como bloqueo, IA y horarios de riesgo.
          </section>

          <button type="button" onClick={() => onContinue(finalPayload)} style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 20px 45px rgba(29,78,216,0.22)', transition: theme.transition }}>
            Ver mi plan recomendado
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px 40px', background: theme.canvas, transition: theme.transition }}>
      <style>{`@keyframes stopFadeUp { 0% { opacity: 0; transform: translateY(12px) scale(0.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } } @keyframes stopSoftPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }`}</style>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: theme.hero, color: '#fff', borderRadius: 34, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ position: 'absolute', top: -36, right: -20, width: 170, height: 170, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 70%)' }} />
          {questionIndex > 0 && (
            <button
              type="button"
              onClick={() => setQuestionIndex((current) => current - 1)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.10)',
                color: '#fff',
                width: 36,
                height: 36,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: 18,
                backdropFilter: 'blur(10px)',
                transition: theme.transition,
              }}
              aria-label="Volver a la pregunta anterior"
            >
              {'\u2190'}
            </button>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
            <Sparkles size={16} color="#bfdbfe" />
            Screening con base validada
          </div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.03 }}>Ahora hagamos una lectura m\u00e1s seria</h1>
          <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>
            Este test est\u00e1 adaptado del PGSI, un instrumento ampliamente usado para detectar riesgo de juego problem\u00e1tico. No reemplaza una evaluaci\u00f3n cl\u00ednica, pero s\u00ed nos da una base m\u00e1s s\u00f3lida para personalizar STOP.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 22, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ color: '#dbeafe', fontSize: 13, fontWeight: 800 }}>Pregunta {questionIndex + 1} de {pgsiQuestions.length}</div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>{Math.round((answeredCount / pgsiQuestions.length) * 100)}%</div>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
              <div style={{ width: `${(answeredCount / pgsiQuestions.length) * 100}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #93c5fd 0%, #34d399 100%)' }} />
            </div>
          </div>
        </section>

        <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, backdropFilter: 'blur(18px)', transition: theme.transition }}>
          <div style={{ color: theme.text, fontWeight: 800, marginBottom: 6 }}>\u00bfQu\u00e9 mide este screening?</div>
          <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>
            Busca se\u00f1ales de p\u00e9rdida de control, persecuci\u00f3n de p\u00e9rdidas, impacto emocional, endeudamiento y da\u00f1o econ\u00f3mico durante los \u00faltimos 12 meses.
          </div>
        </section>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {pgsiQuestions.map((_, index) => (
            <div key={index} style={{ width: index === questionIndex ? 24 : 8, height: 8, borderRadius: 999, background: index === questionIndex ? '#2563eb' : answers[index] !== null ? '#34d399' : theme.mode === 'dark' ? 'rgba(255,255,255,0.14)' : '#cbd5e1', transition: theme.transition, animation: index === questionIndex ? 'stopSoftPulse 380ms ease' : 'none' }} />
          ))}
        </div>

        <section style={{ background: theme.surface, borderRadius: 28, padding: 20, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, backdropFilter: 'blur(18px)', transition: theme.transition, animation: 'stopFadeUp 340ms ease', opacity: isAdvancing ? 0.58 : 1, transform: isAdvancing ? 'translateY(8px) scale(0.992)' : 'translateY(0) scale(1)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 11px', borderRadius: 999, background: theme.mode === 'dark' ? 'rgba(37,99,235,0.16)' : '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 12 }}>
            PREGUNTA {questionIndex + 1}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 16, display: 'grid', placeItems: 'center', background: theme.mode === 'dark' ? '#0f172a' : '#eff6ff' }}>
              <CircleHelp size={18} color={theme.mode === 'dark' ? '#93c5fd' : '#1d4ed8'} />
            </div>
            <div>
              <div style={{ color: theme.text, fontWeight: 800, lineHeight: 1.5, fontSize: 22 }}>{currentQuestion}</div>
              <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14, marginTop: 8 }}>Piensa en los \u00faltimos 12 meses y marca la opci\u00f3n que m\u00e1s se parece a tu caso.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {pgsiOptions.map((option) => (
              <OptionButton key={option.label} option={option} selected={currentAnswer === option.value} onClick={() => handleSelectAnswer(option.value)} theme={theme} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
