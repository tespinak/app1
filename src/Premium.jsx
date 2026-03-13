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

const monthlyPrice = 1990
const yearlyPrice = 11990
const yearlyMonthlyEquivalent = Math.round(yearlyPrice / 12)
const yearlySavings = monthlyPrice * 12 - yearlyPrice

const premiumFeatures = [
  {
    icon: Bot,
    title: 'Asistente que recuerda tu caso',
    text: 'Habla contigo con m\u00e1s contexto, recuerda tu motivo y detecta mejor cu\u00e1ndo el impulso viene por ansiedad, torneos o ganas de recuperar.',
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
    text: 'Bloqueo de apps y sitios de apuestas, m\u00e1s fricci\u00f3n real cuando m\u00e1s la necesitas. Esto queda reservado para STOP PRO.',
    tone: '#1d4ed8',
  },
  {
    icon: ShieldCheck,
    title: 'Estad\u00edsticas reales del da\u00f1o',
    text: 'Mide tiempo perdido, p\u00e1ginas visitadas y se\u00f1ales de reca\u00edda para que el problema deje de sentirse invisible.',
    tone: '#0f766e',
  },
]

const comparisonRows = [
  { label: 'Bot\u00f3n de crisis', current: 'Base', pro: 'M\u00e1s guiado y m\u00e1s profundo' },
  { label: 'Asistente', current: 'Base', pro: 'M\u00e1s personal y con memoria' },
  { label: 'Bloqueo de apps y sitios', current: 'No incluido', pro: 'Incluido' },
  { label: 'Tiempo perdido por p\u00e1ginas', current: 'No incluido', pro: 'Incluido' },
  { label: 'Alertas de riesgo', current: 'Generales', pro: 'Antes de jornadas sensibles' },
]

const previewStats = [
  {
    value: 'M\u00e1s claridad',
    label: 'sobre tu patr\u00f3n real',
    note: 'Entiendes mejor qu\u00e9 te empuja a apostar y en qu\u00e9 momentos del d\u00eda te desordenas m\u00e1s.',
  },
  {
    value: 'M\u00e1s barreras',
    label: 'antes del impulso',
    note: 'No dependes solo de voluntad: llegas al gatillo con m\u00e1s protecci\u00f3n y menos improvisaci\u00f3n.',
  },
  {
    value: 'M\u00e1s sost\u00e9n',
    label: 'cuando vienes fr\u00e1gil',
    note: 'La app se vuelve m\u00e1s \u00fatil cuando el d\u00eda viene sensible, no solo cuando todo est\u00e1 tranquilo.',
  },
]

const premiumMoments = [
  'Antes del partido: te avisa que viene una franja sensible.',
  'Durante el impulso: te da una salida m\u00e1s concreta y m\u00e1s personalizada.',
  'Despu\u00e9s: transforma lo que pas\u00f3 en informaci\u00f3n \u00fatil, no en culpa.',
]

function getDiagnosticTone(level) {
  if (level === 'alto') {
    return {
      label: 'Prioridad alta',
      text: 'Tu resultado sugiere que necesitas m\u00e1s barreras y m\u00e1s acompa\u00f1amiento desde ahora.',
      accent: '#ef4444',
      surface: 'rgba(239,68,68,0.14)',
    }
  }

  if (level === 'moderado') {
    return {
      label: 'Conviene intervenir ya',
      text: 'Todav\u00eda est\u00e1s a tiempo de cortar el patr\u00f3n antes de que tome m\u00e1s espacio.',
      accent: '#f59e0b',
      surface: 'rgba(245,158,11,0.16)',
    }
  }

  return {
    label: 'Buen momento para afirmarte',
    text: 'Este es un buen punto para poner barreras temprano y no normalizar reca\u00eddas peque\u00f1as.',
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
        padding: '12px 14px',
        background: active ? theme.segmentedActive : theme.segmentedIdle,
        color: active ? '#fff' : theme.text,
        fontWeight: 800,
        boxShadow: active ? (theme.mode === 'dark' ? '0 12px 28px rgba(14,165,233,0.16)' : '0 12px 28px rgba(37,99,235,0.12)') : 'none',
        transition: theme.transition,
      }}
    >
      {decodeText(label)}
    </button>
  )
}

