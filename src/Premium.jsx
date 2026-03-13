import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Bot,
  CalendarClock,
  Gem,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'
import { renderText } from './text.js'

const monthlyPrice = 1990
const yearlyPrice = 11990
const yearlyMonthlyEquivalent = Math.round(yearlyPrice / 12)
const yearlySavings = monthlyPrice * 12 - yearlyPrice

const premiumFeatures = [
  {
    icon: Bot,
    title: 'Asistente que recuerda tu caso',
    text: 'Habla contigo con más contexto, recuerda tu motivo y detecta mejor cuándo el impulso viene por ansiedad, torneos o ganas de recuperar.',
    tone: '#2563eb',
  },
  {
    icon: CalendarClock,
    title: 'Alertas antes de jornadas sensibles',
    text: 'Te avisa antes de horarios, partidos o torneos que suelen encender el impulso, para que llegues preparado y no tarde.',
    tone: '#0f766e',
  },
  {
    icon: LockKeyhole,
    title: 'Bloqueo y modo protegido',
    text: 'Bloqueo de apps y sitios de apuestas, con fricción real cuando más la necesitas. Esto queda reservado para STOP PRO.',
    tone: '#1d4ed8',
  },
  {
    icon: ShieldCheck,
    title: 'Estadísticas reales del daño',
    text: 'Mide tiempo perdido, páginas visitadas y señales de recaída para que el problema deje de sentirse invisible.',
    tone: '#0f766e',
  },
]

const comparisonRows = [
  { label: 'Botón de crisis', current: 'Base', pro: 'Más guiado y más profundo' },
  { label: 'Asistente', current: 'Base', pro: 'Más personal y con memoria' },
  { label: 'Bloqueo de apps y sitios', current: 'No incluido', pro: 'Incluido' },
  { label: 'Tiempo perdido por páginas', current: 'No incluido', pro: 'Incluido' },
  { label: 'Alertas de riesgo', current: 'Generales', pro: 'Antes de jornadas sensibles' },
]

const previewStats = [
  {
    value: 'Más claridad',
    label: 'sobre tu patrón real',
    note: 'Entiendes mejor qué te empuja a apostar y en qué momentos del día te desordenas más.',
  },
  {
    value: 'Más barreras',
    label: 'antes del impulso',
    note: 'No dependes solo de voluntad: llegas al gatillo con más protección y menos improvisación.',
  },
  {
    value: 'Más sostén',
    label: 'cuando vienes frágil',
    note: 'La app se vuelve más útil cuando el día viene sensible, no solo cuando todo está tranquilo.',
  },
]

const premiumMoments = [
  'Antes del partido: te avisa que viene una franja sensible.',
  'Durante el impulso: te da una salida más concreta y más personalizada.',
  'Después: transforma lo que pasó en información útil, no en culpa.',
]

function getDiagnosticTone(level) {
  if (level === 'alto') {
    return {
      label: 'Prioridad alta',
      text: 'Tu resultado sugiere que necesitas más barreras y más acompañamiento desde ahora.',
      accent: '#ef4444',
      surface: 'rgba(239,68,68,0.14)',
    }
  }

  if (level === 'moderado') {
    return {
      label: 'Conviene intervenir ya',
      text: 'Todavía estás a tiempo de cortar el patrón antes de que tome más espacio.',
      accent: '#f59e0b',
      surface: 'rgba(245,158,11,0.16)',
    }
  }

  return {
    label: 'Buen momento para afirmarte',
    text: 'Este es un buen punto para poner barreras temprano y no normalizar recaídas pequeñas.',
    accent: '#10b981',
    surface: 'rgba(16,185,129,0.16)',
  }
}

function TabButton({ active, label, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? `1px solid ${theme.mode === 'dark' ? 'rgba(147,197,253,0.18)' : 'rgba(59,130,246,0.14)'}` : '1px solid transparent',
        borderRadius: 18,
        padding: '14px 18px',
        background: active ? theme.segmentedActive : theme.segmentedIdle,
        color: active ? '#fff' : theme.text,
        fontWeight: 900,
        fontSize: 15,
        boxShadow: active ? (theme.mode === 'dark' ? '0 12px 28px rgba(14,165,233,0.16)' : '0 12px 28px rgba(37,99,235,0.12)') : 'none',
        transition: theme.transition,
      }}
    >
      {label}
    </button>
  )
}

