import { ArrowRight, Clock3, Coins, ShieldCheck, Sparkles, Target, Trophy, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'

const slides = ['nombre', 'edad', 'dinero', 'tiempo', 'motivo', 'juego', 'impulso', 'foco', 'meta']
const ageMarks = ['18-24', '25-34', '35-44', '45+']

const spendRanges = [
  { label: 'Menos de $10.000 por semana', value: 7000 },
  { label: '$10.000 a $25.000 por semana', value: 18000 },
  { label: '$25.000 a $50.000 por semana', value: 38000 },
  { label: 'Más de $50.000 por semana', value: 65000 },
]

const timeRanges = [
  { label: 'Menos de 1 hora al día', value: 0.5 },
  { label: '1 a 2 horas al día', value: 1.5 },
  { label: '2 a 4 horas al día', value: 3 },
  { label: 'Más de 4 horas al día', value: 5 },
]

const bettingTypes = ['Apuestas deportivas', 'Tragamonedas o casino', 'Ambas']
const incitementOptions = ['Adrenalina', 'Recuperar pérdidas', 'Aburrimiento', 'Ansiedad', 'Soledad', 'Sentirme mejor rápido']
const goalOptions = ['Paz mental', 'Más dinero disponible', 'Volver a enfocarme', 'Dormir mejor', 'Recuperar confianza', 'Mejor relación con mi entorno']
const focusOptions = ['Fútbol', 'NBA', 'Tenis', 'Casino online', 'Tragamonedas', 'Otro']

const insightCards = [
  'La OMS estima que cerca del 1,2% de la población adulta mundial vive un trastorno del juego.',
  'Las personas que juegan a niveles más dañinos generan alrededor del 60% de las pérdidas que sostienen la industria.',
  'Por cada persona con juego de alto riesgo, un promedio de otras seis termina afectada también.',
]

function getAgeIndex(value) {
  const found = ageMarks.indexOf(value)
  return found >= 0 ? found : 0
}

function parseFocusValues(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function ChoiceCard({ label, selected, onClick, theme, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        border: `1px solid ${selected ? 'rgba(59,130,246,0.40)' : theme.border}`,
        borderRadius: 24,
        padding: '18px 16px',
        textAlign: 'left',
        background: selected ? (theme.mode === 'dark' ? 'rgba(29,78,216,0.24)' : '#dbeafe') : theme.surface,
        color: theme.text,
        boxShadow: selected ? '0 18px 36px rgba(29,78,216,0.18)' : theme.shadow,
        transform: selected ? 'translateY(-2px) scale(1.01)' : 'translateY(0)',
        transition: theme.transition,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            background: selected ? '#1d4ed8' : theme.mode === 'dark' ? '#0f172a' : '#eff6ff',
            transition: theme.transition,
          }}
        >
          <Icon size={18} color={selected ? '#fff' : '#1d4ed8'} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.35 }}>{label}</div>
      </div>
    </button>
  )
}

function PillGrid({ items, selectedValue, onSelect, theme }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 22,
            padding: '16px 18px',
            textAlign: 'left',
            fontWeight: 800,
            background: selectedValue === item ? '#1d4ed8' : theme.mode === 'dark' ? '#0f172a' : '#e2e8f0',
            color: selectedValue === item ? '#fff' : theme.text,
            transform: selectedValue === item ? 'translateY(-2px) scale(1.01)' : 'translateY(0)',
            boxShadow: selectedValue === item ? '0 18px 36px rgba(29,78,216,0.18)' : 'none',
            transition: theme.transition,
          }}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function MultiSelectGrid({ items, selectedValues, onToggle, theme, helper }) {
  return (
    <div>
      {helper ? <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{helper}</div> : null}
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => {
          const selected = selectedValues.includes(item)
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: 22,
                padding: '16px 18px',
                textAlign: 'left',
                fontWeight: 800,
                background: selected ? '#1d4ed8' : theme.mode === 'dark' ? '#0f172a' : '#e2e8f0',
                color: selected ? '#fff' : theme.text,
                transform: selected ? 'translateY(-2px) scale(1.01)' : 'translateY(0)',
                boxShadow: selected ? '0 18px 36px rgba(29,78,216,0.18)' : 'none',
                transition: theme.transition,
              }}
            >
              {item}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SlideShell({ theme, icon: Icon, title, subtitle, stepLabel, children }) {
  return (
    <section
      style={{
        background: theme.surface,
        borderRadius: 30,
        padding: 20,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        transition: theme.transition,
        animation: 'stopFadeUp 320ms ease',
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 11px',
            borderRadius: 999,
            background: theme.mode === 'dark' ? 'rgba(37,99,235,0.16)' : '#eff6ff',
            color: '#2563eb',
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 0.4,
            marginBottom: 12,
            transition: theme.transition,
          }}
        >
          {stepLabel}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            background: theme.mode === 'dark' ? '#0f172a' : '#eff6ff',
            marginBottom: 12,
            transition: theme.transition,
          }}
        >
          <Icon size={20} color="#1d4ed8" />
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.08, color: theme.text, marginBottom: 8 }}>{title}</div>
        <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.65 }}>{subtitle}</div>
      </div>
      {children}
    </section>
  )
}