function PlanCard({ title, subtitle, price, badge, highlighted, note, theme }) {
  return (
    <div
      style={{
        borderRadius: 28,
        padding: 20,
        border: highlighted ? '1px solid rgba(147,197,253,0.28)' : `1px solid ${theme.border}`,
        background: highlighted
          ? theme.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(29,78,216,0.30) 0%, rgba(8,47,73,0.82) 100%)'
            : 'linear-gradient(145deg, #eff6ff 0%, #ecfeff 100%)'
          : theme.mode === 'dark'
            ? 'rgba(15,23,42,0.84)'
            : '#f8fafc',
        boxShadow: highlighted ? '0 26px 54px rgba(29,78,216,0.20)' : theme.shadow,
        transition: theme.transition,
      }}
    >
      {badge ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '7px 11px', background: highlighted ? 'rgba(255,255,255,0.16)' : theme.pill, color: highlighted ? '#dbeafe' : theme.subtle, fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 12 }}>
          <Zap size={14} />
          {badge}
        </div>
      ) : null}
      <div style={{ color: theme.text, fontWeight: 900, fontSize: 20, marginBottom: 6 }}>{decodeText(title)}</div>
      <div style={{ color: theme.muted, lineHeight: 1.55, marginBottom: 14 }}>{decodeText(subtitle)}</div>
      <div style={{ color: theme.text, fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{price}</div>
      <div style={{ color: theme.subtle, fontSize: 13, marginTop: 8 }}>{decodeText(note)}</div>
    </div>
  )
}

