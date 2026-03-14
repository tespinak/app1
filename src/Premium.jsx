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
    text: 'Te avisa antes de horarios, partidos o momentos que suelen costarte más.',
  },
  {
    icon: LockKeyhole,
    title: 'Más herramientas para poner límites',
    text: 'Suma barreras sobre apps, sitios y rutinas cuando te sientes más vulnerable.',
  },
  {
    icon: TimerReset,
    title: 'Una mejor lectura de tu progreso',
    text: 'Te ayuda a ver cuándo se repite el patrón y qué lo está empujando.',
  },
]

function getDiagnosticTone(level) {
  if (level === 'muy alto' || level === 'alto') {
    return {
      badge: 'Esto ya merece atención',
      text: 'Con tu resultado, puede hacerte bien sumar más apoyo en los momentos en que más te cuesta.',
    }
  }

  if (level === 'moderado') {
    return {
      badge: 'Todavía estás a tiempo',
      text: 'Este es un buen momento para empezar con más apoyo y más claridad.',
    }
  }

  return {
    badge: 'Apoyo temprano',
    text: 'Todavía puedes actuar a tiempo y ordenar esto antes de que crezca más.',
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

function LayerCard({ icon: Icon, title, text, theme }) {
  return (
    <section
      style={{
        background: theme.surface,
        borderRadius: 24,
        padding: 18,
        border: `1px solid ${theme.mode === 'dark' ? theme.border : theme.borderStrong || theme.border}`,
        boxShadow: theme.shadow,
        transition: theme.transition,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: theme.blueSurface,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={theme.blue} />
        </div>
        <div>
          <div style={{ color: theme.text, fontWeight: 900, fontSize: 19, marginBottom: 6, lineHeight: 1.15 }}>{title}</div>
          <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>{text}</div>
        </div>
      </div>
    </section>
  )
}

function PlanCard({ title, subtitle, price, note, highlighted, badge, theme }) {
  return (
    <section
      style={{
        borderRadius: 30,
        padding: 22,
        border: highlighted ? `1px solid ${theme.blue}` : `1px solid ${theme.mode === 'dark' ? theme.border : theme.borderStrong || theme.border}`,
        background: highlighted
          ? theme.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(8,15,30,0.96) 0%, rgba(22,50,92,0.92) 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #eef6ff 100%)'
          : theme.surface,
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
            padding: '8px 12px',
            borderRadius: 999,
            background: theme.greenSurface,
            color: theme.greenHover,
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
      <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 16, marginBottom: 18 }}>{subtitle}</div>
      <div style={{ color: theme.text, fontSize: 52, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.4 }}>{price}</div>
      <div style={{ color: theme.subtle, fontSize: 15, marginTop: 12, lineHeight: 1.55 }}>{note}</div>
    </section>
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
  const [activeTab, setActiveTab] = useState(isPostDiagnostic ? 'plans' : 'support')
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : theme.borderStrong || theme.border}`
  const diagnosticTone = useMemo(() => getDiagnosticTone(profile.diagnosticLevel), [profile.diagnosticLevel])
  const focus = renderText(profile.sportFocus || profile.bettingType || 'apuestas deportivas y juego online')

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
              top: -44,
              right: -24,
              width: 170,
              height: 170,
              background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 72%)',
              borderRadius: '50%',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
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
                    background: 'rgba(255,255,255,0.12)',
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

            <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.02, letterSpacing: -1.2 }}>
              Más apoyo cuando más lo necesitas.
            </h1>
            <p style={{ margin: '12px 0 16px', color: '#dbeafe', lineHeight: 1.65, fontSize: 16 }}>
              {isPostDiagnostic
                ? 'Con tu resultado, puede hacerte bien sumar más apoyo. No se trata de hacerlo perfecto. Se trata de no seguir enfrentando esto siempre de la misma manera.'
                : `STOP PRO está pensado para acompañarte mejor cuando necesitas más ayuda, más claridad y herramientas más concretas para ${focus}.`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {[
                ['ALERTAS', 'Antes del impulso'],
                ['LÍMITES', 'Cuando más te cuesta'],
                ['CLARIDAD', 'Sobre tu patrón'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    borderRadius: 18,
                    padding: '12px 10px',
                  }}
                >
                  <div style={{ color: '#bfdbfe', fontSize: 10, fontWeight: 900, letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            background: theme.segmentedSurface,
            borderRadius: 28,
            padding: 10,
            border,
            boxShadow: theme.shadow,
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <TabButton active={activeTab === 'support'} label="Más apoyo" onClick={() => setActiveTab('support')} theme={theme} />
            <TabButton active={activeTab === 'plans'} label="Planes" onClick={() => setActiveTab('plans')} theme={theme} />
          </div>
        </section>

        {activeTab === 'support' ? (
          <>
            <section
              style={{
                background: theme.mode === 'dark' ? 'rgba(12,18,32,0.88)' : 'linear-gradient(145deg, #ffffff 0%, #f6fbff 100%)',
                borderRadius: 30,
                padding: 22,
                border,
                boxShadow: theme.shadow,
                marginBottom: 18,
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
                Lo que suma STOP PRO
              </div>
              <div style={{ color: theme.text, fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
                Una capa más completa de apoyo para ayudarte a frenar a tiempo
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, fontSize: 15 }}>
                Tu versión actual puede ayudarte a empezar. STOP PRO te acompaña mejor en esos momentos en que más te cuesta sostenerte.
              </div>
            </section>

            <section
              style={{
                background: theme.surface,
                borderRadius: 28,
                padding: 18,
                border,
                boxShadow: theme.shadow,
                marginBottom: 18,
                animation: 'stopFadeUp 420ms ease',
              }}
            >
              <div style={{ color: theme.subtle, fontSize: 11, fontWeight: 900, letterSpacing: 0.4, marginBottom: 10 }}>VISTA PREVIA</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ background: theme.blueSurface, borderRadius: 18, padding: '12px 14px' }}>
                  <div style={{ color: theme.blue, fontSize: 12, fontWeight: 900, marginBottom: 4 }}>ALERTA SENSIBLE</div>
                  <div style={{ color: theme.text, fontWeight: 800, marginBottom: 4 }}>Hoy 20:30 suele ser una hora difícil para ti</div>
                  <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.5 }}>Activa un plan corto antes de que el impulso suba.</div>
                </div>
                <div style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 18, padding: '12px 14px', border }}>
                  <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, marginBottom: 4 }}>MODO PROTEGIDO</div>
                  <div style={{ color: theme.text, fontWeight: 800, marginBottom: 4 }}>Bloquea sitios y suma fricción extra</div>
                  <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.5 }}>Una capa más concreta cuando sabes que estás vulnerable.</div>
                </div>
              </div>
            </section>

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              {supportLayers.map(({ icon, title, text }, index) => (
                <div key={title} style={{ animation: `stopFadeUp ${470 + index * 40}ms ease` }}>
                  <LayerCard icon={icon} title={title} text={text} theme={theme} />
                </div>
              ))}
            </div>

            <section
              style={{
                background: theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(12,18,32,0.92) 0%, rgba(22,50,92,0.64) 100%)' : 'linear-gradient(145deg, #ffffff 0%, #eef6ff 100%)',
                borderRadius: 30,
                padding: 22,
                border,
                boxShadow: theme.shadow,
                marginBottom: 18,
                animation: 'stopFadeUp 620ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <LockKeyhole size={18} color={theme.blue} />
                <div style={{ color: theme.text, fontWeight: 900, fontSize: 20 }}>Protección real</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
                Navegador, teléfono y tiempo atrapado bajo una misma capa de apoyo más concreta.
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
                }}
              >
                Ver cómo funciona
                <ArrowRight size={16} />
              </button>
            </section>
          </>
        ) : (
          <>
            <section
              style={{
                background: theme.surface,
                borderRadius: 28,
                padding: 20,
                border,
                boxShadow: theme.shadow,
                marginBottom: 18,
                animation: 'stopFadeUp 380ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Gem size={18} color={theme.blue} />
                <div style={{ color: theme.text, fontWeight: 900, fontSize: 20 }}>Ver planes</div>
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65 }}>
                No se trata de hacerlo perfecto. Se trata de darte más apoyo y más claridad cuando más lo necesitas.
              </div>
            </section>

            <section
              style={{
                background: theme.mode === 'dark' ? 'rgba(12,18,32,0.88)' : 'linear-gradient(145deg, #ffffff 0%, #f6fbff 100%)',
                borderRadius: 30,
                padding: 22,
                border,
                boxShadow: theme.shadow,
                marginBottom: 18,
                animation: 'stopFadeUp 440ms ease',
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
                <Zap size={14} />
                Ahorra ${yearlySavings.toLocaleString('es-CL')} al año
              </div>
              <div style={{ color: theme.text, fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
                El anual te deja STOP PRO por menos de mil pesos al mes
              </div>
              <div style={{ color: theme.muted, lineHeight: 1.65 }}>
                Si ya sabes que esto no se arregla en dos semanas, el anual es la forma más simple de sostener más apoyo durante el proceso.
              </div>
            </section>

            <section style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              <PlanCard
                title="STOP PRO anual"
                subtitle="La opción más conveniente si quieres sostener este proceso con más apoyo."
                price="$11.990"
                note={`Equivale a ~ $${yearlyMonthlyEquivalent}/mes y ahorras $${yearlySavings.toLocaleString('es-CL')} al año.`}
                highlighted
                badge="Mejor valor"
                theme={theme}
              />
              <PlanCard
                title="STOP PRO mensual"
                subtitle="Una buena forma de probar esta ayuda extra y ver si te sirve."
                price="$1.990"
                note="Pago mensual. Más apoyo sin amarrarte de entrada."
                theme={theme}
              />
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