function PlanCard({ title, subtitle, price, badge, highlighted, note, theme }) {
  return (
    <div
      style={{
        borderRadius: 30,
        padding: 22,
        border: highlighted ? '1px solid rgba(147,197,253,0.28)' : `1px solid ${theme.border}`,
        background: highlighted
          ? theme.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(15,46,114,0.9) 0%, rgba(6,28,61,0.96) 100%)'
            : 'linear-gradient(145deg, #eff6ff 0%, #ecfeff 100%)'
          : theme.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(8,15,30,0.94) 0%, rgba(15,23,42,0.92) 100%)'
            : '#f8fafc',
        boxShadow: highlighted ? '0 26px 54px rgba(29,78,216,0.18)' : theme.shadow,
        transition: theme.transition,
      }}
    >
      {badge ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '8px 12px', background: highlighted ? 'rgba(255,255,255,0.12)' : theme.pill, color: highlighted ? '#dbeafe' : theme.subtle, fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 14 }}>
          <Zap size={14} />
          {badge}
        </div>
      ) : null}
      <div style={{ color: theme.text, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>{title}</div>
      <div style={{ color: theme.muted, lineHeight: 1.65, fontSize: 17, marginBottom: 18 }}>{subtitle}</div>
      <div style={{ color: theme.text, fontSize: 52, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.5 }}>{price}</div>
      <div style={{ color: theme.subtle, fontSize: 15, marginTop: 12, lineHeight: 1.55 }}>{note}</div>
    </div>
  )
}

function PremiumStat({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 20, padding: 14 }}>
      <div style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{value}</div>
    </div>
  )
}

