import { ArrowLeft, ArrowRight, NotebookPen, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { hasCheckedInToday } from './storage.js'
import BottomNav from './BottomNav.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'

const intensityOptions = [
  { value: 2, label: 'Bajo', text: 'Hoy el impulso estuvo más manejable.' },
  { value: 5, label: 'Medio', text: 'Hubo ruido mental, pero aún con control.' },
  { value: 8, label: 'Alto', text: 'Hoy costó mucho sostenerte.' },
]

export default function CheckIn({ profile, currentScreen = 'checkin', onNavigate, onBack, onSubmit, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [intensity, setIntensity] = useState(profile.impulseWeek[profile.impulseWeek.length - 1])
  const [note, setNote] = useState(profile.todayNote || '')
  const checkedIn = hasCheckedInToday(profile)

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={onBack} style={{ border: `1px solid ${theme.border}`, background: theme.surface, backdropFilter: 'blur(14px)', color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={14} />
            Volver
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.1, color: theme.subtle, marginBottom: 8 }}>CHECK-IN DIARIO</div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.05, color: theme.text }}>Cómo estuvieron hoy los impulsos</h1>
          <p style={{ margin: '12px 0 0', color: theme.muted, lineHeight: 1.6 }}>Esto alimenta tu gráfico semanal y ayuda a detectar si el riesgo está bajando o si necesitas más apoyo en ciertos horarios o deportes.</p>
        </div>

        <section style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: 28, padding: 22, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><Sparkles size={18} color="#93c5fd" /><div style={{ fontWeight: 800 }}>{checkedIn ? 'Ya marcaste hoy' : 'Tu lectura honesta del día'}</div></div>
          <div style={{ color: '#cbd5e1', lineHeight: 1.6 }}>Aunque hoy haya sido difícil, registrar el impulso con honestidad ya es parte de salir del piloto automático.</div>
        </section>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          {intensityOptions.map((option) => (
            <button key={option.label} type="button" onClick={() => setIntensity(option.value)} style={{ border: `1px solid ${theme.border}`, borderRadius: 24, padding: 18, textAlign: 'left', background: intensity === option.value ? 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)' : theme.surface, color: intensity === option.value ? '#fff' : theme.text, boxShadow: theme.shadow, backdropFilter: 'blur(14px)' }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{option.label}</div>
              <div style={{ color: intensity === option.value ? '#dbeafe' : theme.muted, lineHeight: 1.5 }}>{option.text}</div>
            </button>
          ))}
        </div>

        <section style={{ background: theme.surface, backdropFilter: 'blur(14px)', borderRadius: 24, padding: 18, boxShadow: theme.shadow, border: `1px solid ${theme.border}`, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><NotebookPen size={18} color={theme.subtle} /><div style={{ fontWeight: 800, color: theme.text }}>Alguna novedad de hoy</div></div>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} placeholder="Ej: me gatilló ver cuotas en NBA, pero logré no entrar a apostar" style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 16, padding: '14px 16px', resize: 'vertical', background: theme.input, color: theme.text, fontFamily: 'inherit' }} />
        </section>

        <button type="button" onClick={() => onSubmit(intensity, note)} style={{ width: '100%', border: 'none', borderRadius: 24, padding: '16px 18px', background: 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 20px 45px rgba(29,78,216,0.20)', transition: theme.transition }}>
          Guardar check-in de hoy
          <ArrowRight size={18} />
        </button>
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}