import { ArrowLeft, Bell, ChevronRight, CircleHelp, LockKeyhole, MoonStar, RefreshCcw, ShieldCheck } from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { clearProfile } from './storage.js'
import { getTheme } from './theme.js'

function Row({ icon: Icon, title, value, theme, danger = false, onClick }) {
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        border,
        background: theme.surface,
        borderRadius: 22,
        padding: '16px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: theme.shadow,
        color: danger ? '#ef4444' : theme.text,
        transition: theme.transition,
      }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 16, background: danger ? theme.redSurface : (theme.mode === 'dark' ? 'rgba(37,99,235,0.14)' : '#eff6ff'), display: 'grid', placeItems: 'center' }}>
        <Icon size={18} color={danger ? '#ef4444' : '#2563eb'} />
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
        {value ? <div style={{ color: danger ? '#fca5a5' : theme.subtle, fontSize: 14, marginTop: 4 }}>{value}</div> : null}
      </div>
      {!danger ? <ChevronRight size={18} color={theme.subtle} /> : null}
    </button>
  )
}

export default function Settings({ currentScreen = 'settings', onNavigate, onBack, themeMode, onToggleTheme, onRestartOnboarding }) {
  const theme = getTheme(themeMode)
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`

  const handleReset = () => {
    clearProfile()
    onRestartOnboarding()
  }

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={onBack} style={{ border, background: theme.surface, color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: theme.shadow, transition: theme.transition }}>
            <ArrowLeft size={14} />
            Volver
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, color: theme.text, fontSize: 32, lineHeight: 1.05 }}>Configuración</h1>
          <div style={{ color: theme.subtle, fontSize: 16, marginTop: 8 }}>Ajusta tu experiencia y tus preferencias</div>
        </div>

        <section style={{ marginBottom: 18 }}>
          <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.6, marginBottom: 10 }}>PREFERENCIAS</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ border, background: theme.surface, borderRadius: 24, padding: '16px 16px', boxShadow: theme.shadow, transition: theme.transition }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 16, background: theme.mode === 'dark' ? 'rgba(37,99,235,0.14)' : '#eff6ff', display: 'grid', placeItems: 'center' }}>
                  <MoonStar size={18} color="#2563eb" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.text, fontWeight: 800, fontSize: 16 }}>Tema</div>
                  <div style={{ color: theme.subtle, fontSize: 14, marginTop: 4 }}>{themeMode === 'dark' ? 'Oscuro' : 'Claro'}</div>
                </div>
                <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
              </div>
            </div>
            <Row icon={Bell} title="Notificaciones" value="Próximamente" theme={theme} onClick={() => {}} />
          </div>
        </section>

        <section style={{ marginBottom: 18 }}>
          <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.6, marginBottom: 10 }}>CUENTA Y SOPORTE</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <Row icon={LockKeyhole} title="Privacidad" value="Tus datos son confidenciales" theme={theme} onClick={() => {}} />
            <Row icon={CircleHelp} title="Ayuda y soporte" value="Recursos y contacto" theme={theme} onClick={() => {}} />
            <Row icon={ShieldCheck} title="Términos y condiciones" value="Información legal" theme={theme} onClick={() => {}} />
          </div>
        </section>

        <section style={{ marginBottom: 18 }}>
          <div style={{ color: theme.subtle, fontSize: 12, fontWeight: 900, letterSpacing: 0.6, marginBottom: 10 }}>SESIÓN</div>
          <Row icon={RefreshCcw} title="Reiniciar experiencia" value="Volver al onboarding" theme={theme} danger onClick={handleReset} />
        </section>
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
