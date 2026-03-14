import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Gem,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Zap,
} from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import { getTheme } from './theme.js'
import { renderText } from './text.js'

const monthlyPrice = 1990
const yearlyPrice = 11990
const yearlyMonthlyEquivalent = Math.round(yearlyPrice / 12)
const yearlySavings = monthlyPrice * 12 - yearlyPrice

const supportLayers = [
  {
    icon: CalendarClock,
    title: 'Alertas antes de momentos difíciles',
    text: 'Te avisa antes de horarios, partidos o momentos que suelen moverte más.',
    tone: '#2563eb',
  },
  {
    icon: LockKeyhole,
    title: 'Más herramientas para poner límites',
    text: 'Suma barreras sobre apps, sitios y rutinas cuando te sientes más vulnerable.',
    tone: '#0f766e',
  },
  {
    icon: TimerReset,
    title: 'Más claridad sobre lo que te pasa',
    text: 'Te ayuda a ver cuándo se repite el patrón y qué lo está empujando.',
    tone: '#2563eb',
  },
]

function getDiagnosticTone(level) {
  if (level === 'muy alto' || level === 'alto') {
    return {
      badge: 'Esto ya merece atención',
      text: 'Con tu resultado, puede hacerte bien sumar más apoyo en los momentos en que más te cuesta.',
      surface: 'rgba(239,68,68,0.14)',
    }
  }

  if (level === 'moderado') {
    return {
      badge: 'Todavía estás a tiempo',
      text: 'Este es un buen momento para empezar con más apoyo y más claridad.',
      surface: 'rgba(245,158,11,0.16)',
    }
  }

  return {
    badge: 'Apoyo temprano',
    text: 'Todavía puedes actuar a tiempo y ordenar esto antes de que crezca más.',
    surface: 'rgba(16,185,129,0.16)',
  }
}

function TabButton({ active, label, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active
          ? `1px solid ${theme.mode === 'dark' ? 'rgba(147,197,253,0.18)' : 'rgba(59,130,246,0.16)'}`
          : '1px solid transparent',
        borderRadius: 18,
        padding: '14px 18px',
        background: active ? theme.segmentedActive : theme.segmentedIdle,
        color: active ? '#fff' : theme.text,
        fontWeight: 900,
        fontSize: 15,
        boxShadow: active
          ? theme.mode === 'dark'
            ? '0 12px 28px rgba(14,165,233,0.16)'
            : '0 12px 28px rgba(37,99,235,0.12)'
          : 'none',
        transition: theme.transition,
      }}
    >
      {label}
    </button>
  )
}

function PlanCard({ title, subtitle, price, badge, highlighted, note, theme }) {
  const border = highlighted
    ? `1px solid ${theme.blue}`
    : `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`

  return (
    <div
      style={{
        borderRadius: 32,
        padding: 22,
        border,
        background: highlighted
          ? theme.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(20,27,45,0.96) 0%, rgba(12,42,102,0.94) 100%)'
            : 'linear-gradient(145deg, #f7fbff 0%, #eef6ff 100%)'
          : theme.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(8,15,30,0.94) 0%, rgba(15,23,42,0.92) 100%)'
            : '#f8fafc',
        boxShadow: highlighted ? '0 22px 48px rgba(29,78,216,0.18)' : theme.shadow,
        transition: theme.transition,
      }}
    >
      {badge ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 999,
            padding: '8px 12px',
            background: highlighted
              ? theme.mode === 'dark'
                ? 'rgba(16,185,129,0.18)'
                : '#dcfce7'
              : theme.pill,
            color: highlighted ? theme.green : theme.subtle,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 0.4,
            marginBottom: 14,
          }}
        >
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

