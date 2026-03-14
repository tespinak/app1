import { ArrowLeft, Brain, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getPgsiResult, pgsiOptions, pgsiQuestions } from './screening.js'
import { renderText } from './text.js'
import { getTheme } from './theme.js'

function getActionCopy(result) {
  if (result.level === 'alto') {
    return 'Esto ya merece atención. La buena noticia es que todavía puedes actuar a tiempo y empezar a ordenar las cosas.'
  }

  if (result.level === 'moderado') {
    return 'Esto ya merece atención. La buena noticia es que todavía puedes actuar a tiempo y empezar a ordenar las cosas.'
  }

  return 'Todavía estás en un punto donde actuar temprano puede cambiar mucho el curso de esta historia.'
}

function getFirstStep(result) {
  if (result.level === 'alto') {
    return 'Activa el modo crisis antes de cualquier impulso fuerte y usa el check-in diario para detectar qué te está desordenando más.'
  }

  if (result.level === 'moderado') {
    return 'Empieza con el check-in diario y usa el asistente cuando notes ansiedad, ganas de recuperar dinero o ruido mental.'
  }

  return 'Prueba el check-in diario para identificar tus patrones. Usa las herramientas de crisis cuando sientas impulsos fuertes.'
}

function getDiagnosticLevelLabel(result) {
  if (result.band === 'riesgo muy alto') return 'NIVEL MUY ALTO'
  if (result.level === 'alto') return 'NIVEL ALTO'
  if (result.level === 'moderado') return 'NIVEL MODERADO'
  return 'NIVEL INICIAL'
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
      {renderText(option.label)}
    </button>
  )
}

