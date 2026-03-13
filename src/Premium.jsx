import { useState } from 'react'
import { ArrowLeft, Bot, CalendarClock, Gem, LockKeyhole, ShieldCheck, Sparkles, Star, TrendingUp } from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'

const premiumFeatures = [
  {
    icon: Bot,
    title: 'Un asistente que sí te conoce',
    text: 'Recuerda tu motivo, entiende mejor tus recaídas y te responde con más calma cuando más lo necesitas.',
    tone: '#2563eb',
  },
  {
    icon: CalendarClock,
    title: 'Alertas antes de los momentos difíciles',
    text: 'Te avisa antes de partidos, torneos o franjas horarias que suelen encender el impulso.',
    tone: '#0f766e',
  },
  {
    icon: LockKeyhole,
    title: 'Bloqueo y modo protegido',
    text: 'El bloqueo de apps, sitios de apuestas y jornadas sensibles queda reservado para STOP PRO.',
    tone: '#1d4ed8',
  },
  {
    icon: ShieldCheck,
    title: 'Tu proceso mucho más claro',
    text: 'Las estadísticas de tiempo perdido por páginas, uso y señales de recaída son exclusivas de STOP PRO.',
    tone: '#0f766e',
  },
]

const previewStats = [
  {
    value: '71%',
    label: 'logra sostener su primera semana',
    note: 'Vista previa del tipo de métrica que podrías seguir con una versión más completa.',
  },
  {
    value: '2,4x',
    label: 'más check-ins completados',
    note: 'Cuando el plan se siente más personal, es más fácil volver y sostenerlo.',
  },
  {
    value: '3 capas',
    label: 'de protección inteligente',
    note: 'Antes del gatillo, durante el impulso y cuando el día termina.',
  },
]

const premiumMoments = [
  'Antes del partido: te avisa que viene una franja sensible.',
  'Durante el impulso: te da una salida concreta en vez de dejarte improvisando.',
  'Después: transforma lo que pasó en información útil, no en culpa.',
]

const comparisonRows = [
  { label: 'Botón de crisis', current: 'Básico', pro: 'Más contexto y apoyo' },
  { label: 'Asistente', current: 'Básico', pro: 'Personalizado y con memoria' },
  { label: 'Bloqueo de apps y sitios', current: 'No incluido', pro: 'Incluido' },
  { label: 'Tiempo perdido por páginas', current: 'No incluido', pro: 'Incluido' },
  { label: 'Alertas de riesgo', current: 'Generales', pro: 'Antes de jornadas sensibles' },
]

const yearlyMonthlyEquivalent = Math.round(9990 / 12)
const yearlySavings = 990 * 12 - 9990

function TabButton({ active, label, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? `1px solid ${theme.mode === 'dark' ? 'rgba(147,197,253,0.18)' : 'rgba(59,130,246,0.14)'}` : '1px solid transparent',
        borderRadius: 18,
        padding: '12px 14px',
        background: active ? theme.segmentedActive : theme.segmentedIdle,
        color: active ? '#fff' : theme.text,
        fontWeight: 800,
        boxShadow: active ? (theme.mode === 'dark' ? '0 12px 28px rgba(14,165,233,0.16)' : '0 12px 28px rgba(37,99,235,0.12)') : 'none',
        transition: theme.transition,
      }}
    >
      {label}
    </button>
  )
}

