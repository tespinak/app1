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
  if (ageRange === '18-24') return 'Todavía estás a tiempo de frenar esto antes de que se convierta en un patrón más profundo en tu adultez.'
  if (ageRange === '25-34') return 'Este es un momento clave para cortar una conducta que puede seguir comiéndose tu energía y tu estabilidad.'
  return 'Frenar esto ahora puede devolverte aire, orden y menos ruido para la etapa que viene.'
}

function getDiagnosticTone(level) {
  if (level === 'temprano') return { label: 'riesgo temprano', color: '#0f766e' }
  if (level === 'alto') return { label: 'riesgo alto', color: '#b91c1c' }
  return { label: 'riesgo moderado', color: '#b45309' }
}

function getLevelFromStreak(days) {
  if (days >= 90) return { label: 'Leyenda', color: '#7c3aed', next: 180, theme: '#ede9fe' }
  if (days >= 30) return { label: 'Oro', color: '#ca8a04', next: 90, theme: '#fef3c7' }
  if (days >= 14) return { label: 'Plata', color: '#64748b', next: 30, theme: '#e2e8f0' }
  return { label: 'Bronce', color: '#b45309', next: 14, theme: '#ffedd5' }
}

function getProgressToNext(days, nextGoal) {
  return Math.max(8, Math.min(100, (days / nextGoal) * 100))
}

