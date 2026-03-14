import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Coins,
  Cog,
  MessageCircleHeart,
  Sparkles,
  SquarePen,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import BottomNav from './BottomNav.jsx'
import Crisis from './Crisis.jsx'
import { hasCheckedInToday } from './storage.js'
import { getTheme } from './theme.js'

const weekLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function getCurrentDateLabel() {
  return new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

function getNextMilestone(days) {
  if (days >= 180) return 365
  if (days >= 90) return 180
  if (days >= 60) return 90
  if (days >= 30) return 60
  if (days >= 14) return 30
  return 14
}

function buildRing(progress, theme) {
  const mainAngle = (progress / 100) * 360
  const accentAngle = Math.min(360, mainAngle + 14)
  return `conic-gradient(${theme.green} 0deg ${mainAngle}deg, ${theme.blue} ${mainAngle}deg ${accentAngle}deg, ${theme.ringTrack} ${accentAngle}deg 360deg)`
}

function formatCompactCurrency(value) {
  const compact = new Intl.NumberFormat('es-CL', {
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(value)

  return `$${compact.replace(/\s/g, '')}`
}

function MetricCard({ icon: Icon, tone, title, value, subtitle, theme }) {
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`

  return (
    <div
      style={{
        background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : '#ffffff',
        borderRadius: 28,
        padding: 18,
        border,
        boxShadow: theme.shadow,
        transition: theme.transition,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 16,
          display: 'grid',
          placeItems: 'center',
          background: `${tone}16`,
          marginBottom: 12,
        }}
      >
        <Icon size={20} color={tone} />
      </div>
      <div style={{ color: theme.subtle, fontSize: 11, fontWeight: 900, letterSpacing: 0.5, marginBottom: 8 }}>{title}</div>
      <div style={{ color: theme.text, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{value}</div>
      <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>{subtitle}</div>
    </div>
  )
}

function QuickAction({ icon: Icon, title, subtitle, onClick, theme, featured = false }) {
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        border,
        background: featured
          ? theme.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(15,23,42,0.94) 0%, rgba(30,41,59,0.92) 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)'
          : theme.mode === 'dark'
            ? 'rgba(15,23,42,0.82)'
            : '#ffffff',
        color: theme.text,
        borderRadius: 26,
        padding: '18px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'left',
        boxShadow: featured ? '0 20px 44px rgba(15,23,42,0.10)' : theme.shadow,
        transition: theme.transition,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 18,
          display: 'grid',
          placeItems: 'center',
          background: featured
            ? theme.mode === 'dark'
              ? 'rgba(37,99,235,0.18)'
              : '#eef4ff'
            : theme.mode === 'dark'
              ? 'rgba(37,99,235,0.14)'
              : '#eff6ff',
          flexShrink: 0,
        }}
      >
        <Icon size={21} color="#2563eb" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{title}</div>
        <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.45 }}>{subtitle}</div>
      </div>
      <ArrowRight size={18} color={theme.subtle} />
    </button>
  )
}

export default function Home({
  profile,
  currentScreen = 'home',
  onNavigate,
  themeMode = 'light',
  onOpenEducation,
  onOpenPremium,
  onOpenAssistant,
  onOpenCheckIn,
  onOpenSettings,
}) {
  const theme = getTheme(themeMode)
  const cardBorder = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`
  const [showCrisis, setShowCrisis] = useState(false)
  const checkedInToday = hasCheckedInToday(profile)
  const dateLabel = getCurrentDateLabel()
  const nextMilestone = getNextMilestone(profile.streakDays)
  const daysLeft = Math.max(0, nextMilestone - profile.streakDays)
  const milestoneProgress = Math.max(8, Math.min(100, (profile.streakDays / nextMilestone) * 100))
  const savedMoney = profile.streakDays * profile.averageSpend
  const recoveredHours = Math.round(profile.streakDays * profile.hoursLostPerDay)
  const streakRing = useMemo(() => buildRing(milestoneProgress, theme), [milestoneProgress, theme])

  const weeklyLevel = profile.impulseWeek.map((value, index) => {
    const active = index === 4
    const done = index < Math.min(profile.streakDays, 7)
    return {
      label: weekLabels[index],
      active,
      done,
      value,
    }
  })

  if (showCrisis) {
    return <Crisis isOpen={showCrisis} onClose={() => setShowCrisis(false)} profile={profile} themeMode={themeMode} />
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px 116px', background: theme.canvas, transition: theme.transition }}>
      <style>{`@keyframes stopCardFloat { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, color: theme.text, fontSize: 30, lineHeight: 1.05 }}>Hola, {profile.name}</h1>
            <div style={{ color: theme.subtle, fontSize: 15, marginTop: 6, textTransform: 'capitalize' }}>{dateLabel}</div>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            style={{
              border: cardBorder,
              background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : '#ffffff',
              color: theme.text,
              borderRadius: 999,
              padding: '10px 12px',
              display: 'grid',
              placeItems: 'center',
              boxShadow: theme.shadow,
              transition: theme.transition,
            }}
            aria-label="Abrir configuración"
          >
            <Cog size={16} />
          </button>
        </div>

        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: theme.hero,
            color: '#fff',
            borderRadius: 34,
            padding: '24px 22px 22px',
            border: cardBorder,
            boxShadow: theme.shadow,
            marginBottom: 18,
            transition: theme.transition,
            animation: 'stopCardFloat 280ms ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -34,
              right: -12,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 70%)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, color: '#dbeafe', fontSize: 13, fontWeight: 900 }}>
              <Sparkles size={14} />
              STOP
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.02, fontWeight: 900, maxWidth: 300, marginBottom: 12 }}>
              Más apoyo cuando aparecen las ganas de apostar
            </div>
            <div style={{ color: '#dbeafe', fontSize: 16, lineHeight: 1.55, marginBottom: 16 }}>
              STOP está pensado para ayudarte en esos momentos en que se hace más difícil mantener el control.
            </div>
            <div style={{ color: '#dbeafe', fontSize: 15, lineHeight: 1.6, marginBottom: 18 }}>
              No se trata solo de resistir. Se trata de tener ayuda, claridad y herramientas cuando más las necesitas.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onOpenCheckIn}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  background: '#ffffff',
                  color: '#1d4ed8',
                  padding: '12px 18px',
                  fontWeight: 900,
                  fontSize: 15,
                }}
              >
                Comenzar
              </button>
              <button
                type="button"
                onClick={onOpenPremium}
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.10)',
                  color: '#fff',
                  padding: '12px 18px',
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                Ver cómo funciona
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : '#ffffff',
            borderRadius: 34,
            padding: '24px 22px 22px',
            border: cardBorder,
            boxShadow: theme.shadow,
            marginBottom: 18,
            transition: theme.transition,
            animation: 'stopCardFloat 280ms ease',
          }}
        >
          <div
            style={{
              width: 176,
              height: 176,
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: streakRing,
              padding: 10,
              boxShadow:
                theme.mode === 'dark'
                  ? '0 24px 60px rgba(2,6,23,0.34), 0 0 18px rgba(20,184,166,0.14)'
                  : '0 18px 50px rgba(37,99,235,0.16), 0 0 18px rgba(20,184,166,0.12)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                background:
                  theme.mode === 'dark'
                    ? 'linear-gradient(180deg, rgba(8,15,30,0.96) 0%, rgba(15,23,42,0.94) 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
              }}
            >
              <div>
                <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.95, color: theme.green }}>{profile.streakDays}</div>
                <div style={{ color: theme.subtle, fontSize: 15, fontWeight: 800, marginTop: 8 }}>DÍAS</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ color: theme.text, fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Vas avanzando</div>
            <div style={{ color: theme.muted, fontSize: 16, lineHeight: 1.5 }}>
              Cada día cuenta. Este proceso no se construye de golpe, se construye paso a paso.
            </div>
          </div>

          <div
            style={{
              background: theme.mode === 'dark' ? 'rgba(15,23,42,0.68)' : '#f5fbff',
              borderRadius: 24,
              padding: 18,
              border: cardBorder,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ color: theme.muted, fontWeight: 700, fontSize: 13 }}>Próximo hito</div>
              <div style={{ color: theme.green, fontWeight: 900, fontSize: 13 }}>{nextMilestone} días</div>
            </div>
            <div style={{ height: 8, background: theme.ringTrack, borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
              <div
                style={{
                  width: `${milestoneProgress}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${theme.green} 0%, ${theme.blue} 100%)`,
                }}
              />
            </div>
            <div style={{ textAlign: 'center', color: theme.subtle, fontSize: 13 }}>
              Solo {daysLeft} días más para alcanzar tu meta
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => setShowCrisis(true)}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 26,
            padding: '18px 22px',
            background: 'linear-gradient(145deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            textAlign: 'left',
            boxShadow: '0 22px 42px rgba(239,68,68,0.26)',
            marginBottom: 18,
            transition: theme.transition,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
            <AlertCircle size={18} />
            ¿Necesitas ayuda ahora?
          </div>
          <div style={{ color: '#fee2e2', fontSize: 14 }}>Respira, baja la intensidad del momento y vuelve a enfocarte.</div>
        </button>

        <section style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CalendarDays size={16} color={theme.blue} />
            <div style={{ color: theme.text, fontSize: 18, fontWeight: 900 }}>Esta semana</div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            {weeklyLevel.map((item) => (
              <div key={`${item.label}-${item.value}`} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: 60,
                    borderRadius: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.active
                      ? theme.blue
                      : item.done
                        ? theme.greenSurface
                        : theme.mode === 'dark'
                          ? 'rgba(15,23,42,0.72)'
                          : '#f8fafc',
                    color: item.active ? '#fff' : item.done ? theme.greenHover : theme.subtle,
                    border: cardBorder,
                    boxShadow: item.active ? '0 16px 34px rgba(37,99,235,0.18)' : 'none',
                    transition: theme.transition,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{item.label}</div>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: item.active ? '#fff' : item.done ? theme.greenHover : theme.subtle,
                      marginTop: 8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 18 }}>
          <div style={{ color: theme.text, fontSize: 30, fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>Tu progreso</div>
          <div style={{ color: theme.muted, fontSize: 16, lineHeight: 1.5, marginBottom: 14 }}>El impacto de tu compromiso</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <MetricCard icon={Coins} tone={theme.green} title="DINERO RECUPERADO" value={formatCompactCurrency(savedMoney)} subtitle="CLP ahorrados" theme={theme} />
            <MetricCard icon={Clock3} tone={theme.blue} title="TIEMPO RECUPERADO" value={`${recoveredHours}h`} subtitle="Horas libres" theme={theme} />
            <MetricCard icon={Sparkles} tone={theme.blue} title="RACHA ACTUAL" value={String(profile.streakDays)} subtitle="Días consecutivos" theme={theme} />
            <MetricCard icon={CalendarDays} tone="#64748b" title="DESDE QUE INICIASTE" value={String(profile.streakDays)} subtitle="Total de días" theme={theme} />
          </div>
        </section>

        <section style={{ marginBottom: 18 }}>
          <div style={{ color: theme.text, fontSize: 20, fontWeight: 900, marginBottom: 12 }}>Acciones rápidas</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <QuickAction
              icon={SquarePen}
              title="Check-in diario"
              subtitle={checkedInToday ? 'Tu registro de hoy ya quedó guardado' : '¿Cómo te sientes hoy?'}
              onClick={onOpenCheckIn}
              theme={theme}
              featured
            />
            <QuickAction icon={BookOpen} title="Biblioteca de apoyo" subtitle="Lecturas breves y claras" onClick={onOpenEducation} theme={theme} />
            <QuickAction icon={MessageCircleHeart} title="Asistente STOP" subtitle="Un espacio para ayudarte a ordenar este momento" onClick={onOpenAssistant} theme={theme} />
          </div>
        </section>

        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: theme.hero,
            color: '#fff',
            borderRadius: 30,
            padding: 22,
            boxShadow: theme.shadow,
            marginBottom: 18,
            transition: theme.transition,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -34,
              right: -12,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 70%)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, color: '#dbeafe', fontSize: 13, fontWeight: 900 }}>
              <Sparkles size={14} />
              STOP PRO
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.02, fontWeight: 900, maxWidth: 280, marginBottom: 12 }}>
              Más apoyo para los momentos más difíciles
            </div>
            <div style={{ color: '#dbeafe', fontSize: 16, lineHeight: 1.55, marginBottom: 18 }}>
              STOP PRO suma herramientas para ayudarte a llegar mejor a esos momentos en que el impulso aparece con más fuerza.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 18 }}>
              {[
                ['APOYO', 'Más ayuda'],
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
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <button
                type="button"
                onClick={onOpenPremium}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  background: '#ffffff',
                  color: '#1d4ed8',
                  padding: '12px 18px',
                  fontWeight: 900,
                  fontSize: 15,
                }}
              >
                Ver planes
              </button>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#dbeafe', fontSize: 12 }}>Desde</div>
                <div style={{ fontSize: 28, lineHeight: 1, fontWeight: 900 }}>$999/mes</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
