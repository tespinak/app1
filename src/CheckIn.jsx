import { ArrowLeft, CheckCircle2, Frown, Meh, Smile } from 'lucide-react'
import { useMemo, useState } from 'react'
import BottomNav from './BottomNav.jsx'
import { hasCheckedInToday } from './storage.js'
import { getTheme } from './theme.js'

const moods = [
  { id: 'great', label: 'Muy bien', color: '#10b981', icon: Smile },
  { id: 'okay', label: 'Normal', color: '#2563eb', icon: Meh },
  { id: 'struggling', label: 'Con dificultad', color: '#ef4444', icon: Frown },
]

const triggerOptions = ['Estrés financiero', 'Aburrimiento', 'Presión social', 'Emociones fuertes', 'Publicidad', 'Ninguno hoy']

function getMoodScore(mood, urgeLevel) {
  if (urgeLevel >= 8) return 8
  if (urgeLevel >= 5) return 5
  if (urgeLevel >= 1) return 3
  if (mood === 'struggling') return 6
  if (mood === 'okay') return 4
  return 2
}

function StepBar({ step, theme }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 999,
            background: item <= step ? theme.segmentedActive : theme.border,
            transition: theme.transition,
          }}
        />
      ))}
    </div>
  )
}

export default function CheckIn({ profile, currentScreen = 'checkin', onNavigate, onBack, onSubmit, themeMode }) {
  const theme = getTheme(themeMode)
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`
  const checkedIn = hasCheckedInToday(profile)
  const [step, setStep] = useState(1)
  const [mood, setMood] = useState(null)
  const [selectedTriggers, setSelectedTriggers] = useState([])
  const [urgeLevel, setUrgeLevel] = useState(Math.max(0, Math.min(10, profile.impulseWeek.at(-1) || 0)))
  const [completed, setCompleted] = useState(false)

  const urgeLabel = useMemo(() => {
    if (urgeLevel === 0) return 'Sin impulsos'
    if (urgeLevel <= 3) return 'Impulso leve'
    if (urgeLevel <= 6) return 'Impulso moderado'
    if (urgeLevel <= 9) return 'Impulso fuerte'
    return 'Impulso muy fuerte'
  }, [urgeLevel])

  const toggleTrigger = (trigger) => {
    setSelectedTriggers((current) =>
      current.includes(trigger) ? current.filter((item) => item !== trigger) : [...current, trigger],
    )
  }

  const handleComplete = () => {
    const finalIntensity = getMoodScore(mood, urgeLevel)
    const note =
      selectedTriggers.length > 0 ? `Detonantes de hoy: ${selectedTriggers.join(', ')}` : 'Sin detonantes marcados hoy.'

    setCompleted(true)

    window.setTimeout(() => {
      onSubmit(finalIntensity, note)
    }, 900)
  }

  const handleMoodSelect = (id) => {
    setMood(id)
    window.setTimeout(() => setStep(2), 140)
  }

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
      <style>{`@keyframes stopFadeUp { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              border,
              background: theme.surface,
              color: theme.text,
              borderRadius: 999,
              padding: '10px 14px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: theme.shadow,
            }}
          >
            <ArrowLeft size={14} />
            Volver
          </button>
        </div>

        <div style={{ marginBottom: 20, animation: 'stopFadeUp 260ms ease' }}>
          <h1 style={{ margin: 0, color: theme.text, fontSize: 30, lineHeight: 1.05 }}>Check-in diario</h1>
          <div style={{ color: theme.subtle, fontSize: 16, marginTop: 8 }}>Toma un momento para reflexionar</div>
          {checkedIn ? (
            <div style={{ color: theme.blue, fontSize: 13, fontWeight: 800, marginTop: 10 }}>
              Ya registraste un check-in hoy. Puedes actualizarlo si lo necesitas.
            </div>
          ) : null}
        </div>

        {!completed ? <StepBar step={step} theme={theme} /> : null}

        {completed ? (
          <section
            style={{
              background: theme.surface,
              border,
              borderRadius: 32,
              padding: '36px 24px',
              boxShadow: theme.shadow,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                background: theme.green,
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 22px 50px rgba(16,185,129,0.20)',
              }}
            >
              <CheckCircle2 size={40} color="#fff" />
            </div>
            <div style={{ color: theme.text, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Check-in completado</div>
            <div style={{ color: theme.muted, lineHeight: 1.6 }}>
              Gracias por tomarte este momento. Esto ya alimenta tu progreso y nos ayuda a detectar mejor tus días sensibles.
            </div>
          </section>
        ) : null}

        {!completed && step === 1 ? (
          <section style={{ animation: 'stopFadeUp 320ms ease' }}>
            <h2 style={{ color: theme.text, fontSize: 28, lineHeight: 1.1, margin: '0 0 8px' }}>¿Cómo te sientes hoy?</h2>
            <div style={{ color: theme.subtle, fontSize: 16, marginBottom: 24 }}>No hay respuestas correctas o incorrectas</div>
            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              {moods.map(({ id, label, color, icon: Icon }) => {
                const active = mood === id

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleMoodSelect(id)}
                    style={{
                      width: '100%',
                      padding: '18px 18px',
                      borderRadius: 26,
                      border: active ? `2px solid ${theme.blue}` : border,
                      background: active ? theme.blueSurface : theme.surface,
                      boxShadow: theme.shadow,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      color: theme.text,
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 18,
                        background: active ? color : theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Icon size={24} color={active ? '#ffffff' : color} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{label}</div>
                  </button>
                )
              })}
            </div>
          </section>
        ) : null}

        {!completed && step === 2 ? (
          <section style={{ animation: 'stopFadeUp 320ms ease' }}>
            <h2 style={{ color: theme.text, fontSize: 28, lineHeight: 1.1, margin: '0 0 8px' }}>¿Sentiste algún detonante hoy?</h2>
            <div style={{ color: theme.subtle, fontSize: 16, marginBottom: 24 }}>Puedes seleccionar varios o ninguno</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              {triggerOptions.map((trigger) => {
                const active = selectedTriggers.includes(trigger)

                return (
                  <button
                    key={trigger}
                    type="button"
                    onClick={() => toggleTrigger(trigger)}
                    style={{
                      minHeight: 58,
                      padding: '14px 12px',
                      borderRadius: 22,
                      border: active ? `2px solid ${theme.blue}` : border,
                      background: active ? theme.blueSurface : theme.surface,
                      boxShadow: theme.shadow,
                      color: theme.text,
                      fontSize: 14,
                      fontWeight: 700,
                      lineHeight: 1.35,
                    }}
                  >
                    {trigger}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  flex: 0.9,
                  border,
                  borderRadius: 22,
                  padding: '16px 18px',
                  background: theme.surface,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: 800,
                  boxShadow: theme.shadow,
                }}
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  flex: 1.4,
                  border: 'none',
                  borderRadius: 22,
                  padding: '16px 18px',
                  background: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                Continuar
              </button>
            </div>
          </section>
        ) : null}

        {!completed && step === 3 ? (
          <section style={{ animation: 'stopFadeUp 320ms ease' }}>
            <h2 style={{ color: theme.text, fontSize: 28, lineHeight: 1.1, margin: '0 0 8px' }}>¿Qué tan fuerte fue el impulso?</h2>
            <div style={{ color: theme.subtle, fontSize: 16, marginBottom: 24 }}>De 0 (ninguno) a 10 (muy fuerte)</div>

            <div
              style={{
                background: theme.surface,
                border,
                borderRadius: 30,
                padding: '28px 20px',
                boxShadow: theme.shadow,
                marginBottom: 18,
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 22 }}>
                <div style={{ color: theme.blue, fontSize: 62, fontWeight: 900, lineHeight: 1 }}>{urgeLevel}</div>
                <div style={{ color: theme.subtle, fontSize: 15, marginTop: 8 }}>{urgeLabel}</div>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={urgeLevel}
                onChange={(event) => setUrgeLevel(Number(event.target.value))}
                style={{ width: '100%', accentColor: theme.blue }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: theme.subtle, fontSize: 12 }}>
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  flex: 0.9,
                  border,
                  borderRadius: 22,
                  padding: '16px 18px',
                  background: theme.surface,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: 800,
                  boxShadow: theme.shadow,
                }}
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleComplete}
                style={{
                  flex: 1.4,
                  border: 'none',
                  borderRadius: 22,
                  padding: '16px 18px',
                  background: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                Completar check-in
              </button>
            </div>
          </section>
        ) : null}
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