export default function Home({ profile, themeMode = 'light', onToggleTheme, onRestartOnboarding, onOpenEducation, onOpenPremium, onOpenAssistant, onOpenCheckIn }) {
  const [showCrisis, setShowCrisis] = useState(false)
  const theme = getTheme(themeMode)

  const text = theme.mode === 'dark' ? '#f8fafc' : '#0f172a'
  const muted = theme.mode === 'dark' ? '#cbd5e1' : '#475569'
  const subtle = theme.mode === 'dark' ? '#94a3b8' : '#64748b'

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
  const timeTrapItems = [`Tiempo viendo ${profile.mainTrigger} en navegador o apps`, 'Tiempo pendiente de Flashscore o Sofascore', `Horas atrapado pensando en ${profile.sportFocus}`]
  const reasonCards = [profile.reason, `Tu meta hoy es recuperar ${profile.goal.toLowerCase()}.`, profile.motivation]

  const handleRestart = () => {
    clearProfile()
    onRestartOnboarding()
  }

  if (showCrisis) {
    return <Crisis isOpen={showCrisis} onClose={() => setShowCrisis(false)} profile={profile} />
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px 120px', background: theme.canvas }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: theme.subtle, marginBottom: 8 }}>STOP</div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1, color: theme.text }}>Hola, {profile.name}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
            <button type="button" onClick={handleRestart} style={{ border: `1px solid ${theme.border}`, background: theme.surface, backdropFilter: 'blur(14px)', color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, boxShadow: theme.shadow }}>
              <RefreshCcw size={14} />
              Editar
            </button>
          </div>
        </div>

        <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 36, background: theme.hero, padding: '26px 24px 28px', boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ position: 'absolute', top: -30, right: -24, width: 180, height: 180, background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -46, left: -28, width: 160, height: 160, background: 'radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(16,185,129,0.02) 70%)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 22 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: 999, color: '#e0f2fe', fontWeight: 800 }}>
              <AlertCircle size={16} />
              Racha activa
            </div>
            <div style={{ padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.10)', color: '#fff', fontWeight: 800 }}>Nivel {level.label}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 14, alignItems: 'end', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 96, lineHeight: 0.88, fontWeight: 900, color: '#fff', letterSpacing: -3 }}>{profile.streakDays}</div>
              <div style={{ color: '#dbeafe', fontSize: 24, fontWeight: 700, marginTop: 8 }}>días seguidos</div>
              <p style={{ color: '#bfdbfe', margin: '14px 0 0', fontSize: 15, lineHeight: 1.55 }}>{getAgeCopy(profile.ageRange)}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 24, padding: 16, backdropFilter: 'blur(14px)' }}>
              <div style={{ color: '#bfdbfe', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>Próximo hito</div>
              <div style={{ color: '#fff', fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{level.next} días</div>
              <div style={{ color: '#dbeafe', fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>{nextGoalDays === 0 ? 'Ya alcanzaste este nivel. Sigue sosteniéndolo.' : `Te faltan ${nextGoalDays} días para desbloquear tu siguiente nivel.`}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 22, padding: 14, backdropFilter: 'blur(14px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 800 }}>Progreso de racha</div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>{Math.round(progressToNext)}%</div>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${progressToNext}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #34d399 0%, #93c5fd 100%)' }} />
            </div>
            <div style={{ color: '#bfdbfe', fontSize: 13, lineHeight: 1.45 }}>Cada día que sostienes la racha hace más visible que sí puedes recuperar control, tiempo y dinero.</div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <button type="button" onClick={onOpenEducation} style={{ border: `1px solid ${theme.border}`, background: theme.surface, backdropFilter: 'blur(14px)', borderRadius: 24, padding: 18, textAlign: 'left', boxShadow: theme.shadow }}>
            <BookOpen size={20} color="#0f172a" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, color: text, marginBottom: 4 }}>Educación</div>
            <div style={{ color: muted, fontSize: 13, lineHeight: 1.55 }}>Lecturas breves, historias reales y claridad sobre cuotas, recaída y costo mental.</div>
          </button>
          <button type="button" onClick={onOpenPremium} style={{ border: 'none', background: 'linear-gradient(145deg, #111827 0%, #1d4ed8 100%)', color: '#fff', borderRadius: 24, padding: 18, textAlign: 'left', boxShadow: '0 20px 45px rgba(29,78,216,0.24)' }}>
            <Sparkles size={20} color="#fcd34d" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, marginBottom: 4 }}>Premium</div>
            <div style={{ color: '#dbeafe', fontSize: 13, lineHeight: 1.55 }}>IA, horarios de riesgo, bloqueo inteligente y dashboard real.</div>
          </button>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <button type="button" onClick={onOpenAssistant} style={{ border: `1px solid ${theme.border}`, background: theme.surface, backdropFilter: 'blur(14px)', borderRadius: 24, padding: 18, textAlign: 'left', boxShadow: theme.shadow }}>
            <MessageCircleHeart size={20} color="#1d4ed8" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, color: text, marginBottom: 4 }}>Asistente</div>
            <div style={{ color: muted, fontSize: 13, lineHeight: 1.55 }}>Apoyo emocional contextual, con más memoria de tu proceso.</div>
          </button>
          <button type="button" onClick={onOpenCheckIn} style={{ border: `1px solid ${theme.border}`, background: checkedInToday ? 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)' : theme.surface, backdropFilter: 'blur(14px)', borderRadius: 24, padding: 18, textAlign: 'left', boxShadow: theme.shadow }}>
            <SquarePen size={20} color={checkedInToday ? '#047857' : '#0f172a'} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 800, color: text, marginBottom: 4 }}>{checkedInToday ? 'Check-in listo' : 'Check-in diario'}</div>
            <div style={{ color: muted, fontSize: 13, lineHeight: 1.55 }}>{checkedInToday ? 'Ya registraste cómo estuvo hoy el impulso.' : 'Actualiza tu gráfico y registra novedades del día.'}</div>
          </button>
        </section>

        <section style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 26, padding: '16px 18px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Info size={18} color="#334155" />
            <div style={{ fontSize: 15, fontWeight: 800, color: text }}>Cómo leer estas métricas</div>
          </div>
          <p style={{ margin: 0, color: muted, fontSize: 14, lineHeight: 1.6 }}>Combinamos tu gasto, tus horas perdidas y tu diagnóstico para hacer visible el costo real de seguir atrapado en {profile.mainTrigger}.</p>
        </section>

        <section style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
          {metrics.map(({ icon: Icon, value, label, color, formula, badge }) => (
            <div key={label} style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 26, padding: '18px 18px 16px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 18, display: 'grid', placeItems: 'center', background: `${color}18`, boxShadow: `inset 0 0 0 1px ${color}20` }}>
                    <Icon size={24} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: text }}>{value}</div>
                    <div style={{ fontSize: 14, color: subtle }}>{label}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: muted, background: '#e2e8f0', borderRadius: 999, padding: '6px 9px', whiteSpace: 'nowrap' }}>{badge}</div>
              </div>
              <div style={{ marginTop: 12, color: muted, fontSize: 13, lineHeight: 1.55 }}>{formula}</div>
            </div>
          ))}
        </section>

        <section style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 30, padding: 22, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={18} color="#0f172a" />
              <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Racha e impulsos</div>
            </div>
            <div style={{ color: diagnosticTone.color, fontWeight: 900, fontSize: 11, background: `${diagnosticTone.color}18`, borderRadius: 999, padding: '6px 8px' }}>{diagnosticTone.label.toUpperCase()}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 14, marginBottom: 14 }}>
            <div style={{ borderRadius: 22, background: '#f8fafc', padding: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: subtle, marginBottom: 10 }}>Impulsos esta semana</div>
              <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 120 }}>
                {profile.impulseWeek.map((value, index) => (
                  <div key={`${value}-${index}`} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: `${Math.max(20, value * 15)}px`, borderRadius: 18, background: index === profile.impulseWeek.length - 1 ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' : 'linear-gradient(180deg, #dbeafe 0%, #93c5fd 100%)', marginBottom: 8 }} />
                    <div style={{ fontSize: 11, color: subtle, fontWeight: 700 }}>{weekLabels[index]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 22, background: level.theme, padding: 14, border: '1px solid rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: subtle, marginBottom: 8 }}>Racha actual</div>
              <div style={{ fontSize: 36, lineHeight: 1, fontWeight: 900, color: '#0f172a' }}>{profile.streakDays}</div>
              <div style={{ color: '#334155', fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>Tu progreso ya se siente más hábito que improvisación.</div>
            </div>
          </div>
          <div style={{ color: muted, fontSize: 13, lineHeight: 1.6 }}>{checkedInToday ? `Tu nota de hoy: ${profile.todayNote || 'Check-in completado sin nota.'}` : 'Aún falta registrar hoy. Haz el check-in para afinar esta curva y detectar mejor tus horarios de riesgo.'}</div>
        </section>

        <section style={{ background: 'linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.96) 100%)', color: '#fff', borderRadius: 30, padding: 22, boxShadow: '0 26px 60px rgba(15,23,42,0.18)', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HeartHandshake size={18} color="#fda4af" />
              <div style={{ fontSize: 16, fontWeight: 800 }}>Tu razón para cambiar</div>
            </div>
            <div style={{ color: diagnosticTone.color, fontWeight: 900, fontSize: 11, background: '#fff', borderRadius: 999, padding: '6px 8px' }}>{diagnosticTone.label.toUpperCase()}</div>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>Esto es lo que la app va a recordarte cuando el impulso aparezca.</div>
          <div style={{ display: 'grid', gap: 10 }}>{reasonCards.map((item) => <div key={item} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: '14px 16px', color: '#e2e8f0', lineHeight: 1.55 }}>{item}</div>)}</div>
        </section>

        <section style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 30, padding: 22, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Award size={18} color="#0f172a" />
            <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Rachas y logros para compartir</div>
          </div>
          <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>{milestones.map((item, index) => <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 18, background: index < 2 ? '#ecfdf5' : '#f8fafc', border: '1px solid #e2e8f0' }}><div style={{ color: '#0f172a', fontWeight: 700 }}>{item}</div><div style={{ fontSize: 11, fontWeight: 900, color: index < 2 ? '#047857' : '#64748b' }}>{index < 2 ? 'DESBLOQUEADO' : 'PRÓXIMO'}</div></div>)}</div>
          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)', borderRadius: 18, padding: '14px 16px', color: '#1d4ed8', fontSize: 13, lineHeight: 1.55 }}>Ya llevas {profile.milestoneCount} hitos y estás en nivel {level.label}. El diseño puede seguir cambiando a medida que sostienes la racha diaria real.</div>
        </section>

        <section style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 30, padding: 22, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Lock size={18} color="#0f172a" />
            <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Protección activa</div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>{protectionItems.map(({ icon: Icon, title, text: itemText, status }) => <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 14px 12px', borderRadius: 20, background: '#f8fafc', border: '1px solid #e2e8f0' }}><div style={{ width: 42, height: 42, borderRadius: 14, background: '#e0f2fe', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={20} color="#0369a1" /></div><div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}><div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{title}</div><div style={{ fontSize: 11, fontWeight: 800, color: '#0369a1' }}>{status}</div></div><div style={{ color: '#475569', fontSize: 13, lineHeight: 1.5 }}>{itemText}</div></div></div>)}</div>
        </section>

        <section style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 30, padding: 22, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Sparkles size={18} color="#0f172a" />
            <div style={{ fontSize: 16, fontWeight: 800, color: text }}>Tiempo atrapado</div>
          </div>
          <div style={{ color: muted, fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>Esto no busca vigilarte. Busca hacer visible el tiempo mental que se va en {profile.mainTrigger} y que podrías devolver a tu vida real.</div>
          <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>{timeTrapItems.map((item) => <div key={item} style={{ padding: '12px 14px', borderRadius: 18, background: '#eff6ff', color: '#1e3a8a', fontSize: 13, fontWeight: 700 }}>{item}</div>)}</div>
          <div style={{ background: '#ecfeff', borderRadius: 18, padding: '14px 16px', color: '#155e75', lineHeight: 1.55, fontSize: 13 }}>Con ese tiempo podrías volver a {profile.goal.toLowerCase()}, entrenar, estudiar, descansar mejor o simplemente vivir con menos ruido mental.</div>
        </section>

        <section style={{ background: 'rgba(15,23,42,0.94)', color: '#fff', borderRadius: 30, padding: 24, boxShadow: '0 26px 60px rgba(15,23,42,0.18)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Botón rojo de emergencia</div>
          <div style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.55, marginBottom: 14 }}>Si sientes urgencia por apostar, toca el botón rojo. Te lleva a 90 segundos guiados para bajar la impulsividad antes de actuar.</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fca5a5', fontWeight: 700, fontSize: 14 }}>Próximo salto: widget, IA de acompañamiento y horarios de riesgo según {profile.sportFocus}.<ArrowRight size={16} /></div>
        </section>
      </div>

      <button type="button" onClick={() => setShowCrisis(true)} style={{ position: 'fixed', right: 24, bottom: 24, width: 94, height: 94, border: 'none', borderRadius: '50%', background: 'linear-gradient(145deg, #dc2626 0%, #ef4444 100%)', color: '#fff', fontSize: 15, fontWeight: 900, boxShadow: '0 26px 60px rgba(220,38,38,0.34)' }}>STOP</button>
    </div>
  )
}