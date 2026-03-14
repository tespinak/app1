import {
  ArrowLeft,
  BellRing,
  Chrome,
  Clock3,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import { getTheme } from './theme.js'
import { renderText } from './text.js'

function FeatureCard({ icon: Icon, title, text, badge, theme, tone = '#2563eb' }) {
  return (
    <section
      style={{
        background: theme.surface,
        border: `1px solid ${theme.mode === 'dark' ? theme.border : theme.borderStrong || theme.border}`,
        borderRadius: 26,
        padding: 20,
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
            background: `${tone}16`,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={tone} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
            <div style={{ color: theme.text, fontWeight: 900, fontSize: 19, lineHeight: 1.15 }}>{title}</div>
            {badge ? (
              <div
                style={{
                  padding: '7px 10px',
                  borderRadius: 999,
                  background: theme.blueSurface,
                  color: theme.blue,
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
        </div>
      </div>
    </section>
  )
}

function PreviewCard({ title, subtitle, detail, theme }) {
  return (
    <div
      style={{
        background: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.82)',
        borderRadius: 20,
        padding: '14px 16px',
        border: `1px solid ${theme.mode === 'dark' ? 'rgba(255,255,255,0.10)' : theme.borderStrong || theme.border}`,
      }}
    >
      <div style={{ color: theme.text, fontWeight: 900, marginBottom: 4 }}>{title}</div>
      <div style={{ color: theme.subtle, fontSize: 13, marginBottom: 8 }}>{subtitle}</div>
      <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.5 }}>{detail}</div>
    </div>
  )
}

export default function Protection({ profile, currentScreen = 'premium', onNavigate, onBack, themeMode }) {
  const theme = getTheme(themeMode)
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : theme.borderStrong || theme.border}`
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
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.10)',
                borderRadius: 999,
                padding: '8px 12px',
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              <ShieldCheck size={16} color="#bfdbfe" />
              Protección
            </div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.02 }}>Más barreras antes del impulso</h1>
            <p style={{ margin: '12px 0 16px', color: '#dbeafe', lineHeight: 1.65, fontSize: 16 }}>
              Si tu patrón se activa con {focus}, esta capa existe para llegar antes: menos exposición, más fricción y más claridad.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {[
                ['BLOQUEO', 'Más fricción'],
                ['ALERTAS', 'Antes del impulso'],
                ['MEDICIÓN', 'Tiempo atrapado'],
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
            background: theme.mode === 'dark' ? 'rgba(12,18,32,0.88)' : 'linear-gradient(145deg, #ffffff 0%, #eff6ff 100%)',
            borderRadius: 28,
            padding: 22,
            border,
            boxShadow: theme.shadow,
            marginBottom: 18,
            animation: 'stopFadeUp 320ms ease',
          }}
        >
          <div style={{ color: theme.text, fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Vista previa de cómo te ayuda</div>
          <div style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 14 }}>
            No se trata de mostrar más pantallas. Se trata de darte ayuda concreta justo antes de que el impulso suba.
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <PreviewCard
              title="Alerta antes del impulso"
              subtitle="Hoy 20:30"
              detail="Suele ser una hora difícil para ti. Toca aquí para activar un plan corto antes de exponerte."
              theme={theme}
            />
            <PreviewCard
              title="Bloqueo temporal"
              subtitle="Modo protegido activo"
              detail="Las páginas de apuestas quedan bloqueadas y se suma un paso extra antes de salir del modo protegido."
              theme={theme}
            />
            <PreviewCard
              title="Tiempo atrapado"
              subtitle="Esta semana"
              detail="Llevabas 4h 20m entre cuotas, estadísticas y resultados. Eso también se puede recuperar."
              theme={theme}
            />
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
            animation: 'stopFadeUp 420ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <BellRing size={18} color={theme.blue} />
            <div style={{ color: theme.text, fontWeight: 900, fontSize: 20 }}>Qué viene primero</div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              ['Extensión de Chrome', 'Bloqueo por dominio, historial y tiempo aproximado por sitio.'],
              ['Capa nativa móvil', 'Integración con iOS y Android para restricciones reales de apps y tiempo de uso.'],
              ['Lectura más profunda del patrón', 'Alertas por horas sensibles, seguimiento de notificaciones y más señales relevantes.'],
            ].map(([title, text]) => (
              <div key={title} style={{ background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', border, borderRadius: 18, padding: '14px 16px' }}>
                <div style={{ color: theme.text, fontWeight: 800, marginBottom: 4 }}>{title}</div>
                <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.55 }}>{text}</div>
              </div>
            ))}
          </div>
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
