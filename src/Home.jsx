import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Chrome,
  Clock3,
  DollarSign,
  HeartHandshake,
  Info,
  Lock,
  MessageCircleHeart,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SquarePen,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import Crisis from './Crisis.jsx'
import { clearProfile, hasCheckedInToday } from './storage.js'
import ThemeToggle from './ThemeToggle.jsx'
import BottomNav from './BottomNav.jsx'
import { getTheme } from './theme.js'

const protectionItems = [
  { icon: Smartphone, title: 'Bloqueo móvil', text: 'Bloquear apps o sitios de apuestas en iPhone y Android durante horas de riesgo.', status: 'Próximo' },
  { icon: Chrome, title: 'Extensión Chrome', text: 'Frenar casas de apuestas, cuotas y páginas gatillo antes del clic impulsivo.', status: 'Explorando' },
  { icon: ShieldCheck, title: 'Modo protegido', text: 'Activar una barrera temporal cuando aparezca el impulso o antes de partidos clave.', status: 'MVP+' },
]

const milestones = ['7 días limpios', 'Primer fin de semana sin apostar', 'Controlaste una crisis fuerte', 'Compartiste tu avance']
const weekLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value)
}

function getAgeCopy(ageRange) {
  if (ageRange === '18-24') return 'Todavía estás a tiempo de frenar esto antes de que se convierta en un patrón más profundo.'
  if (ageRange === '25-34') return 'Este es un momento clave para cortar una conducta que puede seguir comiéndose tu energía y tu estabilidad.'
  return 'Frenar esto ahora puede devolverte aire, orden y menos ruido para la etapa que viene.'
}

function getDiagnosticTone(level) {
  if (level === 'temprano') return { label: 'riesgo temprano', color: '#0f766e' }
  if (level === 'alto') return { label: 'riesgo alto', color: '#b91c1c' }
  return { label: 'riesgo moderado', color: '#b45309' }
}

function getLevelFromStreak(days) {
  if (days >= 90) return { label: 'Leyenda', next: 180, accent: '#8b5cf6', ring: '#a78bfa' }
  if (days >= 30) return { label: 'Oro', next: 90, accent: '#d4a017', ring: '#facc15' }
  if (days >= 14) return { label: 'Plata', next: 30, accent: '#94a3b8', ring: '#cbd5e1' }
  return { label: 'Bronce', next: 14, accent: '#f59e0b', ring: '#fdba74' }
}

function getProgressToNext(days, nextGoal) {
  return Math.max(6, Math.min(100, (days / nextGoal) * 100))
}

function iconColor(theme, light = '#0f172a', dark = '#e2e8f0') {
  return theme.mode === 'dark' ? dark : light
}

function buildRing(progress, accent, theme) {
  return `conic-gradient(${accent} 0deg ${(progress / 100) * 360}deg, ${theme.ringTrack} ${(progress / 100) * 360}deg 360deg)`
}