export default function Onboarding({ initialProfile, onContinue, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [slideIndex, setSlideIndex] = useState(0)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [ageIndex, setAgeIndex] = useState(getAgeIndex(initialProfile.ageRange))
  const [form, setForm] = useState({
    name: initialProfile.name,
    ageRange: initialProfile.ageRange,
    averageSpend: initialProfile.averageSpend,
    hoursLostPerDay: initialProfile.hoursLostPerDay,
    bettingType: initialProfile.bettingType,
    sportFocus: parseFocusValues(initialProfile.sportFocus),
    reason: initialProfile.reason,
    goal: initialProfile.goal,
    incitement: initialProfile.incitement || [],
  })

  const currentSlide = slides[slideIndex]
  const progress = ((slideIndex + 1) / slides.length) * 100

  const canContinue = useMemo(() => {
    if (currentSlide === 'nombre') return Boolean(form.name)
    if (currentSlide === 'edad') return Boolean(form.ageRange)
    if (currentSlide === 'dinero') return Boolean(form.averageSpend)
    if (currentSlide === 'tiempo') return Boolean(form.hoursLostPerDay)
    if (currentSlide === 'motivo') return Boolean(form.reason)
    if (currentSlide === 'juego') return Boolean(form.bettingType)
    if (currentSlide === 'impulso') return form.incitement.length > 0
    if (currentSlide === 'foco') return form.sportFocus.length > 0
    if (currentSlide === 'meta') return Boolean(form.goal)
    return false
  }, [currentSlide, form])

  const finishOnboarding = (nextForm) => {
    const focusLabel = nextForm.sportFocus.join(', ')
    const inferredTrigger = [nextForm.bettingType, focusLabel, nextForm.incitement[0]].filter(Boolean).join(' | ')

    onContinue({
      ...nextForm,
      sportFocus: focusLabel,
      averageSpend: Number(nextForm.averageSpend),
      hoursLostPerDay: Number(nextForm.hoursLostPerDay),
      ageRange: ageMarks[ageIndex],
      mainTrigger: inferredTrigger || initialProfile.mainTrigger,
      motivation: `Estoy cambiando para recuperar ${nextForm.goal.toLowerCase()} y dejar de vivir pendiente de ${focusLabel || nextForm.bettingType.toLowerCase()}.`,
    })
  }

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const goNext = () => {
    if (slideIndex < slides.length - 1) {
      setIsAdvancing(true)
      window.setTimeout(() => {
        setSlideIndex((current) => current + 1)
        setIsAdvancing(false)
      }, 140)
      return
    }

    finishOnboarding(form)
  }

  const selectAndAdvance = (key, value) => {
    const nextForm = { ...form, [key]: value }
    setForm(nextForm)
    setIsAdvancing(true)

    window.setTimeout(() => {
      if (slideIndex < slides.length - 1) {
        setSlideIndex((current) => Math.min(current + 1, slides.length - 1))
        setIsAdvancing(false)
      } else {
        setIsAdvancing(false)
        finishOnboarding(nextForm)
      }
    }, 150)
  }

  const toggleIncitement = (label) => {
    const nextValues = form.incitement.includes(label)
      ? form.incitement.filter((item) => item !== label)
      : [...form.incitement, label].slice(-3)

    update('incitement', nextValues)

    if (!form.incitement.includes(label) && nextValues.length === 3) {
      setIsAdvancing(true)
      window.setTimeout(() => {
        setSlideIndex((current) => Math.min(current + 1, slides.length - 1))
        setIsAdvancing(false)
      }, 140)
    }
  }

  const toggleFocus = (label) => {
    const nextValues = form.sportFocus.includes(label)
      ? form.sportFocus.filter((item) => item !== label)
      : [...form.sportFocus, label].slice(-3)

    update('sportFocus', nextValues)

    if (!form.sportFocus.includes(label) && nextValues.length === 3) {
      setIsAdvancing(true)
      window.setTimeout(() => {
        setSlideIndex((current) => Math.min(current + 1, slides.length - 1))
        setIsAdvancing(false)
      }, 140)
    }
  }

  const handleAgeChange = (event) => {
    const nextIndex = Number(event.target.value)
    setAgeIndex(nextIndex)
    update('ageRange', ageMarks[nextIndex])
  }

  const handleNext = (event) => {
    event.preventDefault()
    if (!canContinue) return
    goNext()
  }

  const renderSlide = () => {
    if (currentSlide === 'nombre') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 1" icon={UserRound} title="¿Cómo quieres que te llamemos?" subtitle="Esto hace que STOP se sienta más personal desde el primer minuto.">
          <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ej: Nico" required style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 20, padding: '16px 18px', background: theme.input, color: theme.text, fontSize: 16, transition: theme.transition }} />
        </SlideShell>
      )
    }

    if (currentSlide === 'edad') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 2" icon={Target} title="¿En qué rango de edad estás?" subtitle="Nos ayuda a calibrar mejor el tono y el tipo de mensajes que pueden servirte más.">
          <div style={{ background: theme.mode === 'dark' ? '#0f172a' : '#eef2ff', borderRadius: 24, padding: 18, transition: theme.transition }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: theme.text, marginBottom: 12 }}>{ageMarks[ageIndex]}</div>
            <input type="range" min="0" max="3" step="1" value={ageIndex} onChange={handleAgeChange} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.subtle, fontSize: 11, fontWeight: 800, marginTop: 10 }}>
              {ageMarks.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </SlideShell>
      )
    }

    if (currentSlide === 'dinero') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 3" icon={Coins} title="¿Cuánto dinero se te va normalmente en una semana?" subtitle="Esto nos ayuda a estimar el costo real del hábito y mostrar mejor lo que estás recuperando.">
          <div style={{ display: 'grid', gap: 12 }}>
            {spendRanges.map((option) => (
              <ChoiceCard key={option.label} label={option.label} selected={form.averageSpend === option.value} onClick={() => selectAndAdvance('averageSpend', option.value)} theme={theme} icon={Coins} />
            ))}
          </div>
        </SlideShell>
      )
    }

    if (currentSlide === 'tiempo') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 4" icon={Clock3} title="¿Cuánto tiempo pierdes en un día normal?" subtitle="Nos referimos al tiempo revisando cuotas, estadísticas, resultados, apps de marcadores o pensando en la siguiente apuesta.">
          <div style={{ display: 'grid', gap: 12 }}>
            {timeRanges.map((option) => (
              <ChoiceCard key={option.label} label={option.label} selected={form.hoursLostPerDay === option.value} onClick={() => selectAndAdvance('hoursLostPerDay', option.value)} theme={theme} icon={Clock3} />
            ))}
          </div>
        </SlideShell>
      )
    }

    if (currentSlide === 'motivo') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 5" icon={Target} title="¿Por qué quieres cambiar esta historia?" subtitle="Escribe lo que te hizo decir basta. Esto luego nos ayuda a personalizar mejor el tono del asistente.">
          <textarea value={form.reason} onChange={(event) => update('reason', event.target.value)} placeholder="Ej: me cansé de perder foco, dinero y tranquilidad por estar pendiente del juego" required rows={5} style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 20, padding: '16px 18px', resize: 'vertical', background: theme.input, color: theme.text, fontFamily: 'inherit', fontSize: 15, transition: theme.transition }} />
        </SlideShell>
      )
    }

    if (currentSlide === 'juego') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 6" icon={Trophy} title="¿En qué tipo de juego o apuesta caes más?" subtitle="Queremos entender el contexto principal del problema para no asumir que todo pasa solo por apuestas deportivas.">
          <PillGrid items={bettingTypes} selectedValue={form.bettingType} onSelect={(value) => selectAndAdvance('bettingType', value)} theme={theme} />
        </SlideShell>
      )
    }

    if (currentSlide === 'impulso') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 7" icon={Sparkles} title="¿Qué te empuja más a apostar?" subtitle="Puedes elegir hasta 3. Esto nos ayuda a entender si el impulso viene más por ansiedad, adrenalina, aburrimiento o necesidad de recuperar pérdidas.">
          <MultiSelectGrid items={incitementOptions} selectedValues={form.incitement} onToggle={toggleIncitement} theme={theme} helper="Puedes marcar hasta 3." />
        </SlideShell>
      )
    }

    if (currentSlide === 'foco') {
      return (
        <SlideShell theme={theme} stepLabel="PREGUNTA 8" icon={Trophy} title="¿En qué deportes o tipos de juego caes más?" subtitle="Puedes elegir varias opciones. En Actual esto sirve para alertas generales; el bloqueo de apps y el seguimiento por páginas quedan para STOP PRO.">
          <MultiSelectGrid items={focusOptions} selectedValues={form.sportFocus} onToggle={toggleFocus} theme={theme} helper="Puedes marcar hasta 3. Ejemplo: NBA y Fútbol." />
        </SlideShell>
      )
    }

    return (
      <SlideShell theme={theme} stepLabel="PREGUNTA 9" icon={ShieldCheck} title="¿Qué quieres recuperar primero?" subtitle="Elige lo que más te importa hoy. Esto será parte central de los recordatorios y del progreso que te mostrará STOP.">
        <PillGrid items={goalOptions} selectedValue={form.goal} onSelect={(value) => selectAndAdvance('goal', value)} theme={theme} />
      </SlideShell>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px 40px', background: theme.canvas, transition: theme.transition }}>
      <style>{`@keyframes stopFadeUp { 0% { opacity: 0; transform: translateY(12px) scale(0.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } } @keyframes stopSoftPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }`}</style>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ color: theme.subtle, fontSize: 13, fontWeight: 800 }}>Paso {slideIndex + 1} de {slides.length}</div>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: theme.hero, color: '#fff', borderRadius: 34, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ position: 'absolute', top: -36, right: -20, width: 170, height: 170, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 70%)' }} />
          <div style={{ position: 'absolute', bottom: -46, left: -26, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(16,185,129,0.03) 70%)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
            <Sparkles size={16} color="#bfdbfe" />
            STOP
          </div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.03 }}>Construyamos tu punto de partida</h1>
          <p style={{ margin: '12px 0 14px', color: '#dbeafe', lineHeight: 1.6 }}>Una pantalla a la vez. Queremos que esto se sienta claro, guiado y fácil de responder.</p>
          <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #93c5fd 0%, #34d399 100%)' }} />
          </div>
        </section>

        <section style={{ background: theme.surface, borderRadius: 24, padding: 18, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8, color: theme.text, fontWeight: 800 }}>
            <Sparkles size={16} color="#1d4ed8" />
            Perspectiva general
          </div>
          <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14, marginBottom: 10 }}>{insightCards[Math.min(slideIndex % insightCards.length, insightCards.length - 1)]}</div>
          <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 700 }}>Fuente: OMS, hoja informativa sobre juegos de azar y apuestas, 2 de diciembre de 2024.</div>
        </section>

        <form onSubmit={handleNext} style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {slides.map((_, index) => (
              <div key={index} style={{ width: index === slideIndex ? 24 : 8, height: 8, borderRadius: 999, background: index === slideIndex ? '#2563eb' : theme.mode === 'dark' ? 'rgba(255,255,255,0.14)' : '#cbd5e1', transition: theme.transition, animation: index === slideIndex ? 'stopSoftPulse 380ms ease' : 'none' }} />
            ))}
          </div>

          <div style={{ opacity: isAdvancing ? 0.56 : 1, transform: isAdvancing ? 'translateY(8px) scale(0.992)' : 'translateY(0) scale(1)', transition: 'opacity 180ms ease, transform 180ms ease' }}>
            {renderSlide()}
          </div>

          <section style={{ background: theme.info, borderRadius: 24, padding: 18, color: theme.infoText, lineHeight: 1.55, border: theme.mode === 'dark' ? '1px solid rgba(125,211,252,0.18)' : '1px solid rgba(125,211,252,0.24)', transition: theme.transition }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, marginBottom: 6 }}>
              <ShieldCheck size={16} />
              Esto no es solo registro
            </div>
            Tus respuestas van a personalizar el tono de STOP, el cálculo del costo real, el asistente, futuras alertas y los recordatorios más sensibles a tu caso.
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: slideIndex > 0 ? '0.78fr 1fr' : '1fr', gap: 10 }}>
            {slideIndex > 0 && (
              <button type="button" onClick={() => setSlideIndex((current) => current - 1)} style={{ border: `1px solid ${theme.border}`, borderRadius: 24, padding: '16px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, transition: theme.transition }}>
                Volver
              </button>
            )}
            <button type="submit" disabled={!canContinue} style={{ border: 'none', borderRadius: 24, padding: '16px 18px', background: canContinue ? 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)' : '#94a3b8', color: '#fff', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: canContinue ? '0 20px 45px rgba(29,78,216,0.22)' : 'none', transition: theme.transition }}>
              {slideIndex === slides.length - 1 ? 'Continuar al screening' : 'Seguir'}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
