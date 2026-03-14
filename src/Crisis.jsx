import { Heart, Volume2, VolumeX, Wind, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getTheme } from './theme.js'

const phaseDurations = {
  inhale: 4,
  hold: 4,
  exhale: 6,
}

const phaseTitles = {
  inhale: 'Inhala profundo',
  hold: 'Mantén',
  exhale: 'Exhala lento',
}

const phaseCopy = {
  inhale: 'Lleva el aire hacia adentro con calma.',
  hold: 'Mantén el aire y deja bajar la urgencia.',
  exhale: 'Suelta lento y deja pasar el impulso.',
}

function nextPhase(current) {
  if (current === 'inhale') return 'hold'
  if (current === 'hold') return 'exhale'
  return 'inhale'
}

export default function Crisis({ isOpen, onClose, profile, themeMode = 'light' }) {
  const theme = getTheme(themeMode)
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale')
  const [count, setCount] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  const audioRef = useRef(null)
  const total = phaseDurations[phase]

  useEffect(() => {
    if (!isOpen) return undefined

    setIsActive(false)
    setPhase('inhale')
    setCount(0)
    setCycleCount(0)

    return undefined
  }, [isOpen])

  useEffect(() => {
    if (!isActive) return undefined

    const timer = window.setInterval(() => {
      setCount((current) => {
        if (current >= total - 1) {
          setPhase((prev) => {
            const upcoming = nextPhase(prev)
            if (prev === 'exhale') {
              setCycleCount((value) => value + 1)
            }
            return upcoming
          })
          return 0
        }
        return current + 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isActive, total])

  useEffect(() => {
    if (!soundOn || !isActive) return

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    if (!audioRef.current) {
      audioRef.current = new AudioContextClass()
    }

    const context = audioRef.current
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = phase === 'inhale' ? 432 : phase === 'hold' ? 396 : 320
    gain.gain.value = 0.0001
    oscillator.connect(gain)
    gain.connect(context.destination)
    const now = context.currentTime
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
    oscillator.start(now)
    oscillator.stop(now + 0.4)
  }, [phase, soundOn, isActive])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.close()
        audioRef.current = null
      }
    }
  }, [])

  const scale = useMemo(() => {
    if (!isActive) return 1
    if (phase === 'inhale') return 1.18
    if (phase === 'hold') return 1.12
    return 0.84
  }, [phase, isActive])

  const accent = phase === 'exhale' ? theme.blue : theme.green
  const accentHover = phase === 'exhale' ? theme.blueHover : theme.greenHover
  const subtitle = isActive ? 'Sigue el círculo' : 'Toca para comenzar'
  const secondsVisible = total - count
  const shellBackground = theme.mode === 'dark'
    ? 'radial-gradient(circle at top, rgba(59,130,246,0.12), transparent 32%), radial-gradient(circle at bottom, rgba(16,185,129,0.10), transparent 26%), linear-gradient(180deg, #020617 0%, #081122 52%, #0f172a 100%)'
    : 'linear-gradient(180deg, #fbfdff 0%, #f5f8fd 100%)'
  const panelSurface = theme.mode === 'dark' ? 'rgba(15,23,42,0.78)' : '#ffffff'
  const panelBorder = `1px solid ${theme.border}`
  const panelShadow = theme.mode === 'dark' ? '0 26px 56px rgba(2,6,23,0.42)' : '0 16px 34px rgba(15,23,42,0.08)'

  if (!isOpen) return null

  return (
    <div style={{ minHeight: '100vh', background: shellBackground, padding: '24px 20px 32px', transition: theme.transition }}>
      <style>{`
        @keyframes stopBreathPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.22; }
          100% { transform: translate(-50%, -50%) scale(1.18); opacity: 0; }
        }
        @keyframes stopBreathDrift {
          0% { transform: translate3d(0, 0, 0) scale(0.92); opacity: 0; }
          20% { opacity: 0.34; }
          100% { transform: translate3d(0, -38px, 0) scale(1.08); opacity: 0; }
        }
      `}</style>

      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
          <button type="button" onClick={onClose} style={{ width: 44, height: 44, borderRadius: '50%', border: panelBorder, background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: theme.subtle, display: 'grid', placeItems: 'center', transition: theme.transition }}>
            <X size={20} />
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 999, background: theme.greenSurface, color: theme.green, fontSize: 14, fontWeight: 800, transition: theme.transition }}>
            <Heart size={15} />
            {cycleCount} ciclos
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <h1 style={{ margin: 0, fontSize: 26, color: theme.text, lineHeight: 1.1 }}>{phaseTitles[phase]}</h1>
          <div style={{ color: theme.subtle, fontSize: 17, marginTop: 8 }}>{subtitle}</div>
        </div>

        <div style={{ position: 'relative', width: 320, height: 320, margin: '0 auto 28px', display: 'grid', placeItems: 'center' }}>
          {isActive ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${accent}18 0%, transparent 65%)`, transform: `scale(${scale * 1.06})`, transition: 'transform 1000ms ease, background 1000ms ease' }} /> : null}
          {isActive ? <div style={{ position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, borderRadius: '50%', border: theme.mode === 'dark' ? '2px solid rgba(255,255,255,0.14)' : '3px solid rgba(255,255,255,0.38)', animation: 'stopBreathPulse 2.2s ease-out infinite' }} /> : null}
          {isActive ? <div style={{ position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, borderRadius: '50%', border: theme.mode === 'dark' ? '2px solid rgba(255,255,255,0.10)' : '3px solid rgba(255,255,255,0.28)', animation: 'stopBreathPulse 2.2s ease-out 1.1s infinite' }} /> : null}

          {isActive
            ? Array.from({ length: 10 }).map((_, index) => {
                const left = 40 + (index * 24) % 220
                const delay = (index % 5) * 0.32
                const size = 6 + (index % 3) * 4
                return (
                  <span
                    key={index}
                    style={{
                      position: 'absolute',
                      left,
                      bottom: 70 + (index % 4) * 10,
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: theme.mode === 'dark' ? 'rgba(191,219,254,0.55)' : 'rgba(255,255,255,0.75)',
                      animation: `stopBreathDrift 2.4s ease-out ${delay}s infinite`,
                      pointerEvents: 'none',
                    }}
                  />
                )
              })
            : null}

          <button
            type="button"
            onClick={() => setIsActive((current) => !current)}
            style={{
              width: 236,
              height: 236,
              borderRadius: '50%',
              border: 'none',
              background: `radial-gradient(circle, ${accent} 0%, ${accentHover} 100%)`,
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              transform: `scale(${scale})`,
              transition: 'transform 1000ms ease-in-out, background 1000ms ease-in-out, box-shadow 1000ms ease-in-out',
              boxShadow: `0 28px 80px ${phase === 'exhale' ? 'rgba(37,99,235,0.24)' : 'rgba(16,185,129,0.24)'}`,
            }}
          >
            <div>
              <div style={{ fontSize: 74, fontWeight: 900, lineHeight: 1 }}>{secondsVisible}</div>
              <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.96 }}>{isActive ? phaseTitles[phase] : 'Toca para iniciar'}</div>
            </div>
          </button>
        </div>

        <div style={{ textAlign: 'center', maxWidth: 360, margin: '0 auto 24px' }}>
          <div style={{ color: theme.mode === 'dark' ? '#e2e8f0' : '#334155', fontSize: 18, lineHeight: 1.6, marginBottom: 10 }}>
            {phaseCopy[phase]}
          </div>
          <div style={{ color: theme.subtle, fontSize: 15, lineHeight: 1.6 }}>
            Intenta completar al menos 3 ciclos para sentir el efecto completo.
          </div>
        </div>

        <div style={{ background: panelSurface, border: panelBorder, borderRadius: 24, padding: 18, boxShadow: panelShadow, transition: theme.transition }}>
          <div style={{ color: theme.muted, fontSize: 14, marginBottom: 12 }}>Si necesitas hablar con alguien:</div>
          <a href="tel:6006006000" style={{ display: 'block', width: '100%', borderRadius: 18, background: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', textAlign: 'center', padding: '15px 16px', fontSize: 16, fontWeight: 800, textDecoration: 'none', marginBottom: 14 }}>
            Llamar a línea de apoyo
          </a>
          <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.55 }}>
            {profile?.reason || 'Este minuto protege tu futuro.'} Cada vez que frenas el impulso, reduces el daño que esta conducta puede causar si sigue creciendo con el tiempo.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setSoundOn((current) => !current)} style={{ border: panelBorder, background: panelSurface, color: theme.muted, borderRadius: 999, padding: '12px 16px', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, transition: theme.transition }}>
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {soundOn ? 'Audio suave activo' : 'Audio opcional'}
          </button>
          <div style={{ border: panelBorder, background: panelSurface, color: theme.muted, borderRadius: 999, padding: '12px 16px', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, transition: theme.transition }}>
            <Wind size={16} />
            Respiración guiada
          </div>
        </div>
      </div>
    </div>
  )
}