function PremiumStat({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 20, padding: 14 }}>
      <div style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 6 }}>{decodeText(label)}</div>
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
            {isPostDiagnostic ? 'Seguir con Actual' : 'Volver'}
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', background: isPostDiagnostic ? 'linear-gradient(145deg, #081225 0%, #17356c 48%, #2563eb 100%)' : theme.hero, color: '#fff', borderRadius: 36, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.04), transparent 38%)' }} />
          <div style={{ position: 'absolute', top: -44, right: -24, width: 170, height: 170, background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 72%)', borderRadius: '50%' }} />
          {isPostDiagnostic ? <div style={{ position: 'absolute', left: -44, bottom: -54, width: 190, height: 190, background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.02) 72%)', borderRadius: '50%' }} /> : null}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', borderRadius: 999, padding: '8px 12px' }}>
                <Gem size={16} color="#93c5fd" />
                STOP PRO
              </div>
              {isPostDiagnostic ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: diagnosticTone.surface, borderRadius: 999, padding: '8px 12px', color: '#fff', fontWeight: 800, fontSize: 12 }}>
                  <Sparkles size={14} color="#fff" />
                  {decodeText(diagnosticTone.label)}
                </div>
              ) : null}
            </div>

            <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.02 }}>
              {decodeText(isPostDiagnostic ? 'Tu resultado merece m\\u00e1s apoyo y m\\u00e1s barreras' : 'M\\u00e1s apoyo cuando m\\u00e1s lo necesitas')}
            </h1>
            <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.6 }}>
              {isPostDiagnostic
                ? 'Con tu versi\u00f3n actual puedes empezar. Con STOP PRO puedes anticiparte mejor al impulso, entender tu patr\u00f3n y activar m\u00e1s protecci\u00f3n antes de caer.'
                : 'STOP PRO est\u00e1 pensado para cuando ya no quieres depender solo de fuerza de voluntad. Te ayuda a anticiparte, sostenerte y entender mejor lo que te pasa.'}
            </p>

            {isPostDiagnostic ? (
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 24, padding: 18, lineHeight: 1.55 }}>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>No se trata de hacerlo perfecto.</div>
                  <div style={{ color: '#dbeafe' }}>Se trata de dejar de pelear solo y sumar apoyo real cuando sabes que el riesgo ya existe.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                  <PremiumStat label="TU RESULTADO" value={(profile.diagnosticLevel || 'moderado').toUpperCase()} />
                  <PremiumStat label="PLAN" value="ANUAL" />
                  <PremiumStat label="AHORRO" value="$11.890" />
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 22, padding: 16, lineHeight: 1.55 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Para tu caso actual</div>
                <div style={{ color: '#dbeafe' }}>Si hoy tus reca\u00eddas se activan con {profile.sportFocus || 'deportes o juego online'}, STOP PRO puede ayudarte a llegar antes al problema, no solo reaccionar cuando ya est\u00e1s adentro.</div>
              </div>
            )}
          </div>
        </section>

        {isPostDiagnostic ? (
          <section style={{ ...baseCard, marginBottom: 18, background: theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(15,23,42,0.88) 0%, rgba(15,118,110,0.18) 100%)' : 'linear-gradient(145deg, #ffffff 0%, #ecfeff 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <ShieldCheck size={18} color={supportAccent} />
              <div style={{ color: theme.text, fontWeight: 800 }}>{decodeText('Por qu\u00e9 este plan tiene sentido para ti')}</div>
            </div>
            <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>{decodeText(diagnosticTone.text)}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.55, transition: theme.transition }}>
                {decodeText('M\u00e1s barreras antes del impulso, para no depender solo de fuerza de voluntad.')}
              </div>
              <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.55, transition: theme.transition }}>
                {decodeText('M\u00e1s claridad para entender tus reca\u00eddas y dejar de improvisar cuando llega el gatillo.')}
              </div>
              <div style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.55, transition: theme.transition }}>
                {decodeText('M\u00e1s apoyo sostenido, para que STOP se sienta como una herramienta seria y no solo un recordatorio.')}
              </div>
            </div>
          </section>
        ) : null}

        <section style={{ ...baseCard, marginBottom: 18, padding: 10, background: theme.segmentedSurface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <TabButton active={activeTab === 'overview'} label="Qu\u00e9 cambia" onClick={() => setActiveTab('overview')} theme={theme} />
            <TabButton active={activeTab === 'pricing'} label="Planes y ahorro" onClick={() => setActiveTab('pricing')} theme={theme} />
          </div>
        </section>

        {activeTab === 'overview' ? (
          <>
            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Star size={18} color={proAccent} />
                <div style={{ color: theme.text, fontWeight: 800 }}>Actual vs STOP PRO</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
                {decodeText('La diferencia no es tener m\u00e1s botones. La diferencia es tener m\u00e1s apoyo, m\u00e1s prevenci\u00f3n y m\u00e1s claridad cuando el impulso aparece de verdad.')}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.95fr 1fr', gap: 10, alignItems: 'center', padding: '0 4px 2px' }}>
                  <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>{decodeText('FUNCI\u00d3N')}</div>
                  <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>ACTUAL</div>
                  <div style={{ color: proAccent, fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>STOP PRO</div>
                </div>
                {comparisonRows.map((row) => (
                  <div key={decodeText(row.label)} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.95fr 1fr', gap: 10, alignItems: 'center', background: cardSurface, borderRadius: 18, padding: '14px 16px', border, transition: theme.transition }}>
                    <div style={{ color: theme.text, fontWeight: 800 }}>{decodeText(row.label)}</div>
                    <div style={{ color: theme.muted, fontSize: 13, fontWeight: 700 }}>{decodeText(row.current)}</div>
                    <div style={{ color: proAccent, fontWeight: 800, fontSize: 13 }}>{decodeText(row.pro)}</div>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              {premiumFeatures.map(({ icon: Icon, title, text, tone }) => (
                <section key={decodeText(title)} style={baseCard}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: `${tone}18`, display: 'grid', placeItems: 'center', marginBottom: 12, transition: theme.transition }}>
                    <Icon size={20} color={tone} />
                  </div>
                  <div style={{ color: theme.text, fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{decodeText(title)}</div>
                  <div style={{ color: theme.muted, lineHeight: 1.6 }}>{text}</div>
                </section>
              ))}
            </div>

            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme.text, fontWeight: 800, marginBottom: 10 }}>
                <Star size={16} color={supportAccent} />
                Lo que cambia en tu d\u00eda a d\u00eda
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {premiumMoments.map((item) => (
                  <div key={decodeText(item)} style={{ background: cardSurface, borderRadius: 18, padding: '14px 16px', border, color: theme.text, fontWeight: 700, lineHeight: 1.5, transition: theme.transition }}>
                    {decodeText(item)}
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
                subtitle="La opci\u00f3n m\u00e1s inteligente si ya te decidiste a sostener esto en serio."
                price="$11.990"
                badge="Mejor valor"
                highlighted
                note={`Equivale a ~ $${yearlyMonthlyEquivalent}/mes y ahorras $${yearlySavings.toLocaleString('es-CL')} al a\u00f1o.`}
                theme={theme}
              />
              <PlanCard
                title="STOP PRO mensual"
                subtitle="Ideal si quieres probar la capa premium primero y luego decidir con m\u00e1s calma."
                price="$1.990"
                note="Pago mensual. Sin quedarte corto en soporte ni en claridad."
                theme={theme}
              />
            </section>

            <section style={{ ...baseCard, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <TrendingUp size={18} color={proAccent} />
                <div style={{ color: theme.text, fontWeight: 800 }}>{decodeText('Lo que podr\u00edas empezar a notar con m\u00e1s apoyo')}</div>
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
              {decodeText('El bloqueo de apps y sitios, las estad\u00edsticas de tiempo perdido por p\u00e1ginas y la lectura m\u00e1s profunda de tus horarios de riesgo viven en esta capa porque apuntan a prevenir reca\u00eddas reales, no solo a mostrarte n\u00fameros bonitos.')}
            </section>
          </>
        )}

        <button type="button" style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: 'linear-gradient(145deg, #0b1220 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 800, boxShadow: '0 22px 50px rgba(29,78,216,0.24)', marginBottom: 12, transition: theme.transition }}>
          Quiero probar STOP PRO
        </button>

        {isPostDiagnostic ? (
          <button type="button" onClick={onContinueCurrent} style={{ width: '100%', border, borderRadius: 24, padding: '14px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, boxShadow: theme.shadow, transition: theme.transition, marginBottom: 8 }}>
            {decodeText('Seguir con mi versi\u00f3n actual')}
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