export default function Premium({
  profile,
  currentScreen = 'premium',
  onNavigate,
  onBack,
  onOpenProtection,
  onContinueCurrent,
  context = 'standard',
  themeMode,
}) {
  const theme = getTheme(themeMode)
  const isPostDiagnostic = context === 'post-diagnostic'
  const [activeTab, setActiveTab] = useState(isPostDiagnostic ? 'plans' : 'system')
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`
  const cardSurface = theme.mode === 'dark' ? 'rgba(15,23,42,0.78)' : '#f8fafc'
  const diagnosticTone = useMemo(() => getDiagnosticTone(profile.diagnosticLevel), [profile.diagnosticLevel])
  const focus = renderText(profile.sportFocus || profile.bettingType || 'apuestas deportivas y juego online')
  const baseCard = {
    background: theme.surface,
    borderRadius: 28,
    padding: 20,
    boxShadow: theme.shadow,
    border,
    transition: theme.transition,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '28px 20px 112px',
        background: theme.canvas,
        transition: theme.transition,
      }}
    >
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
              transition: theme.transition,
            }}
          >
            <ArrowLeft size={14} />
            {isPostDiagnostic ? 'Seguir con Actual' : 'Volver'}
          </button>
        </div>

        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #081225 0%, #17356c 48%, #2563eb 100%)',
            color: '#fff',
            borderRadius: 38,
            padding: 24,
            boxShadow: theme.shadow,
            marginBottom: 18,
            transition: theme.transition,
            animation: 'stopFadeUp 260ms ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent 38%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -44,
              right: -24,
              width: 170,
              height: 170,
              background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 72%)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -40,
              bottom: -62,
              width: 180,
              height: 180,
              background: 'radial-gradient(circle, rgba(16,185,129,0.20) 0%, rgba(16,185,129,0.03) 72%)',
              borderRadius: '50%',
            }}
          />

          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 14,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.10)',
                  borderRadius: 999,
                  padding: '8px 12px',
                  fontWeight: 800,
                }}
              >
                <Gem size={16} color="#93c5fd" />
                STOP PRO
              </div>
              {isPostDiagnostic ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: diagnosticTone.surface,
                    borderRadius: 999,
                    padding: '8px 12px',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  <Sparkles size={14} color="#fff" />
                  {diagnosticTone.badge}
                </div>
              ) : null}
            </div>

            <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.02, letterSpacing: -1.2 }}>
              Más apoyo cuando más lo necesitas.
            </h1>
            <p style={{ margin: '12px 0 18px', color: '#dbeafe', lineHeight: 1.65, fontSize: 16 }}>
              {`STOP PRO suma una capa más completa de apoyo para ayudarte a frenar antes de que el impulso te gane con ${focus}.`}
            </p>

            <div
              style={{
                background: 'rgba(255,255,255,0.10)',
                borderRadius: 24,
                padding: 18,
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6, fontSize: 17 }}>
                {isPostDiagnostic ? 'Con tu resultado, puede hacerte bien sumar más apoyo.' : 'Tu versión actual te ayuda a empezar.'}
              </div>
              <div style={{ color: '#dbeafe' }}>
                {isPostDiagnostic
                  ? diagnosticTone.text
                  : 'STOP PRO está pensado para acompañarte mejor cuando necesitas más contención, más orden y más ayuda concreta.'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {[
                ['ALERTAS', 'Más apoyo'],
                ['LÍMITES', 'Más herramientas'],
                ['CLARIDAD', 'Paso más claro'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    borderRadius: 18,
                    padding: '12px 10px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ color: '#bfdbfe', fontSize: 10, fontWeight: 900, letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...baseCard, marginBottom: 18, padding: 10, background: theme.segmentedSurface, animation: 'stopFadeUp 320ms ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <TabButton active={activeTab === 'system'} label="Más apoyo" onClick={() => setActiveTab('system')} theme={theme} />
            <TabButton active={activeTab === 'plans'} label="Planes" onClick={() => setActiveTab('plans')} theme={theme} />
          </div>
        </section>

        {activeTab === 'system' ? (
          <>
            <section
              style={{
                ...baseCard,
                marginBottom: 18,
                background: theme.mode === 'dark' ? 'rgba(15,23,42,0.88)' : 'linear-gradient(145deg, #ffffff 0%, #f6fbff 100%)',
                animation: 'stopFadeUp 380ms ease',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: theme.greenSurface,
                  color: theme.greenHover,
                  fontWeight: 900,
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                <ShieldCheck size={14} />
                Más apoyo cuando más te cuesta
              </div>
              <div style={{ color: theme.text, fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
                Ayuda más clara y más completa para los momentos difíciles
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, fontSize: 15 }}>
                La idea no es exigirte más. La idea es ayudarte a llegar mejor a esos momentos en que se hace más difícil sostenerte.
              </div>
            </section>

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              {supportLayers.map(({ icon: Icon, title, text, tone }, index) => (
                <section
                  key={title}
                  style={{
                    ...baseCard,
                    animation: `stopFadeUp ${420 + index * 40}ms ease`,
                    padding: 18,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        background: `${tone}18`,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={tone} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: theme.subtle, fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 6 }}>
                        APOYO 0{index + 1}
                      </div>
                      <div style={{ color: theme.text, fontWeight: 900, fontSize: 20, marginBottom: 6, lineHeight: 1.15 }}>{title}</div>
                      <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>{text}</div>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <section
              style={{
                ...baseCard,
                marginBottom: 18,
                background: theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(15,23,42,0.90) 0%, rgba(15,118,110,0.14) 100%)' : 'linear-gradient(145deg, #ffffff 0%, #ecfeff 100%)',
                animation: 'stopFadeUp 540ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <LockKeyhole size={18} color={theme.blue} />
                <div style={{ color: theme.text, fontWeight: 800, fontSize: 18 }}>Más herramientas para poner límites</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
                Navegador, teléfono y tiempo atrapado bajo una misma capa de apoyo más concreta.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {['Navegador', 'Teléfono', 'Tiempo atrapado'].map((item) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: 999,
                      padding: '8px 12px',
                      background: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.66)',
                      border,
                      color: theme.text,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={onOpenProtection}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: 18,
                  padding: '14px 16px',
                  background: theme.segmentedActive,
                  color: '#fff',
                  fontWeight: 900,
                  boxShadow: '0 18px 38px rgba(37,99,235,0.18)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: theme.transition,
                }}
              >
                Ver cómo funciona
                <ArrowRight size={16} />
              </button>
            </section>
          </>
        ) : (
          <>
            <section style={{ ...baseCard, marginBottom: 18, animation: 'stopFadeUp 380ms ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Gem size={18} color={theme.blue} />
                <div style={{ color: theme.text, fontWeight: 800, fontSize: 18 }}>Ver planes</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65 }}>
                No se trata de hacerlo perfecto. Se trata de darte más apoyo y más claridad cuando más lo necesitas.
              </div>
            </section>

            <section
              style={{
                ...baseCard,
                marginBottom: 18,
                background: theme.mode === 'dark' ? 'rgba(15,23,42,0.88)' : 'linear-gradient(145deg, #ffffff 0%, #f6fbff 100%)',
                animation: 'stopFadeUp 440ms ease',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: theme.greenSurface, color: theme.greenHover, fontWeight: 900, fontSize: 12, marginBottom: 12 }}>
                <Zap size={14} />
                Ahorra $11.890 al año
              </div>
              <div style={{ color: theme.text, fontSize: 24, fontWeight: 900, marginBottom: 6 }}>El anual te deja STOP PRO por menos de mil pesos al mes</div>
              <div style={{ color: theme.muted, lineHeight: 1.65 }}>
                Si ya sabes que esto no se arregla en dos semanas, el anual es la forma más simple de sostener más apoyo durante el proceso.
              </div>
            </section>

            <section style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              <PlanCard
                title="STOP PRO anual"
                subtitle="La opción más conveniente si ya decidiste tomarte esto en serio."
                price="$11.990"
                badge="Mejor valor"
                highlighted
                note={`Equivale a ~ $${yearlyMonthlyEquivalent}/mes y ahorras $${yearlySavings.toLocaleString('es-CL')} al año.`}
                theme={theme}
              />
              <PlanCard
                title="STOP PRO mensual"
                subtitle="Ideal si quieres empezar ahora y ver cómo se siente este apoyo en tu día a día."
                price="$1.990"
                note="Pago mensual. Más apoyo sin amarrarte de entrada."
                theme={theme}
              />
            </section>

            <section
              style={{
                ...baseCard,
                marginBottom: 18,
                background: theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(15,23,42,0.90) 0%, rgba(29,78,216,0.12) 100%)' : 'linear-gradient(145deg, #ffffff 0%, #eef6ff 100%)',
                animation: 'stopFadeUp 520ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <ShieldCheck size={18} color={theme.green} />
                <div style={{ color: theme.text, fontWeight: 800, fontSize: 18 }}>Qué suma STOP PRO</div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  'Más apoyo en momentos sensibles.',
                  'Más claridad sobre lo que te pasa.',
                  'Más herramientas para frenarte a tiempo.',
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      background: cardSurface,
                      borderRadius: 18,
                      padding: '14px 16px',
                      border,
                      color: theme.text,
                      fontWeight: 700,
                      lineHeight: 1.55,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <button
          type="button"
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 24,
            padding: '16px 18px',
            background: 'linear-gradient(145deg, #0b1220 0%, #1d4ed8 100%)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 900,
            boxShadow: '0 22px 50px rgba(29,78,216,0.24)',
            marginBottom: 12,
            transition: theme.transition,
          }}
        >
          Quiero probar STOP PRO
        </button>

        {isPostDiagnostic ? (
          <button
            type="button"
            onClick={onContinueCurrent}
            style={{
              width: '100%',
              border,
              borderRadius: 24,
              padding: '14px 18px',
              background: theme.surface,
              color: theme.text,
              fontSize: 15,
              fontWeight: 800,
              boxShadow: theme.shadow,
              transition: theme.transition,
              marginBottom: 8,
            }}
          >
            Ver mi plan
          </button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            style={{
              width: '100%',
              border,
              borderRadius: 24,
              padding: '14px 18px',
              background: theme.surface,
              color: theme.text,
              fontSize: 15,
              fontWeight: 800,
              boxShadow: theme.shadow,
              transition: theme.transition,
              marginBottom: 8,
            }}
          >
            Volver a mi plan base
          </button>
        )}
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
