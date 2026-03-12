import { ArrowLeft, Bot, CalendarClock, Gem, LockKeyhole, Sparkles, ShieldCheck } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'

const premiumFeatures = [
  'IA que interpreta tus mensajes y refuerza tu razón personal para dejar de apostar.',
  'Horarios de riesgo según el deporte que más te gatilla, como NBA, tenis o fútbol.',
  'Bloqueo inteligente en momentos críticos y sugerencias de modo protegido.',
  'Dashboard real de tiempo atrapado, impulsos y páginas gatillo.',
]

export default function Premium({ profile, onBack, onOpenEducation, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 40px', background: theme.canvas }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={onBack} style={{ border: `1px solid ${theme.border}`, background: theme.surface, backdropFilter: 'blur(14px)', color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={14} />
            Volver
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: theme.hero, color: '#fff', borderRadius: 34, padding: 24, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ position: 'absolute', top: -36, right: -28, width: 160, height: 160, background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 70%)', borderRadius: '50%' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
            <Gem size={16} color="#fcd34d" />
            STOP PRO
          </div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.02 }}>Recuperación guiada de verdad</h1>
          <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>Premium no es solo más información. Es una capa de acompañamiento, prevención y bloqueo pensada para tu tipo de riesgo: {profile.sportFocus} + {profile.mainTrigger}.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 24, padding: 16, backdropFilter: 'blur(14px)' }}><div style={{ fontSize: 13, color: '#bfdbfe', marginBottom: 6 }}>Mensual</div><div style={{ fontSize: 30, fontWeight: 900 }}>$990</div><div style={{ color: '#dbeafe', fontSize: 13 }}>/ mes</div></div>
            <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 24, padding: 16, backdropFilter: 'blur(14px)' }}><div style={{ fontSize: 13, color: '#bfdbfe', marginBottom: 6 }}>Anual</div><div style={{ fontSize: 30, fontWeight: 900 }}>$9.990</div><div style={{ color: '#dbeafe', fontSize: 13 }}>ahorro real</div></div>
          </div>
        </section>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          {premiumFeatures.map((item, index) => (
            <section key={item} style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 26, padding: 20, boxShadow: theme.shadow, border: `1px solid ${theme.border}` }}>
              <div style={{ width: 46, height: 46, borderRadius: 16, background: index % 2 === 0 ? '#eff6ff' : '#ecfeff', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                {index === 0 ? <Bot size={20} color="#1d4ed8" /> : index === 1 ? <CalendarClock size={20} color="#0f766e" /> : index === 2 ? <LockKeyhole size={20} color="#7c3aed" /> : <ShieldCheck size={20} color="#0f766e" />}
              </div>
              <div style={{ color: theme.text, fontWeight: 800, lineHeight: 1.55 }}>{item}</div>
            </section>
          ))}
        </div>

        <section style={{ background: theme.info, borderRadius: 24, padding: 20, color: theme.infoText, lineHeight: 1.6, marginBottom: 18, border: theme.mode === 'dark' ? '1px solid rgba(125,211,252,0.18)' : '1px solid rgba(125,211,252,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontWeight: 800 }}>
            <Sparkles size={18} />
            Lo que ya se ve venir
          </div>
          Si nos dices que tus recaídas pasan con NBA o tenis, Premium puede detectar jornadas más sensibles, horarios peligrosos y ayudarte a armar un plan concreto para no volver a caer en ese círculo.
        </section>

        <button type="button" style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 800, boxShadow: '0 20px 45px rgba(29,78,216,0.22)', marginBottom: 12 }}>
          Unirme a STOP PRO
        </button>

        <button type="button" onClick={onOpenEducation} style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 24, padding: '14px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800 }}>
          Ver biblioteca primero
        </button>
      </div>
    </div>
  )
}