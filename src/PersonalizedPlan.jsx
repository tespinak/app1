import { ArrowLeft, CalendarClock, HeartPulse, ShieldCheck, Sparkles, Target } from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import { renderText } from './text.js'
import { getTheme } from './theme.js'

function getPlanTone(profile) {
  if (profile.diagnosticBand === 'riesgo muy alto') {
    return {
      title: 'Tu plan para empezar con más claridad',
      copy: 'Basado en tu resultado, tus gatillos y lo que hoy quieres recuperar.',
      accent: '#dc2626',
      surface: 'rgba(239,68,68,0.10)',
    }
  }

  if (profile.diagnosticLevel === 'alto') {
    return {
      title: 'Tu plan para empezar con más claridad',
      copy: 'Basado en tu resultado, tus gatillos y lo que hoy quieres recuperar.',
      accent: '#ea580c',
      surface: 'rgba(249,115,22,0.12)',
    }
  }

  if (profile.diagnosticLevel === 'moderado') {
    return {
      title: 'Tu plan para empezar con más claridad',
      copy: 'Basado en tu resultado, tus gatillos y lo que hoy quieres recuperar.',
      accent: '#2563eb',
      surface: 'rgba(37,99,235,0.10)',
    }
  }

  return {
    title: 'Tu plan para empezar con más claridad',
    copy: 'Basado en tu resultado, tus gatillos y lo que hoy quieres recuperar.',
    accent: '#10b981',
    surface: 'rgba(16,185,129,0.10)',
  }
}

function buildActions(profile) {
  const focus = renderText(profile.sportFocus || profile.bettingType || 'tu principal gatillo')
  const goal = renderText((profile.goal || 'tu tranquilidad').toLowerCase())

  return [
    {
      icon: HeartPulse,
      title: 'Usa el modo crisis cuando sientas que estás perdiendo el control',
      text: 'Cuando aparezca urgencia, entra al ejercicio guiado y date al menos 3 ciclos antes de decidir cualquier cosa.',
    },
    {
      icon: CalendarClock,
      title: 'Presta atención a los momentos en que el impulso aparece con más fuerza',
      text: `Registra check-ins diarios para entender mejor lo que te pasa alrededor de ${focus}.`,
    },
    {
      icon: Target,
      title: 'Recuerda qué estás tratando de recuperar',
      text: `No se trata solo de no apostar. Se trata de recuperar ${goal} y llegar con más orden a los momentos en que más te cuesta.`,
    },
  ]
}

export default function PersonalizedPlan({ profile, currentScreen = 'home', onNavigate, onBack, onOpenPremium, themeMode }) {
  const theme = getTheme(themeMode)
  const tone = getPlanTone(profile)
  const actions = buildActions(profile)
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : theme.borderStrong || theme.border}`

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
            animation: 'stopFadeUp 260ms ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -20,
              width: 170,
              height: 170,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 70%)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14, fontWeight: 800 }}>
              <Sparkles size={16} color="#bfdbfe" />
              Plan personalizado
            </div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.02 }}>{tone.title}</h1>
            <p style={{ margin: '12px 0 14px', color: '#dbeafe', lineHeight: 1.65, fontSize: 16 }}>
              Este plan toma tu resultado y lo convierte en pasos concretos para que STOP se sienta útil desde hoy.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {[
                ['RESULTADO', renderText(profile.diagnosticBand || 'inicial')],
                ['FOCO', renderText(profile.sportFocus || profile.bettingType || 'patrón')],
                ['META', renderText(profile.goal || 'recuperar control')],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 18, padding: '12px 10px' }}>
                  <div style={{ color: '#bfdbfe', fontSize: 10, fontWeight: 900, letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: theme.surface, borderRadius: 28, padding: 22, border, boxShadow: theme.shadow, marginBottom: 18, animation: 'stopFadeUp 320ms ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: tone.surface, color: tone.accent, borderRadius: 999, padding: '8px 12px', fontWeight: 900, marginBottom: 14 }}>
            <ShieldCheck size={16} color={tone.accent} />
            Lo importante ahora
          </div>
          <div style={{ color: theme.text, fontSize: 22, fontWeight: 900, lineHeight: 1.15, marginBottom: 10 }}>
            No necesitas resolver todo de una vez.
          </div>
          <div style={{ color: theme.muted, lineHeight: 1.7 }}>
            Lo importante es empezar con pasos claros y apoyo real.
          </div>
        </section>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          {actions.map(({ icon: Icon, title, text }, index) => (
            <section key={title} style={{ background: theme.surface, borderRadius: 24, padding: 18, border, boxShadow: theme.shadow, animation: `stopFadeUp ${380 + index * 40}ms ease` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 16, background: theme.blueSurface, display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                  <Icon size={20} color={theme.blue} />
                </div>
                <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900 }}>0{index + 1}</div>
              </div>
              <div style={{ color: theme.text, fontWeight: 900, fontSize: 19, lineHeight: 1.2, marginBottom: 8 }}>{title}</div>
              <div style={{ color: theme.muted, fontSize: 15, lineHeight: 1.65 }}>{text}</div>
            </section>
          ))}
        </div>

        <section style={{ background: theme.mode === 'dark' ? 'rgba(12,18,32,0.82)' : 'linear-gradient(145deg, #ffffff 0%, #eff6ff 100%)', borderRadius: 26, padding: 20, border, boxShadow: theme.shadow, marginBottom: 18, animation: 'stopFadeUp 520ms ease' }}>
          <div style={{ color: theme.text, fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Si necesitas más apoyo, aquí entra STOP PRO</div>
          <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
            STOP PRO suma herramientas para acompañarte mejor en los momentos más difíciles y ayudarte a frenar a tiempo.
          </div>
          <button type="button" onClick={onOpenPremium} style={{ border: 'none', borderRadius: 18, padding: '14px 16px', background: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', fontWeight: 800, width: '100%' }}>
            Ver cómo funciona STOP PRO
          </button>
        </section>

        <button type="button" onClick={() => onNavigate('home')} style={{ width: '100%', border, borderRadius: 24, padding: '15px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, boxShadow: theme.shadow }}>
          Ir a mi inicio
        </button>
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