export default function Premium({
  profile,
  currentScreen = 'premium',
  onNavigate,
  onBack,
  onOpenEducation,
  onContinueCurrent,
  context = 'standard',
  themeMode,
  onToggleTheme,
}) {
  const theme = getTheme(themeMode)
  const isPostDiagnostic = context === 'post-diagnostic'
  const [activeTab, setActiveTab] = useState(isPostDiagnostic ? 'pricing' : 'overview')
  const border = `1px solid ${theme.border}`
  const cardSurface = theme.mode === 'dark' ? 'rgba(15,23,42,0.78)' : '#f8fafc'
  const proAccent = '#2563eb'
  const supportAccent = '#0f766e'
  const diagnosticTone = useMemo(() => getDiagnosticTone(profile.diagnosticLevel), [profile.diagnosticLevel])
  const baseCard = {
    background: theme.surface,
    borderRadius: 28,
    padding: 20,
    boxShadow: theme.shadow,
    border,
    transition: theme.transition,
  }

  const profileFocus = renderText(profile.sportFocus || 'deportes o juego online')
  const currentVersionLabel = 'Seguir con mi versión actual'

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={onBack} style={{ border, background: theme.surface, color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: theme.shadow, transition: theme.transition }}>
            <ArrowLeft size={14} />
            {isPostDiagnostic ? 'Seguir con Actual' : 'Volver'}
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: isPostDiagnostic ? 'linear-gradient(145deg, #081225 0%, #17356c 48%, #2563eb 100%)' : theme.hero, color: '#fff', borderRadius: 38, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent 38%)' }} />
          <div style={{ position: 'absolute', top: -44, right: -24, width: 170, height: 170, background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 72%)', borderRadius: '50%' }} />
          {isPostDiagnostic ? <div style={{ position: 'absolute', left: -44, bottom: -54, width: 190, height: 190, background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.02) 72%)', borderRadius: '50%' }} /> : null}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', borderRadius: 999, padding: '8px 12px', fontWeight: 800 }}>
                <Gem size={16} color="#93c5fd" />
                STOP PRO
              </div>
              {isPostDiagnostic ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: diagnosticTone.surface, borderRadius: 999, padding: '8px 12px', color: '#fff', fontWeight: 800, fontSize: 12 }}>
                  <Sparkles size={14} color="#fff" />
                  {diagnosticTone.label}
                </div>
              ) : null}
            </div>

            <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.02, letterSpacing: -1.2 }}>
              {isPostDiagnostic ? 'Tu resultado merece más apoyo y más barreras' : 'Más apoyo cuando más lo necesitas'}
            </h1>
            <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.65, fontSize: 16 }}>
              {isPostDiagnostic
                ? 'Con tu versión actual puedes empezar. Con STOP PRO puedes anticiparte mejor al impulso, entender tu patrón y activar más protección antes de caer.'
                : `Si hoy tus recaídas se activan con ${profileFocus}, STOP PRO puede ayudarte a llegar antes al problema, no solo reaccionar cuando ya estás adentro.`}
            </p>

            {isPostDiagnostic ? (
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 24, padding: 18, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 900, marginBottom: 6, fontSize: 17 }}>No se trata de hacerlo perfecto.</div>
                  <div style={{ color: '#dbeafe' }}>Se trata de dejar de pelear solo y sumar apoyo real cuando sabes que el riesgo ya existe.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                  <PremiumStat label="TU RESULTADO" value={(profile.diagnosticLevel || 'moderado').toUpperCase()} />
                  <PremiumStat label="PLAN" value="ANUAL" />
                  <PremiumStat label="AHORRO" value="$11.890" />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {isPostDiagnostic ? (
          <section style={{ ...baseCard, marginBottom: 18, background: theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(15,23,42,0.90) 0%, rgba(15,118,110,0.14) 100%)' : 'linear-gradient(145deg, #ffffff 0%, #ecfeff 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <ShieldCheck size={18} color={supportAccent} />
              <div style={{ color: theme.text, fontWeight: 800, fontSize: 17 }}>Por qué este plan tiene sentido para ti</div>
            </div>
            <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>{diagnosticTone.text}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.55, transition: theme.transition }}>
                Más barreras antes del impulso, para no depender solo de fuerza de voluntad.
              </div>
              <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.55, transition: theme.transition }}>
                Más claridad para entender tus recaídas y dejar de improvisar cuando llega el gatillo.
              </div>
              <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.55, transition: theme.transition }}>
                Más apoyo sostenido, para que STOP se sienta como una herramienta seria y no solo un recordatorio.
              </div>
            </div>
          </section>
        ) : null}

        <section style={{ ...baseCard, marginBottom: 18, padding: 10, background: theme.segmentedSurface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <TabButton active={activeTab === 'overview'} label="Qué cambia" onClick={() => setActiveTab('overview')} theme={theme} />
            <TabButton active={activeTab === 'pricing'} label="Planes y ahorro" onClick={() => setActiveTab('pricing')} theme={theme} />
          </div>
        </section>

        {activeTab === 'overview' ? (
          <>
            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Star size={18} color={proAccent} />
                <div style={{ color: theme.text, fontWeight: 800, fontSize: 17 }}>Actual vs STOP PRO</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14, fontSize: 16 }}>
                La diferencia no es tener más botones. La diferencia es tener más apoyo, más prevención y más claridad cuando el impulso aparece de verdad.
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.82fr 1fr', gap: 10, alignItems: 'center', padding: '0 4px 2px' }}>
                  <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>FUNCIÓN</div>
                  <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>ACTUAL</div>
                  <div style={{ color: proAccent, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>STOP PRO</div>
                </div>
                {comparisonRows.map((row) => (
                  <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.82fr 1fr', gap: 10, alignItems: 'center', background: cardSurface, borderRadius: 18, padding: '16px 16px', border, transition: theme.transition }}>
                    <div style={{ color: theme.text, fontWeight: 900, fontSize: 17, lineHeight: 1.2 }}>{row.label}</div>
                    <div style={{ color: theme.muted, fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>{row.current}</div>
                    <div style={{ color: proAccent, fontWeight: 900, fontSize: 15, lineHeight: 1.35 }}>{row.pro}</div>
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
                  <div style={{ color: theme.text, fontWeight: 900, fontSize: 19, marginBottom: 6 }}>{title}</div>
                  <div style={{ color: theme.muted, lineHeight: 1.65, fontSize: 15 }}>{text}</div>
                </section>
              ))}
            </div>

            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme.text, fontWeight: 800, marginBottom: 10 }}>
                <Star size={16} color={supportAccent} />
                Lo que cambia en tu día a día
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {premiumMoments.map((item) => (
                  <div key={item} style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.55, transition: theme.transition }}>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              <PlanCard
                title="STOP PRO anual"
                subtitle="La opción más inteligente si ya te decidiste a sostener esto en serio."
                price="$11.990"
                badge="Mejor valor"
                highlighted
                note={`Equivale a ~ $${yearlyMonthlyEquivalent}/mes y ahorras $${yearlySavings.toLocaleString('es-CL')} al año.`}
                theme={theme}
              />
              <PlanCard
                title="STOP PRO mensual"
                subtitle="Ideal si quieres probar la capa premium primero y luego decidir con más calma."
                price="$1.990"
                note="Pago mensual. Sin quedarte corto en soporte ni en claridad."
                theme={theme}
              />
            </section>

            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <TrendingUp size={18} color={proAccent} />
                <div style={{ color: theme.text, fontWeight: 800, fontSize: 17 }}>Lo que podrías empezar a notar con más apoyo</div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {previewStats.map((item) => (
                  <div key={item.label} style={{ background: cardSurface, borderRadius: 20, padding: 16, border, transition: theme.transition }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: theme.text }}>{item.value}</div>
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
              El bloqueo de apps y sitios, las estadísticas de tiempo perdido por páginas y la lectura más profunda de tus horarios de riesgo viven en esta capa porque apuntan a prevenir recaídas reales, no solo a mostrarte números bonitos.
            </section>
          </>
        )}

        <button type="button" style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: 'linear-gradient(145deg, #0b1220 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 900, boxShadow: '0 22px 50px rgba(29,78,216,0.24)', marginBottom: 12, transition: theme.transition }}>
          Quiero probar STOP PRO
        </button>

        {isPostDiagnostic ? (
          <button type="button" onClick={onContinueCurrent} style={{ width: '100%', border, borderRadius: 24, padding: '14px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, boxShadow: theme.shadow, transition: theme.transition, marginBottom: 8 }}>
            {currentVersionLabel}
          </button>
        ) : (
          <button type="button" onClick={onOpenEducation} style={{ width: '100%', border, borderRadius: 24, padding: '14px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, boxShadow: theme.shadow, transition: theme.transition, marginBottom: 8 }}>
            Ver biblioteca primero
          </button>
        )}
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