export default function Premium({ profile, currentScreen = 'premium', onNavigate, onBack, onOpenEducation, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [activeTab, setActiveTab] = useState('overview')
  const border = `1px solid ${theme.border}`
  const cardSurface = theme.mode === 'dark' ? 'rgba(15,23,42,0.74)' : '#f8fafc'
  const proAccent = '#2563eb'
  const supportAccent = '#0f766e'
  const baseCard = {
    background: theme.surface,
    backdropFilter: 'blur(16px)',
    borderRadius: 28,
    padding: 20,
    boxShadow: theme.shadow,
    border,
    transition: theme.transition,
  }

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={onBack} style={{ border, background: theme.surface, color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: theme.shadow, transition: theme.transition }}>
            <ArrowLeft size={14} />
            Volver
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: theme.hero, color: '#fff', borderRadius: 36, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.04), transparent 38%)' }} />
          <div style={{ position: 'absolute', top: -44, right: -24, width: 170, height: 170, background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 72%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', borderRadius: 999, padding: '8px 12px', marginBottom: 14 }}>
              <Gem size={16} color="#93c5fd" />
              STOP PRO
            </div>
            <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.02 }}>Más apoyo cuando más lo necesitas</h1>
            <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>
              STOP PRO está pensado para cuando ya no quieres depender solo de fuerza de voluntad. Te ayuda a anticiparte,
              sostenerte y entender mejor lo que te pasa.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 24, padding: 16, backdropFilter: 'blur(14px)' }}>
                <div style={{ fontSize: 13, color: '#bfdbfe', marginBottom: 6 }}>Mensual</div>
                <div style={{ fontSize: 30, fontWeight: 900 }}>$990</div>
                <div style={{ color: '#dbeafe', fontSize: 13 }}>/ mes</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 24, padding: 16, backdropFilter: 'blur(14px)' }}>
                <div style={{ fontSize: 13, color: '#bfdbfe', marginBottom: 6 }}>Anual</div>
                <div style={{ fontSize: 30, fontWeight: 900 }}>$9.990</div>
                <div style={{ color: '#dbeafe', fontSize: 13 }}>equivale a ~$${yearlyMonthlyEquivalent}/mes</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 18, padding: '14px 16px', color: '#fff', lineHeight: 1.55 }}>
              <div style={{ fontWeight: 900, marginBottom: 4 }}>Con el plan anual ahorras $${yearlySavings.toLocaleString('es-CL')}</div>
              <div style={{ color: '#dbeafe', fontSize: 13 }}>Pagando el año completo te sale más barato que ir mes a mes.</div>
            </div>
          </div>
        </section>

        <section style={{ ...baseCard, marginBottom: 18, padding: 10, background: theme.segmentedSurface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <TabButton active={activeTab === 'overview'} label="Qué incluye" onClick={() => setActiveTab('overview')} theme={theme} />
            <TabButton active={activeTab === 'pricing'} label="Precios y ahorro" onClick={() => setActiveTab('pricing')} theme={theme} />
          </div>
        </section>

        {activeTab === 'overview' ? (
          <>
            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Star size={18} color={proAccent} />
                <div style={{ color: theme.text, fontWeight: 800 }}>Comparación simple</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
                La idea es simple: tu versión actual te acompaña en lo esencial. STOP PRO suma la parte más profunda,
                preventiva y personalizada.
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.95fr 1fr', gap: 10, alignItems: 'center', padding: '0 4px 2px' }}>
                  <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>FUNCIÓN</div>
                  <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>ACTUAL</div>
                  <div style={{ color: proAccent, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>STOP PRO</div>
                </div>
                {comparisonRows.map((row) => (
                  <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.95fr 1fr', gap: 10, alignItems: 'center', background: cardSurface, borderRadius: 18, padding: '14px 16px', border, transition: theme.transition }}>
                    <div style={{ color: theme.text, fontWeight: 800 }}>{row.label}</div>
                    <div style={{ color: theme.muted, fontSize: 13, fontWeight: 700 }}>{row.current}</div>
                    <div style={{ color: proAccent, fontWeight: 800, fontSize: 13 }}>{row.pro}</div>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              {premiumFeatures.map(({ icon: Icon, title, text, tone }) => (
                <section key={title} style={baseCard}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: `${tone}18`, display: 'grid', placeItems: 'center', marginBottom: 12, transition: theme.transition }}>
                    <Icon size={20} color={tone} />
                  </div>
                  <div style={{ color: theme.text, fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{title}</div>
                  <div style={{ color: theme.muted, lineHeight: 1.6 }}>{text}</div>
                </section>
              ))}
            </div>

            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme.text, fontWeight: 800, marginBottom: 10 }}>
                <Star size={16} color={supportAccent} />
                Así se vería en tu caso
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 14 }}>
                Si hoy tus recaídas se activan con {profile.sportFocus || 'deportes o juego online'}, STOP PRO puede ayudarte a llegar antes al problema, no solo reaccionar cuando ya estás adentro.
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {premiumMoments.map((item) => (
                  <div key={item} style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.5, transition: theme.transition }}>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <TrendingUp size={18} color={proAccent} />
                <div style={{ color: theme.text, fontWeight: 800 }}>Lo que podrías empezar a ver con más apoyo</div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {previewStats.map((item) => (
                  <div key={item.label} style={{ background: cardSurface, borderRadius: 20, padding: 16, border, transition: theme.transition }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 30, fontWeight: 900, color: theme.text }}>{item.value}</div>
                      <div style={{ color: theme.text, fontWeight: 800 }}>{item.label}</div>
                    </div>
                    <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.55 }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: theme.info, borderRadius: 24, padding: 20, color: theme.infoText, lineHeight: 1.6, marginBottom: 18, border: theme.mode === 'dark' ? '1px solid rgba(125,211,252,0.18)' : '1px solid rgba(125,211,252,0.24)', transition: theme.transition }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontWeight: 800 }}>
                <Sparkles size={18} />
                Lo exclusivo de STOP PRO
              </div>
              El bloqueo de apps y sitios, las estadísticas de tiempo perdido por páginas y una lectura mucho más profunda
              de tus horarios de riesgo están pensados como parte exclusiva de STOP PRO.
            </section>

            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <CalendarClock size={18} color={supportAccent} />
                <div style={{ color: theme.text, fontWeight: 800 }}>Elegir el año hace más sentido si ya te decidiste</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
                Si sabes que quieres sostener esto, el plan anual te baja el costo mensual y te ahorra dinero real frente al pago mes a mes.
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 800 }}>Pagando mensual durante 12 meses: $11.880</div>
                <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 800 }}>Pagando anual: $9.990</div>
                <div style={{ background: theme.mode === 'dark' ? 'rgba(15,118,110,0.18)' : '#dcfce7', borderRadius: 18, padding: '14px 16px', border, color: supportAccent, fontWeight: 900 }}>
                  Ahorro total: $${yearlySavings.toLocaleString('es-CL')}
                </div>
              </div>
            </section>
          </>
        )}

        <button type="button" style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: 'linear-gradient(145deg, #0b1220 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 800, boxShadow: '0 22px 50px rgba(29,78,216,0.24)', marginBottom: 12, transition: theme.transition }}>
          Quiero probar STOP PRO
        </button>

        <button type="button" onClick={onOpenEducation} style={{ width: '100%', border, borderRadius: 24, padding: '14px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, boxShadow: theme.shadow, transition: theme.transition, marginBottom: 8 }}>
          Ver biblioteca primero
        </button>
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
