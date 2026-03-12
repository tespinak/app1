import { ArrowRight, Clock3, Coins, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'

const ageRanges = ['18-24', '25-34', '35-44', '45+']
const spendRanges = [
  { label: 'Menos de $10.000', value: 7000, accent: 'Impacto inicial' },
  { label: '$10.000 a $25.000', value: 18000, accent: 'Ya duele' },
  { label: '$25.000 a $50.000', value: 38000, accent: 'Fuga fuerte' },
  { label: 'Más de $50.000', value: 65000, accent: 'Escala crítica' },
]
const hourRanges = [
  { label: 'Menos de 1 hora', value: 0.5, accent: 'Roce diario' },
  { label: '1 a 2 horas', value: 1.5, accent: 'Desgaste real' },
  { label: '2 a 4 horas', value: 3, accent: 'Mucho foco perdido' },
  { label: 'Más de 4 horas', value: 5, accent: 'Tu día gira en torno a esto' },
]

function StepBadge({ active, index, label, theme }) {
  return (
    <div
      style={{
        borderRadius: 22,
        padding: 14,
        background: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
        border: active ? '1px solid rgba(255,255,255,0.14)' : '1px solid transparent',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{index}</div>
      <div style={{ color: '#dbeafe', fontSize: 12, lineHeight: 1.45 }}>{label}</div>
    </div>
  )
}

function RangeCard({ option, selected, onClick, icon: Icon, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${selected ? 'rgba(59,130,246,0.28)' : theme.border}`,
        borderRadius: 22,
        padding: 16,
        textAlign: 'left',
        background: selected ? (theme.mode === 'dark' ? 'rgba(30,64,175,0.28)' : 'rgba(219,234,254,0.88)') : theme.surface,
        boxShadow: theme.shadow,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 14, display: 'grid', placeItems: 'center', background: selected ? '#1d4ed8' : theme.mode === 'dark' ? '#0f172a' : '#eff6ff' }}>
          <Icon size={18} color={selected ? '#fff' : '#1d4ed8'} />
        </div>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.5, color: selected ? '#1d4ed8' : theme.subtle }}>{option.accent.toUpperCase()}</div>
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.25, color: theme.text }}>{option.label}</div>
    </button>
  )
}

export default function Onboarding({ initialProfile, onContinue, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: initialProfile.name,
    ageRange: initialProfile.ageRange,
    reason: initialProfile.reason,
    averageSpend: initialProfile.averageSpend,
    hoursLostPerDay: initialProfile.hoursLostPerDay,
    mainTrigger: initialProfile.mainTrigger,
    goal: initialProfile.goal,
  })

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.name && form.ageRange)
    if (step === 1) return Boolean(form.averageSpend && form.hoursLostPerDay)
    return Boolean(form.reason && form.mainTrigger && form.goal)
  }, [form, step])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleNext = (event) => {
    event.preventDefault()
    if (!canContinue) return

    if (step < 2) {
      setStep((current) => current + 1)
      return
    }

    onContinue({
      ...form,
      averageSpend: Number(form.averageSpend),
      hoursLostPerDay: Number(form.hoursLostPerDay),
      motivation: `Estoy cambiando para recuperar ${form.goal.toLowerCase()} y dejar de vivir pendiente de ${form.mainTrigger}.`,
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
          <div style={{ position: 'absolute', bottom: -46, left: -26, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(16,185,129,0.03) 70%)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
            <Sparkles size={16} color="#bfdbfe" />
            STOP
          </div>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.02 }}>Construyamos tu punto de partida</h1>
          <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>
            Este inicio busca verse bien, pero también tener fundamento. Primero entendemos tu contexto, luego el costo real y después hacemos un screening serio para personalizar la app.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <StepBadge active={step === 0} index="1" label="Tu contexto" theme={theme} />
            <StepBadge active={step === 1} index="2" label="Costo diario" theme={theme} />
            <StepBadge active={step === 2} index="3" label="Motivo profundo" theme={theme} />
          </div>
        </section>

        <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, backdropFilter: 'blur(18px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Star size={16} color="#1d4ed8" />
            <div style={{ fontWeight: 800, color: theme.text }}>Una entrada más simple y más honesta</div>
          </div>
          <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>
            No te vamos a pedir números exactos al principio. Usamos rangos para bajar fricción y tener una base suficiente para mostrar progreso, tiempo perdido y señales de riesgo.
          </div>
        </section>

        <form onSubmit={handleNext} style={{ display: 'grid', gap: 14 }}>
          {step === 0 && (
            <>
              <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, backdropFilter: 'blur(18px)' }}>
                <label style={{ display: 'block', fontWeight: 800, color: theme.text, marginBottom: 8 }}>Nombre o alias</label>
                <input
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="Ej: Nico"
                  required
                  style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 18, padding: '14px 16px', background: theme.input, color: theme.text }}
                />
              </section>

              <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, backdropFilter: 'blur(18px)' }}>
                <div style={{ fontWeight: 800, color: theme.text, marginBottom: 10 }}>Etapa de vida</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ageRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => update('ageRange', range)}
                      style={{
                        border: 'none',
                        borderRadius: 999,
                        padding: '10px 14px',
                        fontWeight: 800,
                        background: form.ageRange === range ? '#1d4ed8' : theme.mode === 'dark' ? '#0f172a' : '#e2e8f0',
                        color: form.ageRange === range ? '#fff' : theme.text,
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {step === 1 && (
            <>
              <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, backdropFilter: 'blur(18px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Coins size={18} color="#1d4ed8" />
                  <div style={{ fontWeight: 800, color: theme.text }}>¿Cuánto dinero se te va normalmente?</div>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {spendRanges.map((option) => (
                    <RangeCard
                      key={option.label}
                      option={option}
                      selected={form.averageSpend === option.value}
                      onClick={() => update('averageSpend', option.value)}
                      icon={Coins}
                      theme={theme}
                    />
                  ))}
                </div>
              </section>

              <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, backdropFilter: 'blur(18px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Clock3 size={18} color="#0f766e" />
                  <div style={{ fontWeight: 800, color: theme.text }}>¿Cuánto tiempo te quita en un día normal?</div>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {hourRanges.map((option) => (
                    <RangeCard
                      key={option.label}
                      option={option}
                      selected={form.hoursLostPerDay === option.value}
                      onClick={() => update('hoursLostPerDay', option.value)}
                      icon={Clock3}
                      theme={theme}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {step === 2 && (
            <>
              <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, backdropFilter: 'blur(18px)' }}>
                <label style={{ display: 'block', fontWeight: 800, color: theme.text, marginBottom: 8 }}>Por qué quieres cambiar</label>
                <textarea
                  value={form.reason}
                  onChange={(event) => update('reason', event.target.value)}
                  placeholder="Ej: quiero dejar de vivir pendiente de partidos, recuperar foco y volver a sentirme tranquilo"
                  required
                  rows={4}
                  style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 18, padding: '14px 16px', resize: 'vertical', background: theme.input, color: theme.text, fontFamily: 'inherit' }}
                />
              </section>

              <section style={{ background: theme.surface, borderRadius: 28, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, backdropFilter: 'blur(18px)' }}>
                <label style={{ display: 'block', fontWeight: 800, color: theme.text, marginBottom: 8 }}>Qué te gatilla más</label>
                <input
                  value={form.mainTrigger}
                  onChange={(event) => update('mainTrigger', event.target.value)}
                  placeholder="Ej: cuotas en vivo, apps de resultados, partidos grandes"
                  required
                  style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 18, padding: '14px 16px', background: theme.input, color: theme.text, marginBottom: 12 }}
                />
                <label style={{ display: 'block', fontWeight: 800, color: theme.text, marginBottom: 8 }}>Qué quieres recuperar</label>
                <input
                  value={form.goal}
                  onChange={(event) => update('goal', event.target.value)}
                  placeholder="Ej: paz mental, dinero, rutina, confianza"
                  required
                  style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 18, padding: '14px 16px', background: theme.input, color: theme.text }}
                />
              </section>
            </>
          )}

          <section style={{ background: theme.info, borderRadius: 24, padding: 18, color: theme.infoText, lineHeight: 1.55, border: theme.mode === 'dark' ? '1px solid rgba(125,211,252,0.18)' : '1px solid rgba(125,211,252,0.24)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, marginBottom: 6 }}>
              <ShieldCheck size={16} />
              Esto no es solo registro
            </div>
            Tus respuestas van a personalizar el tono de STOP, el cálculo del costo real, los mensajes de crisis y el plan diario que iremos construyendo contigo.
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: step > 0 ? '0.78fr 1fr' : '1fr', gap: 10 }}>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                style={{ border: `1px solid ${theme.border}`, borderRadius: 24, padding: '16px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800 }}
              >
                Volver
              </button>
            )}
            <button
              type="submit"
              disabled={!canContinue}
              style={{
                border: 'none',
                borderRadius: 24,
                padding: '16px 18px',
                background: canContinue ? 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)' : '#94a3b8',
                color: '#fff',
                fontSize: 16,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: canContinue ? '0 20px 45px rgba(29,78,216,0.22)' : 'none',
              }}
            >
              {step === 2 ? 'Continuar al screening' : 'Seguir'}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}