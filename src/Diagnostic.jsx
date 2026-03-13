import { ArrowRight, Brain, CircleHelp, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import { getPgsiResult, pgsiOptions, pgsiQuestions } from './screening.js'
import { getTheme } from './theme.js'

function getResultAccent(result) {
  if (result.level === 'alto') return 'Necesitas más barreras y más acompañamiento.'
  if (result.level === 'moderado') return 'Ya hay impacto real. Vale la pena intervenir antes de que siga creciendo.'
  return 'Estás en un punto donde actuar temprano puede cambiar mucho el curso.'
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

  const score = useMemo(() => answers.reduce((total, value) => total + (value ?? 0), 0), [answers])
  const answeredCount = useMemo(() => answers.filter((value) => value !== null).length, [answers])
  const allAnswered = answeredCount === pgsiQuestions.length
  const result = getPgsiResult(score)
  const currentQuestion = pgsiQuestions[questionIndex]
  const currentAnswer = answers[questionIndex]

  const setAnswer = (index, value) => {
    setAnswers((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const handleNext = () => {
    if (currentAnswer === null) return
    if (questionIndex < pgsiQuestions.length - 1) {
      setQuestionIndex((current) => current + 1)
      return
    }

    onContinue({
      diagnosticScore: score,
      diagnosticLevel: result.level,
      checkIn: Math.max(2, 10 - Math.min(score, 8)),
      motivation:
        initialProfile.ageRange === '18-24'
          ? 'Todavía estás a tiempo de cortar esto antes de que se vuelva parte de tu identidad adulta.'
          : `Cambiar ahora te ayuda a recuperar ${initialProfile.goal.toLowerCase()} antes de que el costo siga creciendo.`,
    })
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px 40px', background: theme.canvas, transition: theme.transition }}>
      <style>{`@keyframes stopFadeUp { 0% { opacity: 0; transform: translateY(12px) scale(0.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: theme.hero, color: '#fff', borderRadius: 34, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ position: 'absolute', top: -36, right: -20, width: 170, height: 170, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 70%)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
            <Sparkles size={16} color="#bfdbfe" />
            Screening con base validada
          </div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.03 }}>Ahora hagamos una lectura más seria</h1>
          <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>
            Este test está adaptado del PGSI, un instrumento ampliamente usado para detectar riesgo de juego problemático. No reemplaza una evaluación clínica, pero sí nos da una base más sólida para personalizar STOP.
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
          <div style={{ color: theme.text, fontWeight: 800, marginBottom: 6 }}>¿Qué mide este screening?</div>
          <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>
            Busca señales de pérdida de control, persecución de pérdidas, impacto emocional, endeudamiento y daño económico durante los últimos 12 meses.
          </div>
        </section>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {pgsiQuestions.map((_, index) => (
            <div key={index} style={{ width: index === questionIndex ? 24 : 8, height: 8, borderRadius: 999, background: index === questionIndex ? '#2563eb' : answers[index] !== null ? '#34d399' : theme.mode === 'dark' ? 'rgba(255,255,255,0.14)' : '#cbd5e1', transition: theme.transition }} />
          ))}
        </div>

        <section style={{ background: theme.surface, borderRadius: 28, padding: 20, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, backdropFilter: 'blur(18px)', transition: theme.transition, animation: 'stopFadeUp 340ms ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 11px', borderRadius: 999, background: theme.mode === 'dark' ? 'rgba(37,99,235,0.16)' : '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 12 }}>
            PREGUNTA {questionIndex + 1}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 16, display: 'grid', placeItems: 'center', background: theme.mode === 'dark' ? '#0f172a' : '#eff6ff' }}>
              <CircleHelp size={18} color={theme.mode === 'dark' ? '#93c5fd' : '#1d4ed8'} />
            </div>
            <div>
              <div style={{ color: theme.text, fontWeight: 800, lineHeight: 1.5, fontSize: 22 }}>{currentQuestion}</div>
              <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14, marginTop: 8 }}>Piensa en los últimos 12 meses y marca la opción que más se parece a tu caso.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {pgsiOptions.map((option) => (
              <OptionButton key={option.label} option={option} selected={currentAnswer === option.value} onClick={() => setAnswer(questionIndex, option.value)} theme={theme} />
            ))}
          </div>
        </section>

        <div style={{ background: theme.elevated, borderRadius: 28, padding: 22, color: theme.mode === 'dark' ? '#fff' : '#0f172a', boxShadow: theme.shadow, marginBottom: 18, border: theme.mode === 'dark' ? '1px solid rgba(148,163,184,0.16)' : '1px solid rgba(148,163,184,0.10)', transition: theme.transition }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Brain size={18} color={result.color} />
            <div style={{ fontWeight: 800 }}>Resultado inicial</div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: result.color, marginBottom: 6 }}>{allAnswered ? result.band.toUpperCase() : 'PENDIENTE'}</div>
          <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 10 }}>{allAnswered ? result.copy : 'Tu resultado aparecerá cuando completes las 9 preguntas.'}</div>
          <div style={{ color: theme.text, fontWeight: 800, marginBottom: 6 }}>Puntaje PGSI adaptado: {score}/{pgsiQuestions.length * 3}</div>
          <div style={{ color: theme.subtle, fontSize: 14, lineHeight: 1.55 }}>{allAnswered ? getResultAccent(result) : 'No dejamos respuestas marcadas por defecto para que el resultado parta realmente desde cero.'}</div>
        </div>

        <section style={{ background: theme.info, borderRadius: 22, padding: 18, color: theme.infoText, lineHeight: 1.55, marginBottom: 18, transition: theme.transition }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, marginBottom: 6 }}>
            <ShieldCheck size={16} />
            ¿Qué cambiará en tu app?
          </div>
          STOP usará este resultado para ajustar tono, nivel de alerta, prioridad de crisis, profundidad educativa y futuras capas como bloqueo, IA y horarios de riesgo.
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: questionIndex > 0 ? '0.78fr 1fr' : '1fr', gap: 10 }}>
          {questionIndex > 0 && (
            <button type="button" onClick={() => setQuestionIndex((current) => current - 1)} style={{ border: `1px solid ${theme.border}`, borderRadius: 24, padding: '16px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, transition: theme.transition }}>
              Volver
            </button>
          )}
          <button type="button" disabled={currentAnswer === null} onClick={handleNext} style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: currentAnswer !== null ? 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)' : '#94a3b8', color: '#fff', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: currentAnswer !== null ? '0 20px 45px rgba(29,78,216,0.22)' : 'none', transition: theme.transition }}>
            {questionIndex === pgsiQuestions.length - 1 ? 'Entrar a mi Home personalizada' : 'Siguiente pregunta'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}