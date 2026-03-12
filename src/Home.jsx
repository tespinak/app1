import {
  AlertCircle,
  ArrowRight,
  Clock3,
  DollarSign,
  Info,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import Crisis from './Crisis.jsx'

const metrics = [
  {
    icon: DollarSign,
    value: '$1.22M',
    label: 'dinero evitado',
    color: '#1d4ed8',
    formula: 'Demo: 47 dias x $26.000 CLP que antes se iban en apuestas.',
  },
  {
    icon: Clock3,
    value: '94h',
    label: 'horas recuperadas',
    color: '#0f766e',
    formula: 'Demo: 2 horas al dia que ya no se pierden entre apuestas y recuperacion.',
  },
  {
    icon: TrendingUp,
    value: '8/10',
    label: 'control de hoy',
    color: '#7c3aed',
    formula: 'Check-in manual: mientras mas alto, mas calma y control sientes hoy.',
  },
]

export default function Home() {
  const [showCrisis, setShowCrisis] = useState(false)

  if (showCrisis) {
    return <Crisis isOpen={showCrisis} onClose={() => setShowCrisis(false)} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 20px 120px',
        background:
          'radial-gradient(circle at top, rgba(59,130,246,0.20), transparent 30%), linear-gradient(180deg, #eff6ff 0%, #f8fafc 45%, #e2e8f0 100%)',
      }}
    >
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: '#475569',
                marginBottom: 8,
              }}
            >
              STOP
            </div>
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1, color: '#0f172a' }}>
              Un dia a la vez
            </h1>
          </div>
          <div
            style={{
              background: '#f59e0b',
              color: '#fff',
              fontWeight: 800,
              fontSize: 12,
              padding: '8px 14px',
              borderRadius: 999,
              boxShadow: '0 12px 30px rgba(245,158,11,0.28)',
            }}
          >
            PRO
          </div>
        </div>

        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 32,
            background: 'linear-gradient(135deg, #059669 0%, #10b981 52%, #34d399 100%)',
            padding: '28px 24px 34px',
            boxShadow: '0 28px 70px rgba(5,150,105,0.30)',
            marginBottom: 18,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 'auto -40px -65px auto',
              width: 170,
              height: 170,
              background: 'rgba(255,255,255,0.14)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 999,
              color: '#ecfdf5',
              fontWeight: 700,
              marginBottom: 18,
            }}
          >
            <AlertCircle size={16} />
            Hoy importa
          </div>
          <div style={{ fontSize: 92, lineHeight: 0.9, fontWeight: 900, color: '#fff' }}>47</div>
          <div style={{ color: '#ecfdf5', fontSize: 28, fontWeight: 700, marginTop: 6 }}>dias seguidos</div>
          <p style={{ color: '#d1fae5', margin: '14px 0 0', fontSize: 16 }}>
            Cada impulso frenado te devuelve tiempo, foco y plata.
          </p>
        </section>

        <section
          style={{
            background: 'rgba(255,255,255,0.84)',
            borderRadius: 24,
            padding: '16px 18px',
            boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Info size={18} color="#334155" />
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Como leer estas metricas</div>
          </div>
          <p style={{ margin: 0, color: '#475569', fontSize: 14, lineHeight: 1.55 }}>
            Por ahora son referencias demo para que el usuario entienda el valor de dejar de apostar. La siguiente version las hara personales con onboarding y datos reales.
          </p>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 12,
            marginBottom: 26,
          }}
        >
          {metrics.map(({ icon: Icon, value, label, color, formula }) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 24,
                padding: '18px 18px 16px',
                boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 16,
                      display: 'grid',
                      placeItems: 'center',
                      background: `${color}18`,
                    }}
                  >
                    <Icon size={24} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                    <div style={{ fontSize: 14, color: '#64748b' }}>{label}</div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#475569',
                    background: '#e2e8f0',
                    borderRadius: 999,
                    padding: '6px 9px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  DEMO
                </div>
              </div>
              <div style={{ marginTop: 12, color: '#475569', fontSize: 13, lineHeight: 1.55 }}>{formula}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            background: 'rgba(15,23,42,0.92)',
            color: '#fff',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 26px 60px rgba(15,23,42,0.20)',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Boton rojo anti-crisis</div>
          <div style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.5, marginBottom: 14 }}>
            Si sientes urgencia por apostar, aprieta el boton. Te lleva a 90 segundos guiados para bajar la impulsividad.
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fca5a5', fontWeight: 700, fontSize: 14 }}>
            Proximo upgrade: respiracion tipo yoga con animacion mas inmersiva y audio suave.
            <ArrowRight size={16} />
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={() => setShowCrisis(true)}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 92,
          height: 92,
          border: 'none',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 900,
          boxShadow: '0 24px 60px rgba(220,38,38,0.38)',
        }}
      >
        STOP
      </button>
    </div>
  )
}