export default function Diagnostic({ initialProfile, onContinue, onOpenPremium, themeMode }) {
  const theme = getTheme(themeMode)
  const [answers, setAnswers] = useState(Array(pgsiQuestions.length).fill(null))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const score = useMemo(() => answers.reduce((total, value) => total + (value ?? 0), 0), [answers])
  const answeredCount = useMemo(() => answers.filter((value) => value !== null).length, [answers])
  const result = getPgsiResult(score)
  const currentQuestion = pgsiQuestions[questionIndex]
  const progress = Math.round((answeredCount / pgsiQuestions.length) * 100)

  const finalPayload = useMemo(
    () => ({
      diagnosticScore: score,
      diagnosticLevel: result.level,
      diagnosticBand: result.band,
      checkIn: Math.max(2, 10 - Math.min(score, 8)),
      motivation:
        initialProfile.ageRange === '18-24'
          ? 'Todavía estás a tiempo de cortar esto antes de que se vuelva parte de tu vida diaria.'
          : `Cambiar ahora te ayuda a recuperar ${initialProfile.goal.toLowerCase()} antes de que esto siga ocupando más espacio en tu día a día.`,
    }),
    [initialProfile.ageRange, initialProfile.goal, result.level, result.band, score],
  )

  const handleSelectAnswer = (value) => {
    setAnswers((current) => current.map((item, index) => (index === questionIndex ? value : item)))
    setIsAdvancing(true)

    if (questionIndex < pgsiQuestions.length - 1) {
      window.setTimeout(() => {
        setQuestionIndex((current) => current + 1)
        setIsAdvancing(false)
      }, 170)
      return
    }

    window.setTimeout(() => {
      setIsAdvancing(false)
      setShowResult(true)
    }, 190)
  }

  if (showResult) {
    return (
      <div style={{ minHeight: '100vh', padding: '24px 20px 40px', background: theme.canvas, transition: theme.transition }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <section
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: theme.hero,
              color: '#fff',
              borderRadius: 30,
              padding: 22,
              boxShadow: theme.shadow,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -36,
                right: -10,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 70%)',
              }}
            />
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.12)',
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                <ShieldCheck size={16} color="#dbeafe" />
                Screening completado
              </div>
              <div style={{ color: '#dbeafe', fontSize: 15, lineHeight: 1.6 }}>Este es tu punto de partida</div>
            </div>
          </section>

          <section
            style={{
              background: theme.mode === 'dark' ? 'rgba(15,23,42,0.84)' : '#ffffff',
              borderRadius: 28,
              padding: 22,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 999,
                background: theme.mode === 'dark' ? 'rgba(16,185,129,0.14)' : '#ecfdf5',
                color: result.color,
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              <Brain size={16} color={result.color} />
              Señal de riesgo inicial
            </div>
            <div style={{ color: result.color, fontSize: 28, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
              {getDiagnosticLevelLabel(result)}
            </div>
            <div style={{ color: theme.subtle, fontSize: 15, lineHeight: 1.5, marginBottom: 16 }}>
              Tu resultado muestra cómo está impactando hoy esta situación en tu día a día. ({score}/{pgsiQuestions.length * 3} puntos)
            </div>
            <div
              style={{
                background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderRadius: 22,
                padding: 18,
                color: theme.muted,
                lineHeight: 1.65,
                marginBottom: 18,
              }}
            >
              {renderText(result.copy)} {getActionCopy(result)}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <ShieldCheck size={18} color="#2563eb" style={{ marginTop: 3, flexShrink: 0 }} />
              <div>
                <div style={{ color: theme.text, fontWeight: 900, fontSize: 22, marginBottom: 6 }}>Tu siguiente paso</div>
                <div style={{ color: theme.muted, lineHeight: 1.65 }}>
                  Tu siguiente paso no es hacerlo perfecto. Tu siguiente paso es empezar a frenar esto con más apoyo y más claridad. {getFirstStep(result)}
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              background: theme.mode === 'dark' ? 'rgba(15,23,42,0.76)' : 'rgba(239,246,255,0.9)',
              borderRadius: 26,
              padding: 20,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow,
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: theme.text, fontWeight: 900 }}>
              <Sparkles size={16} color="#2563eb" />
              Con tu resultado, puede hacerte bien sumar más apoyo
            </div>
            <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 12 }}>
              Tu versión actual te ayuda a empezar.
            </div>
            <div style={{ color: theme.muted, lineHeight: 1.65 }}>
              STOP PRO puede acompañarte mejor cuando sabes que esto ya te está costando más.
            </div>
          </section>

          <section
            style={{
              background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : '#f8fafc',
              borderRadius: 26,
              padding: 20,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow,
              marginBottom: 22,
            }}
          >
            <div style={{ color: theme.text, fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Sobre esta evaluación</div>
            <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
              Esta lectura se basa en tus respuestas y no reemplaza una evaluación médica o psicológica. Si sientes que necesitas ayuda urgente, busca apoyo profesional.
            </div>
            <button
              type="button"
              style={{
                border: 'none',
                padding: 0,
                background: 'transparent',
                color: '#2563eb',
                fontWeight: 900,
                fontSize: 15,
              }}
            >
              Ver recursos oficiales de apoyo →
            </button>
          </section>

          <div style={{ display: 'grid', gap: 12 }}>
            <button
              type="button"
              onClick={() => onContinue(finalPayload)}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: 24,
                padding: '16px 18px',
                background: 'linear-gradient(145deg, #2563eb 0%, #38bdf8 100%)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 900,
                boxShadow: '0 20px 45px rgba(37,99,235,0.24)',
              }}
            >
              Ver mi plan
            </button>
            <button
              type="button"
              onClick={() => onOpenPremium(finalPayload)}
              style={{
                width: '100%',
                border: `1px solid ${theme.border}`,
                borderRadius: 24,
                padding: '15px 18px',
                background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : '#ffffff',
                color: theme.text,
                fontSize: 16,
                fontWeight: 800,
                boxShadow: theme.shadow,
              }}
            >
              Conocer STOP PRO
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px 40px', background: theme.canvas, transition: theme.transition }}>
      <style>{`@keyframes stopFadeUp { 0% { opacity: 0; transform: translateY(12px) scale(0.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } } @keyframes stopSoftPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }`}</style>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: theme.hero,
            color: '#fff',
            borderRadius: 34,
            padding: 24,
            boxShadow: theme.shadow,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -36,
              right: -20,
              width: 170,
              height: 170,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 70%)',
            }}
          />
          {questionIndex > 0 && (
            <button
              type="button"
              onClick={() => setQuestionIndex((current) => current - 1)}
              style={{
                position: 'absolute',
                top: 18,
                left: 18,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.10)',
                color: '#fff',
                width: 38,
                height: 38,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                backdropFilter: 'blur(10px)',
              }}
              aria-label="Volver a la pregunta anterior"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14, marginLeft: questionIndex > 0 ? 48 : 0 }}>
            <Sparkles size={16} color="#bfdbfe" />
            Screening
          </div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.03 }}>Ahora vamos a entender mejor tu situación</h1>
          <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>
            Este paso nos ayuda a darte un apoyo más claro y un plan más ajustado a lo que necesitas hoy.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 22, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ color: '#dbeafe', fontSize: 13, fontWeight: 800 }}>Pregunta {questionIndex + 1} de {pgsiQuestions.length}</div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>{progress}%</div>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #93c5fd 0%, #34d399 100%)' }} />
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {pgsiQuestions.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === questionIndex ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: index === questionIndex ? '#2563eb' : theme.mode === 'dark' ? 'rgba(255,255,255,0.14)' : '#cbd5e1',
                transition: theme.transition,
                animation: index === questionIndex ? 'stopSoftPulse 380ms ease' : 'none',
              }}
            />
          ))}
        </div>

        <section
          style={{
            background: theme.surface,
            borderRadius: 28,
            padding: 22,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
            opacity: isAdvancing ? 0.56 : 1,
            transform: isAdvancing ? 'translateY(8px) scale(0.992)' : 'translateY(0) scale(1)',
            transition: 'opacity 180ms ease, transform 180ms ease',
          }}
        >
          <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.4, marginBottom: 10 }}>
            PREGUNTA {questionIndex + 1}
          </div>
          <div style={{ color: theme.text, fontSize: 28, fontWeight: 900, lineHeight: 1.12, marginBottom: 10 }}>
            {renderText(currentQuestion.question)}
          </div>
          <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 16 }}>
            No reemplaza ayuda profesional, pero sí nos da una base más firme para orientarte mejor.
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {pgsiOptions.map((option) => (
              <OptionButton
                key={option.value}
                option={option}
                selected={currentAnswer === option.value}
                onClick={() => handleSelectAnswer(option.value)}
                theme={theme}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
