import { HeartPulse, Volume2, VolumeX, Wind, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const TOTAL_SECONDS = 90

function getPhase(second) {
  const cycle = second % 10

  if (cycle < 4) return 'Inhala'
  if (cycle < 7) return 'Sosten'
  return 'Exhala'
}

function getScale(phase) {
  if (phase === 'Inhala') return 1.12
  if (phase === 'Sosten') return 1.08
  return 0.92
}

function getPhaseCopy(phase) {
  if (phase === 'Inhala') return 'Toma aire lento por la nariz.'
  if (phase === 'Sosten') return 'Manten el aire y baja el impulso.'
  return 'Suelta el aire y deja pasar la urgencia.'
}

export default function Crisis({ isOpen, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)
  const [soundOn, setSoundOn] = useState(false)
  const audioContextRef = useRef(null)
  const previousPhaseRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    setSecondsLeft(TOTAL_SECONDS)
    previousPhaseRef.current = null

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isOpen])

  const elapsed = TOTAL_SECONDS - secondsLeft
  const progress = `${(elapsed / TOTAL_SECONDS) * 100}%`
  const phase = useMemo(() => getPhase(elapsed), [elapsed])
  const scale = getScale(phase)

  useEffect(() => {
    if (!isOpen || !soundOn) return
    if (previousPhaseRef.current === phase) return

    previousPhaseRef.current = phase

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }

    const context = audioContextRef.current
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = phase === 'Inhala' ? 432 : phase === 'Sosten' ? 396 : 320
    gain.gain.value = 0.0001

    oscillator.connect(gain)
    gain.connect(context.destination)

    const now = context.currentTime
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)

    oscillator.start(now)
    oscillator.stop(now + 0.45)
  }, [isOpen, phase, soundOn])

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(239,68,68,0.16), transparent 35%), linear-gradient(180deg, #020617 0%, #111827 100%)',
        color: '#fff',
        padding: '24px 20px 40px',
      }}
    >
      <style>{`
        @keyframes stopBreathRing {
          0% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.42; }
          100% { transform: translate(-50%, -50%) scale(1.28); opacity: 0; }
        }
      `}</style>

      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 14, color: '#fca5a5', fontWeight: 800, letterSpacing: 1 }}>MODO CRISIS</div>
            <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>No apuestes ahora</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setSoundOn((current) => !current)}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15,23,42,0.68)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 30,
            padding: 24,
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                width: progress,
                height: '100%',
                background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', padding: '30px 0 26px' }}>
            <div
              style={{
                position: 'relative',
                width: 260,
                height: 260,
                margin: '0 auto 18px',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.20)',
                  animation: 'stopBreathRing 4s ease-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.16)',
                  animation: 'stopBreathRing 4s ease-out 1.2s infinite',
                }}
              />
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  transform: `scale(${scale})`,
                  transition: 'transform 900ms ease-in-out, box-shadow 900ms ease-in-out, background 900ms ease-in-out',
                  background: phase === 'Inhala'
                    ? 'radial-gradient(circle, rgba(248,113,113,0.96) 0%, rgba(220,38,38,0.80) 55%, rgba(153,27,27,0.32) 100%)'
                    : phase === 'Sosten'
                      ? 'radial-gradient(circle, rgba(251,191,36,0.96) 0%, rgba(217,119,6,0.80) 55%, rgba(120,53,15,0.32) 100%)'
                      : 'radial-gradient(circle, rgba(96,165,250,0.96) 0%, rgba(37,99,235,0.80) 55%, rgba(30,64,175,0.32) 100%)',
                  boxShadow:
                    phase === 'Exhala'
                      ? '0 0 80px rgba(96,165,250,0.28)'
                      : '0 0 80px rgba(248,113,113,0.24)',
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, opacity: 0.9 }}>{phase}</div>
                  <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1 }}>{secondsLeft}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.8 }}>segundos</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{getPhaseCopy(phase)}</div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  padding: '8px 14px',
                  color: '#e2e8f0',
                  fontWeight: 700,
                }}
              >
                <Wind size={16} />
                Respiracion guiada
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  padding: '8px 14px',
                  color: '#e2e8f0',
                  fontWeight: 700,
                }}
              >
                <HeartPulse size={16} />
                {soundOn ? 'Audio suave activo' : 'Audio opcional'}
              </span>
            </div>

            <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>
              La urgencia baja si no actuas de inmediato. Respira, aleja el celular de la casa de apuestas y vuelve cuando termine el contador.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 22,
              padding: 18,
              color: '#e2e8f0',
              lineHeight: 1.6,
            }}
          >
            1. Inhala por 4 segundos.
            <br />
            2. Sosten por 3 segundos.
            <br />
            3. Exhala por 3 segundos.
          </div>
        </div>
      </div>
    </div>
  )
}