export default function Home({ profile, currentScreen = 'home', onNavigate, themeMode = 'light', onToggleTheme, onRestartOnboarding, onOpenEducation, onOpenPremium, onOpenAssistant, onOpenCheckIn }) {
  const [showCrisis, setShowCrisis] = useState(false)
  const theme = getTheme(themeMode)

  const text = theme.text
  const muted = theme.muted
  const subtle = theme.subtle
  const border = `1px solid ${theme.border}`

  const metrics = useMemo(() => {
    const savedMoney = profile.streakDays * profile.averageSpend
    const controlScore = Math.min(10, Math.max(1, profile.checkIn))

    return [
      { icon: DollarSign, value: formatCurrency(savedMoney), label: 'Dinero protegido', color: '#2563eb', formula: `Estimado: ${profile.streakDays} días x ${formatCurrency(profile.averageSpend)} que antes se iban en apuestas o recargas impulsivas.`, badge: 'ESTIMADO' },
      { icon: Clock3, value: `${profile.streakDays * profile.hoursLostPerDay}h`, label: 'Tiempo recuperado', color: '#0f766e', formula: `Estimado: ${profile.hoursLostPerDay} horas por día que ya no se pierden entre ${profile.mainTrigger}.`, badge: 'TIEMPO' },
      { icon: TrendingUp, value: `${controlScore}/10`, label: 'Control de hoy', color: '#7c3aed', formula: 'Basado en tu diagnóstico inicial y en tu check-in actual. Mide calma, control y nivel de ruido mental.', badge: 'CHECK-IN' },
    ]
  }, [profile])

  const diagnosticTone = getDiagnosticTone(profile.diagnosticLevel)
  const level = getLevelFromStreak(profile.streakDays)
  const checkedInToday = hasCheckedInToday(profile)
  const progressToNext = getProgressToNext(profile.streakDays, level.next)
  const nextGoalDays = Math.max(0, level.next - profile.streakDays)
  const timeTrapItems = [`Tiempo viendo ${profile.mainTrigger} en navegador o apps`, 'Tiempo pendiente de apps de resultados o marcadores', `Horas atrapado pensando en ${profile.sportFocus}`]
  const reasonCards = [profile.reason, `Tu meta hoy es recuperar ${profile.goal.toLowerCase()}.`, profile.motivation]
  const streakRing = buildRing(progressToNext, level.ring, theme)

  const sectionStyle = {
    background: theme.surface,
    backdropFilter: 'blur(18px)',
    borderRadius: 30,
    padding: 22,
    border,
    boxShadow: theme.shadow,
    transition: theme.transition,
  }

  const subCardStyle = {
    background: theme.mode === 'dark' ? 'rgba(15,23,42,0.74)' : '#f8fafc',
    borderRadius: 22,
    border,
    transition: theme.transition,
  }

  const handleRestart = () => {
    clearProfile()
    onRestartOnboarding()
  }

  if (showCrisis) {
    return <Crisis isOpen={showCrisis} onClose={() => setShowCrisis(false)} profile={profile} />
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px 120px', background: theme.canvas, transition: theme.transition }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: subtle, marginBottom: 8 }}>STOP</div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1, color: text }}>Hola, {profile.name}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
            <button type="button" onClick={handleRestart} style={{ border, background: theme.surface, color: text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, boxShadow: theme.shadow, transition: theme.transition }}>
              <RefreshCcw size={14} />
              Editar
            </button>
          </div>
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 38, background: theme.heroMuted, border, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ position: 'absolute', inset: 0, background: theme.mode === 'dark' ? 'linear-gradient(180deg, rgba(37,99,235,0.10) 0%, transparent 44%)' : 'linear-gradient(180deg, rgba(37,99,235,0.08) 0%, transparent 44%)' }} />
          <div style={{ position: 'relative', padding: '24px 22px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: theme.pill, borderRadius: 999, color: theme.mode === 'dark' ? '#dbeafe' : '#1e3a8a', fontWeight: 800, transition: theme.transition }}>
                <AlertCircle size={16} />
                Racha activa
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 999, background: theme.mode === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.84)', color: text, fontWeight: 800, border, transition: theme.transition }}>
                Nivel {level.label}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 18, alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 206, height: 206, borderRadius: '50%', background: streakRing, padding: 12, boxShadow: theme.mode === 'dark' ? '0 24px 60px rgba(2,6,23,0.34)' : '0 20px 50px rgba(15,23,42,0.12)', transition: theme.transition }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: theme.mode === 'dark' ? 'linear-gradient(180deg, rgba(8,15,30,0.96) 0%, rgba(15,23,42,0.92) 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)', border: border, display: 'grid', placeItems: 'center', textAlign: 'center', transition: theme.transition }}>
                    <div>
                      <div style={{ fontSize: 60, lineHeight: 0.9, fontWeight: 900, color: text }}>{profile.streakDays}</div>
                      <div style={{ color: muted, fontSize: 16, fontWeight: 800, marginTop: 8 }}>días seguidos</div>
                      <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, background: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#eff6ff', color: theme.mode === 'dark' ? '#dbeafe' : '#1e3a8a', fontSize: 12, fontWeight: 800, transition: theme.transition }}>
                        {Math.round(progressToNext)}% al siguiente hito
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ ...subCardStyle, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: subtle, marginBottom: 8 }}>Próximo hito</div>
                  <div style={{ color: text, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{level.next} días</div>
                  <div style={{ color: muted, fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
                    {nextGoalDays === 0 ? 'Ya alcanzaste este nivel. Ahora toca sostenerlo con calma.' : `Te faltan ${nextGoalDays} días para desbloquear tu siguiente tramo.`}
                  </div>
                </div>
                <div style={{ ...subCardStyle, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: subtle, marginBottom: 8 }}>Cómo se ve hoy</div>
                  <div style={{ color: text, fontSize: 15, lineHeight: 1.65 }}>{getAgeCopy(profile.ageRange)}</div>
                </div>
              </div>
            </div>

            <div style={{ ...subCardStyle, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <div style={{ color: subtle, fontSize: 13, fontWeight: 800 }}>Semana visible</div>
                <div style={{ color: text, fontSize: 13, fontWeight: 900 }}>Ritmo de recuperación</div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                {weekLabels.map((label, index) => {
                  const filled = index < Math.min(profile.streakDays, 7)
                  return (
                    <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', margin: '0 auto 8px', background: filled ? level.ring : theme.ringTrack, boxShadow: filled ? `0 0 0 4px ${theme.mode === 'dark' ? 'rgba(167,139,250,0.12)' : 'rgba(37,99,235,0.10)'}` : 'none', transition: theme.transition }} />
                      <div style={{ color: subtle, fontSize: 11, fontWeight: 800 }}>{label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.82)', borderRadius: 20, padding: '14px 16px', border, transition: theme.transition }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                  <div style={{ color: text, fontWeight: 800 }}>Vista para compartir</div>
                  <div style={{ color: level.ring, fontSize: 12, fontWeight: 900 }}>RACHA ACTIVA</div>
                </div>
                <div style={{ color: muted, fontSize: 13, lineHeight: 1.6 }}>Llevas {profile.streakDays} días. Lo importante no es verte perfecto: es verte constante, más claro y más lejos del piloto automático.</div>
              </div>
              <div style={{ color: muted, fontSize: 13, lineHeight: 1.6 }}>Cada día que sostienes la racha vuelve más visible algo importante: sí puedes recuperar control, tiempo y dinero.</div>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <button type="button" onClick={onOpenEducation} style={{ ...sectionStyle, padding: 18, textAlign: 'left' }}>
            <BookOpen size={20} color={iconColor(theme)} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, color: text, marginBottom: 4 }}>Educación</div>
            <div style={{ color: muted, fontSize: 13, lineHeight: 1.55 }}>Lecturas breves, historias reales y claridad sobre cuotas, recaída y costo mental.</div>
          </button>
          <button type="button" onClick={onOpenPremium} style={{ border: 'none', background: theme.hero, color: '#fff', borderRadius: 30, padding: 18, textAlign: 'left', boxShadow: theme.shadow, transition: theme.transition }}>
            <Sparkles size={20} color="#fcd34d" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, marginBottom: 4 }}>Premium</div>
            <div style={{ color: '#dbeafe', fontSize: 13, lineHeight: 1.55 }}>Más prevención, mejor IA y una experiencia mucho más profunda.</div>
          </button>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <button type="button" onClick={onOpenAssistant} style={{ ...sectionStyle, padding: 18, textAlign: 'left' }}>
            <MessageCircleHeart size={20} color={theme.mode === 'dark' ? '#93c5fd' : '#1d4ed8'} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, color: text, marginBottom: 4 }}>Asistente</div>
            <div style={{ color: muted, fontSize: 13, lineHeight: 1.55 }}>Apoyo emocional contextual, con más memoria de tu proceso.</div>
          </button>
          <button type="button" onClick={onOpenCheckIn} style={{ ...sectionStyle, padding: 18, textAlign: 'left', background: checkedInToday ? (theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(5,46,22,0.86) 0%, rgba(6,78,59,0.92) 100%)' : 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)') : theme.surface }}>
            <SquarePen size={20} color={checkedInToday ? '#34d399' : iconColor(theme)} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, color: text, marginBottom: 4 }}>{checkedInToday ? 'Check-in listo' : 'Check-in diario'}</div>
            <div style={{ color: muted, fontSize: 13, lineHeight: 1.55 }}>{checkedInToday ? 'Ya registraste cómo estuvo hoy el impulso.' : 'Actualiza tu gráfico y registra novedades del día.'}</div>
          </button>
        </section>

        <section style={{ ...sectionStyle, borderRadius: 26, padding: '16px 18px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Info size={18} color={iconColor(theme, '#334155', '#cbd5e1')} />
            <div style={{ fontSize: 15, fontWeight: 800, color: text }}>Cómo leer estas métricas</div>
          </div>
          <p style={{ margin: 0, color: muted, fontSize: 14, lineHeight: 1.6 }}>Combinamos tu gasto, tus horas perdidas y tu diagnóstico para hacer visible el costo real de seguir atrapado en {profile.mainTrigger}.</p>
        </section>

        <section style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
          {metrics.map(({ icon: Icon, value, label, color, formula, badge }) => (
            <div key={label} style={{ ...sectionStyle, borderRadius: 26, padding: '18px 18px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 18, display: 'grid', placeItems: 'center', background: `${color}18`, boxShadow: `inset 0 0 0 1px ${color}20`, transition: theme.transition }}>
                    <Icon size={24} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: text }}>{value}</div>
                    <div style={{ fontSize: 14, color: subtle }}>{label}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: theme.mode === 'dark' ? '#cbd5e1' : muted, background: theme.mode === 'dark' ? '#172033' : '#e2e8f0', borderRadius: 999, padding: '6px 9px', whiteSpace: 'nowrap', transition: theme.transition }}>{badge}</div>
              </div>
              <div style={{ marginTop: 12, color: muted, fontSize: 13, lineHeight: 1.55 }}>{formula}</div>
            </div>
          ))}
        </section>

        <section style={{ ...sectionStyle, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={18} color={iconColor(theme)} />
              <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Pulso de recuperación</div>
            </div>
            <div style={{ color: diagnosticTone.color, fontWeight: 900, fontSize: 11, background: `${diagnosticTone.color}18`, borderRadius: 999, padding: '6px 8px', transition: theme.transition }}>{diagnosticTone.label.toUpperCase()}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 14, marginBottom: 14 }}>
            <div style={{ ...subCardStyle, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: subtle, marginBottom: 10 }}>Esta semana</div>
              <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 120 }}>
                {profile.impulseWeek.map((value, index) => (
                  <div key={`${value}-${index}`} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: `${Math.max(20, value * 15)}px`, borderRadius: 18, background: index === profile.impulseWeek.length - 1 ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' : (theme.mode === 'dark' ? 'linear-gradient(180deg, #334155 0%, #64748b 100%)' : 'linear-gradient(180deg, #dbeafe 0%, #93c5fd 100%)'), marginBottom: 8, transition: theme.transition }} />
                    <div style={{ fontSize: 11, color: subtle, fontWeight: 700 }}>{weekLabels[index]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...subCardStyle, padding: 14, background: theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(15,23,42,0.86) 0%, rgba(29,78,216,0.14) 100%)' : 'linear-gradient(145deg, #ffffff 0%, #eff6ff 100%)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: subtle, marginBottom: 8 }}>Racha actual</div>
              <div style={{ fontSize: 38, lineHeight: 1, fontWeight: 900, color: text }}>{profile.streakDays}</div>
              <div style={{ color: muted, fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>Tu racha ya empieza a verse más sólida, más consciente y menos improvisada.</div>
            </div>
          </div>
          <div style={{ color: muted, fontSize: 13, lineHeight: 1.6 }}>{checkedInToday ? `Tu nota de hoy: ${profile.todayNote || 'Check-in completado sin nota.'}` : 'Aún falta registrar hoy. Haz el check-in para afinar esta curva y detectar mejor tus horarios de riesgo.'}</div>
        </section>

        <section style={{ background: theme.heroMuted, color: theme.text, borderRadius: 30, padding: 22, boxShadow: theme.shadow, border, marginBottom: 18, transition: theme.transition }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HeartHandshake size={18} color={theme.mode === 'dark' ? '#fda4af' : '#e11d48'} />
              <div style={{ fontSize: 16, fontWeight: 800 }}>Tu razón para cambiar</div>
            </div>
            <div style={{ color: diagnosticTone.color, fontWeight: 900, fontSize: 11, background: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fff', borderRadius: 999, padding: '6px 8px', border, transition: theme.transition }}>{diagnosticTone.label.toUpperCase()}</div>
          </div>
          <div style={{ color: muted, fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>Esto es lo que la app va a recordarte cuando el impulso aparezca.</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {reasonCards.map((item) => (
              <div key={item} style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.84)', borderRadius: 18, padding: '14px 16px', color: text, lineHeight: 1.55, border, transition: theme.transition }}>{item}</div>
            ))}
          </div>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Award size={18} color={iconColor(theme)} />
            <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Tu racha ya se siente como un logro real</div>
          </div>
          <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
            {milestones.map((item, index) => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 18, background: index < 2 ? (theme.mode === 'dark' ? 'rgba(5,150,105,0.16)' : '#ecfdf5') : subCardStyle.background, border, transition: theme.transition }}>
                <div style={{ color: text, fontWeight: 700 }}>{item}</div>
                <div style={{ fontSize: 11, fontWeight: 900, color: index < 2 ? '#10b981' : subtle }}>{index < 2 ? 'DESBLOQUEADO' : 'PRÓXIMO'}</div>
              </div>
            ))}
          </div>
          <div style={{ background: theme.mode === 'dark' ? 'linear-gradient(145deg, rgba(15,23,42,0.92) 0%, rgba(37,99,235,0.18) 100%)' : 'linear-gradient(135deg, #f8fbff 0%, #eaf2ff 100%)', borderRadius: 18, padding: '16px 18px', color: theme.mode === 'dark' ? '#dbeafe' : '#1d4ed8', fontSize: 13, lineHeight: 1.6, border, boxShadow: theme.mode === 'dark' ? '0 18px 40px rgba(29,78,216,0.14)' : '0 16px 34px rgba(59,130,246,0.10)', transition: theme.transition }}>
            Llevas {profile.milestoneCount} hitos y ya estás en nivel {level.label}. La idea es que tu racha se vea cada vez más valiosa, más sobria y más digna de compartir.
          </div>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Lock size={18} color={iconColor(theme)} />
            <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Protección activa</div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {protectionItems.map(({ icon: Icon, title, text: itemText, status }) => (
              <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 14px 12px', borderRadius: 20, background: subCardStyle.background, border, transition: theme.transition }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: theme.mode === 'dark' ? '#082f49' : '#e0f2fe', display: 'grid', placeItems: 'center', flexShrink: 0, transition: theme.transition }}>
                  <Icon size={20} color={theme.mode === 'dark' ? '#7dd3fc' : '#0369a1'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: text }}>{title}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: theme.mode === 'dark' ? '#7dd3fc' : '#0369a1' }}>{status}</div>
                  </div>
                  <div style={{ color: muted, fontSize: 13, lineHeight: 1.5 }}>{itemText}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Sparkles size={18} color={iconColor(theme)} />
            <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Tiempo atrapado</div>
          </div>
          <div style={{ color: muted, fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>Esto no busca vigilarte. Busca hacer visible el tiempo mental que se va en {profile.mainTrigger} y que podrías devolver a tu vida real.</div>
          <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
            {timeTrapItems.map((item) => (
              <div key={item} style={{ padding: '12px 14px', borderRadius: 18, background: theme.mode === 'dark' ? 'rgba(23,37,84,0.72)' : '#eff6ff', color: theme.mode === 'dark' ? '#bfdbfe' : '#1e3a8a', fontSize: 13, fontWeight: 700, border, transition: theme.transition }}>{item}</div>
            ))}
          </div>
          <div style={{ background: theme.mode === 'dark' ? 'rgba(8,51,68,0.76)' : '#ecfeff', borderRadius: 18, padding: '14px 16px', color: theme.mode === 'dark' ? '#a5f3fc' : '#155e75', lineHeight: 1.55, fontSize: 13, border, transition: theme.transition }}>Con ese tiempo podrías volver a {profile.goal.toLowerCase()}, entrenar, estudiar, descansar mejor o simplemente vivir con menos ruido mental.</div>
        </section>

        <section style={{ background: theme.hero, color: '#fff', borderRadius: 30, padding: 24, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Botón rojo de emergencia</div>
          <div style={{ color: '#dbeafe', fontSize: 15, lineHeight: 1.55, marginBottom: 14 }}>Si sientes urgencia por apostar, toca el botón rojo. Te lleva a 90 segundos guiados para bajar la impulsividad antes de actuar.</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fcd3d3', fontWeight: 700, fontSize: 14 }}>Próximo salto: widget, IA de acompañamiento y horarios de riesgo según {profile.sportFocus}.<ArrowRight size={16} /></div>
        </section>
      </div>

      <button type="button" onClick={() => setShowCrisis(true)} style={{ position: 'fixed', right: 24, bottom: 106, width: 88, height: 88, border: 'none', borderRadius: '50%', background: 'linear-gradient(145deg, #dc2626 0%, #ef4444 100%)', color: '#fff', fontSize: 15, fontWeight: 900, boxShadow: '0 26px 60px rgba(220,38,38,0.34)', transition: theme.transition, zIndex: 31 }}>STOP</button>
      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}