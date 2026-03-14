import {
  ArrowLeft,
  BellRing,
  Chrome,
  Clock3,
  ShieldCheck,
  Smartphone,
  TimerReset,
} from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import { getTheme } from './theme.js'
import { renderText } from './text.js'

function FeatureCard({ icon: Icon, title, text, badge, theme, tone = '#2563eb' }) {
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`

  return (
    <section
      style={{
        background: theme.surface,
        border,
        borderRadius: 26,
        padding: 20,
        boxShadow: theme.shadow,
        transition: theme.transition,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background: `${tone}16`,
          display: 'grid',
          placeItems: 'center',
          marginBottom: 12,
        }}
      >
        <Icon size={20} color={tone} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div style={{ color: theme.text, fontWeight: 900, fontSize: 20, lineHeight: 1.15 }}>{title}</div>
        {badge ? (
          <div
            style={{
              padding: '7px 10px',
              borderRadius: 999,
              background: theme.mode === 'dark' ? 'rgba(37,99,235,0.16)' : '#eff6ff',
              color: '#2563eb',
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 0.3,
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </div>
        ) : null}
      </div>
      <div style={{ color: theme.muted, lineHeight: 1.65, fontSize: 15 }}>{text}</div>
    </section>
  )
}

export default function Protection({ profile, currentScreen = 'premium', onNavigate, onBack, themeMode }) {
  const theme = getTheme(themeMode)
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`
  const focus = renderText(profile.sportFocus || profile.bettingType || 'apuestas deportivas')

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
            Volver
          </button>
        </div>

        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: theme.hero,
            color: '#fff',
            borderRadius: 36,
            padding: 24,
            boxShadow: theme.shadow,
            marginBottom: 18,
            animation: 'stopFadeUp 260ms ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -42,
              right: -18,
              width: 170,
              height: 170,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 72%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -40,
              bottom: -62,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.20) 0%, rgba(16,185,129,0.03) 72%)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', borderRadius: 999, padding: '8px 12px', fontWeight: 800, marginBottom: 12 }}>
              <ShieldCheck size={16} color="#bfdbfe" />
              Sistema anti-recaída
            </div>
            <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.02 }}>Más barreras antes del impulso</h1>
            <p style={{ margin: '12px 0 0', color: '#dbeafe', lineHeight: 1.65, fontSize: 16 }}>
              Bloquear, medir y anticiparse.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginTop: 16 }}>
              {[
                ['BLOQUEO', 'Más fricción'],
                ['MEDICIÓN', 'Tiempo atrapado'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    borderRadius: 18,
                    padding: '12px 12px',
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

        <section
          style={{
            background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : 'linear-gradient(145deg, #ffffff 0%, #eff6ff 100%)',
            borderRadius: 28,
            padding: 20,
            border,
            boxShadow: theme.shadow,
            marginBottom: 18,
            transition: theme.transition,
            animation: 'stopFadeUp 340ms ease',
          }}
        >
          <div style={{ color: theme.text, fontSize: 22, fontWeight: 900, marginBottom: 8 }}>La promesa real de PRO</div>
          <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
            Si tu patrón se activa con {focus}, esta capa existe para llegar antes: menos exposición, más fricción y más claridad.
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              'Bloqueo temporal cuando viene una jornada sensible.',
              'Alertas antes de horarios, torneos o hábitos gatillo.',
              'Medición del tiempo atrapado en apuestas, estadísticas y marcadores.',
            ].map((item) => (
              <div key={item} style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', border, borderRadius: 18, padding: '14px 16px', color: theme.text, fontWeight: 700, lineHeight: 1.5, transition: theme.transition }}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          <FeatureCard
            icon={Chrome}
            title="Protección en navegador"
            badge="Chrome"
            text="Bloqueo de casas de apuestas y sitios gatillo, lectura de historial relevante y tiempo aproximado activo por dominio."
            theme={theme}
          />
          <FeatureCard
            icon={Smartphone}
            title="Protección en teléfono"
            badge="iPhone / Android"
            text="Ruta premium para activar modo protegido en el móvil, con bloqueo de apps sensibles y acceso más guiado a franjas de riesgo."
            theme={theme}
            tone="#0f766e"
          />
          <FeatureCard
            icon={Clock3}
            title="Tiempo atrapado"
            badge="Medición"
            text="Ver cuánto tiempo pasaste mirando cuotas, resultados o páginas relacionadas y convertirlo en horas recuperables."
            theme={theme}
            tone="#1d4ed8"
          />
        </div>

        <section
          style={{
            background: theme.surface,
            border,
            borderRadius: 28,
            padding: 20,
            boxShadow: theme.shadow,
            marginBottom: 18,
            transition: theme.transition,
            animation: 'stopFadeUp 420ms ease',
          }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <BellRing size={18} color="#2563eb" />
            <div style={{ color: theme.text, fontWeight: 900, fontSize: 20 }}>Próximo</div>
            </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', border, borderRadius: 18, padding: '14px 16px' }}>
              <div style={{ color: theme.text, fontWeight: 800, marginBottom: 4 }}>1. Extensión Chrome</div>
              <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.55 }}>Bloqueo por dominio, historial y tiempo aproximado por sitio.</div>
            </div>
            <div style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', border, borderRadius: 18, padding: '14px 16px' }}>
              <div style={{ color: theme.text, fontWeight: 800, marginBottom: 4 }}>2. Capa nativa móvil</div>
              <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.55 }}>Integración con iOS y Android para restricciones reales de apps y tiempo de uso.</div>
            </div>
            <div style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', border, borderRadius: 18, padding: '14px 16px' }}>
              <div style={{ color: theme.text, fontWeight: 800, marginBottom: 4 }}>3. Lectura de riesgo más profunda</div>
              <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.55 }}>Alertas por horas sensibles, seguimiento de notificaciones y más señales del patrón.</div>
            </div>
          </div>
        </section>

        <section
          style={{
            background: theme.info,
            borderRadius: 24,
            padding: 20,
            color: theme.infoText,
            lineHeight: 1.6,
            border: theme.mode === 'dark' ? '1px solid rgba(125,211,252,0.18)' : '1px solid rgba(125,211,252,0.24)',
            transition: theme.transition,
            marginBottom: 18,
            animation: 'stopFadeUp 480ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontWeight: 800 }}>
            <TimerReset size={18} />
            Importante
          </div>
          Algunas partes de esta capa requieren app nativa o extensión de navegador.
        </section>

        <button
          type="button"
          onClick={() => onNavigate('premium')}
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
            transition: theme.transition,
          }}
        >
          Volver a STOP PRO
        </button>
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
