import { ArrowLeft, Bot, HeartHandshake, MessageSquareHeart, SendHorizonal, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buildFallbackReply, requestAssistantReply } from './assistantService.js'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'

function buildInitialMessages(profile) {
  const messages = [
    { role: 'assistant', text: `No soy terapeuta ni reemplazo ayuda profesional, pero sí puedo acompañarte y ayudarte a ordenar este momento contigo, ${profile.name}.` },
    { role: 'assistant', text: `Tu foco hoy es recuperar ${profile.goal.toLowerCase()} y tener más claridad cuando te gatilla ${profile.mainTrigger}.` },
  ]

  if (profile.todayNote) {
    messages.push({ role: 'user', text: profile.todayNote })
    messages.push({ role: 'assistant', text: 'Tomo esa nota como contexto del día. Voy a responderte teniendo en cuenta lo que pasó hoy, tu razón personal y el deporte que más te enciende el impulso.' })
  }

  return messages
}

export default function Assistant({ profile, onBack, onOpenCheckIn, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [messages, setMessages] = useState(() => buildInitialMessages(profile))
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const helperCopy = useMemo(() => {
    if ((profile.sportFocus || '').toLowerCase().includes('nba') || (profile.sportFocus || '').toLowerCase().includes('tenis')) {
      return `Puedo ayudarte especialmente cuando se acerquen jornadas sensibles de ${profile.sportFocus}.`
    }

    return 'Puedo ayudarte a bajar el ruido mental, volver a tu razón y sugerir pasos concretos.'
  }, [profile])

  const handleSend = async () => {
    const trimmed = draft.trim()
    if (!trimmed || loading) return

    const nextMessages = [...messages, { role: 'user', text: trimmed }]
    setMessages(nextMessages)
    setDraft('')
    setLoading(true)
    setStatus('')

    try {
      const reply = await requestAssistantReply(profile, trimmed, nextMessages)
      setMessages((current) => [...current, { role: 'assistant', text: reply }])
      setStatus('Respuesta generada con IA.')
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', text: buildFallbackReply(profile, trimmed) }])
      setStatus(`Fallback local activo: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 40px', background: theme.canvas }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={onBack} style={{ border: `1px solid ${theme.border}`, background: theme.surface, backdropFilter: 'blur(14px)', color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={14} />
            Volver
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <section style={{ background: theme.hero, color: '#fff', borderRadius: 30, padding: 22, boxShadow: theme.shadow, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Bot size={18} color="#93c5fd" /><div style={{ fontWeight: 800 }}>Asistente STOP</div></div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '7px 10px', color: '#dbeafe', fontSize: 12, fontWeight: 800 }}><Sparkles size={14} />IA activa</div>
          </div>
          <div style={{ color: '#dbeafe', lineHeight: 1.6, marginBottom: 10 }}>Este espacio funciona como apoyo emocional y reflexivo. Puede ayudarte a ordenar el impulso, recordar tu razón y sugerir pasos concretos. No reemplaza terapia ni atención profesional.</div>
          <div style={{ color: '#bfdbfe', lineHeight: 1.55, fontSize: 13 }}>{helperCopy}</div>
        </section>

        {status && <div style={{ background: status.includes('Fallback') ? '#fef3c7' : theme.info, color: status.includes('Fallback') ? '#92400e' : theme.infoText, borderRadius: 18, padding: '12px 14px', marginBottom: 14, fontSize: 13, fontWeight: 700 }}>{status}</div>}

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} style={{ background: message.role === 'assistant' ? theme.surface : theme.mode === 'dark' ? 'rgba(30,64,175,0.32)' : 'rgba(219,234,254,0.92)', backdropFilter: 'blur(14px)', borderRadius: 24, padding: 18, boxShadow: theme.shadow, border: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>{message.role === 'assistant' ? <MessageSquareHeart size={16} color="#1d4ed8" /> : <HeartHandshake size={16} color="#0f766e" />}<div style={{ fontSize: 12, fontWeight: 900, color: theme.subtle }}>{message.role === 'assistant' ? 'APOYO STOP' : 'TU MENSAJE'}</div></div>
              <div style={{ color: theme.text, lineHeight: 1.6 }}>{message.text}</div>
            </div>
          ))}
        </div>

        <section style={{ background: theme.surface, backdropFilter: 'blur(16px)', borderRadius: 24, padding: 18, boxShadow: theme.shadow, border: `1px solid ${theme.border}`, marginBottom: 18 }}>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder="Escríbeme cómo te sientes, qué te gatilló hoy o qué partido te está haciendo ruido..." style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 18, padding: '14px 16px', resize: 'vertical', background: theme.input, color: theme.text, marginBottom: 12, fontFamily: 'inherit' }} />
          <button type="button" onClick={handleSend} disabled={loading || !draft.trim()} style={{ width: '100%', border: 'none', borderRadius: 22, padding: '14px 16px', background: loading || !draft.trim() ? '#cbd5e1' : 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: loading || !draft.trim() ? 'none' : '0 20px 45px rgba(29,78,216,0.18)' }}>
            <SendHorizonal size={16} />
            {loading ? 'Pensando...' : 'Enviar al asistente'}
          </button>
        </section>

        <section style={{ background: theme.info, borderRadius: 24, padding: 18, color: theme.infoText, lineHeight: 1.55, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 800 }}><ShieldCheck size={16} />Lo siguiente que podría hacer por ti</div>
          Si conectamos esto mejor, el asistente podría cruzar tu historial, tu check-in y jornadas sensibles de {profile.sportFocus} para prepararte antes del gatillo.
        </section>

        <button type="button" onClick={onOpenCheckIn} style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 22, padding: '16px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800 }}>Hacer check-in y actualizar contexto</button>
      </div>
    </div>
  )
}