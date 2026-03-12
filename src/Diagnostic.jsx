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

export default function Diagnostic({ initialProfile, onContinue, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [answers, setAnswers] = useState(Array(pgsiQuestions.length).fill(0))

  const score = useMemo(() => answers.reduce((total, value) => total + value, 0), [answers])
  const answeredCount = useMemo(() => answers.filter((value) => value !== null && value !== undefined).length, [answers])
  const result = getPgsiResult(score)

  const setAnswer = (index, value) => {
    setAnswers((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const handleContinue = () => {
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
    <div style={{ minHeight: '100vh', padding: '24px 20px 40px', background: theme.canvas }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: theme.hero, color: '#fff', borderRadius: 34, padding: 24, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ position: 'absolute', top: -36, right: -20, width: 170, height: 170, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 70%)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
            <Sparkles size={16} color="#bfdbfe" />
            Screening con base validada
          </div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.03 }}>Ahora hagamos una lectura más seria</h1>
          <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>
            Este test está adaptado del PGSI, un instrumento ampliamente usado para detectar riesgo de juego problemático. No reemplaza una evaluación clínica, pero sí nos da una base mucho más sólida que un test improvisado.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 22, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ color: '#dbeafe', fontSize: 13, fontWeight: 800 }}>Progreso del screening</div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>{Math.round((answeredCount / pgsiQuestions.length) * 100)}%</div>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
              <div style={{ width: `${(answeredCount / pgsiQuestions.length) * 100}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #93c5fd 0%, #34d399 100%)' }} />
            </div>
          </div>
        </section>

        <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, backdropFilter: 'blur(18px)' }}>
          <div style={{ color: theme.text, fontWeight: 800, marginBottom: 6 }}>Qué mide este screening</div>
          <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>
            Busca señales de pérdida de control, persecución de pérdidas, impacto emocional, endeudamiento y daño económico durante los últimos 12 meses.
          </div>
        </section>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          {pgsiQuestions.map((question, index) => (
            <div key={question} style={{ background: theme.surface, borderRadius: 24, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, backdropFilter: 'blur(18px)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <CircleHelp size={18} color={theme.subtle} style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ color: theme.text, fontWeight: 700, lineHeight: 1.55 }}>{question}</div>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {pgsiOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setAnswer(index, option.value)}
                    style={{
                      border: 'none',
                      borderRadius: 16,
                      padding: '12px 14px',
                      fontWeight: 700,
                      textAlign: 'left',
                      background: answers[index] === option.value ? '#1d4ed8' : theme.mode === 'dark' ? '#0f172a' : '#e2e8f0',
                      color: answers[index] === option.value ? '#fff' : theme.text,
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: theme.elevated, borderRadius: 28, padding: 22, color: theme.mode === 'dark' ? '#fff' : '#0f172a', boxShadow: theme.shadow, marginBottom: 18, border: theme.mode === 'dark' ? '1px solid rgba(148,163,184,0.16)' : '1px solid rgba(148,163,184,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Brain size={18} color={result.color} />
            <div style={{ fontWeight: 800 }}>Resultado inicial</div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: result.color, marginBottom: 6 }}>{result.band.toUpperCase()}</div>
          <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 10 }}>{result.copy}</div>
          <div style={{ color: theme.text, fontWeight: 800, marginBottom: 6 }}>Puntaje PGSI adaptado: {score}/{pgsiQuestions.length * 3}</div>
          <div style={{ color: theme.subtle, fontSize: 14, lineHeight: 1.55 }}>{getResultAccent(result)}</div>
        </div>

        <section style={{ background: theme.info, borderRadius: 22, padding: 18, color: theme.infoText, lineHeight: 1.55, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, marginBottom: 6 }}>
            <ShieldCheck size={16} />
            Qué cambiará en tu app
          </div>
          STOP usará este resultado para ajustar tono, nivel de alerta, prioridad de crisis, profundidad educativa y futuras capas como bloqueo, IA y horarios de riesgo.
        </section>

        <button
          type="button"
          onClick={handleContinue}
          style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 20px 45px rgba(29,78,216,0.22)' }}
        >
          Entrar a mi Home personalizada
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}