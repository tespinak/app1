import { ArrowLeft, Bot, SendHorizonal, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buildFallbackReply, requestAssistantReply } from './assistantService.js'
import BottomNav from './BottomNav.jsx'
import { getTheme } from './theme.js'

const quickPrompts = [
  'Me gatilló un partido',
  'Perdí dinero y quiero recuperarlo',
  'Tengo ansiedad y ganas de apostar',
  'Recuérdame por qué empecé',
  'Recaí hoy',
]

function buildInitialMessages(profile) {
  const messages = [
    {
      role: 'assistant',
      text: `Estoy aquí para ayudarte a ordenar este momento, ${profile.name}.`,
    },
    {
      role: 'assistant',
      text: `Puedo ayudarte a bajar el impulso, recordar por qué empezaste y dar un paso más claro.`,
    },
  ]

  if (profile.todayNote) {
    messages.push({ role: 'user', text: profile.todayNote })
    messages.push({
      role: 'assistant',
      text: 'Tomo eso como contexto de hoy para responderte mejor.',
    })
  }

  return messages
}

export default function Assistant({ profile, currentScreen = 'assistant', onNavigate, onBack, themeMode }) {
  const theme = getTheme(themeMode)
  const border = `1px solid ${theme.mode === 'dark' ? theme.border : (theme.borderStrong || theme.border)}`
  const [messages, setMessages] = useState(() => buildInitialMessages(profile))
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const helperCopy = useMemo(() => {
    if ((profile.sportFocus || '').toLowerCase().includes('nba') || (profile.sportFocus || '').toLowerCase().includes('tenis')) {
      return `Puede ayudarte a ordenar mejor lo que sientes cuando se acerquen jornadas sensibles de ${profile.sportFocus}.`
    }

    return 'Un espacio para ayudarte a ordenar lo que estás sintiendo y dar un paso más claro.'
  }, [profile])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
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
    <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
      <style>{`@keyframes stopFadeUp { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
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
            }}
          >
            <ArrowLeft size={14} />
            Volver
          </button>
        </div>

        <section
          style={{
            background: theme.surface,
            borderRadius: 24,
            padding: 18,
            boxShadow: theme.shadow,
            border,
            marginBottom: 18,
            animation: 'stopFadeUp 260ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Bot size={18} color={theme.mode === 'dark' ? '#93c5fd' : '#1d4ed8'} />
              <div style={{ fontWeight: 900, color: theme.text }}>Asistente STOP</div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: theme.mode === 'dark' ? 'rgba(37,99,235,0.16)' : '#eff6ff', borderRadius: 999, padding: '7px 10px', color: theme.mode === 'dark' ? '#dbeafe' : '#1d4ed8', fontSize: 12, fontWeight: 800 }}>
              <Sparkles size={14} />
              IA activa
            </div>
          </div>
          <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>{helperCopy}</div>
        </section>

        <section
          style={{
            background: theme.surface,
            borderRadius: 24,
            padding: 18,
            boxShadow: theme.shadow,
            border,
            marginBottom: 18,
            animation: 'stopFadeUp 320ms ease',
          }}
        >
          <div style={{ fontWeight: 900, color: theme.text, marginBottom: 10 }}>Escribe o elige una de estas opciones</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {quickPrompts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => sendMessage(item)}
                style={{
                  border,
                  borderRadius: 999,
                  padding: '10px 14px',
                  fontWeight: 800,
                  background: theme.mode === 'dark' ? 'rgba(15,23,42,0.82)' : '#f8fafc',
                  color: theme.text,
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            placeholder="Escríbeme cómo te sientes, qué te gatilló hoy o qué está haciendo ruido..."
            style={{
              width: '100%',
              border,
              borderRadius: 18,
              padding: '14px 16px',
              resize: 'vertical',
              background: theme.input,
              color: theme.text,
              marginBottom: 12,
              fontFamily: 'inherit',
            }}
          />
          <button
            type="button"
            onClick={() => sendMessage(draft)}
            disabled={loading || !draft.trim()}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 22,
              padding: '14px 16px',
              background: loading || !draft.trim() ? '#94a3b8' : 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%)',
              color: '#fff',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: loading || !draft.trim() ? 'none' : '0 20px 45px rgba(29,78,216,0.18)',
            }}
          >
            <SendHorizonal size={16} />
            {loading ? 'Pensando...' : 'Enviar'}
          </button>
        </section>

        {status ? (
          <div
            style={{
              background: status.includes('Fallback') ? '#fef3c7' : theme.info,
              color: status.includes('Fallback') ? '#92400e' : theme.infoText,
              borderRadius: 18,
              padding: '12px 14px',
              marginBottom: 14,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {status}
          </div>
        ) : null}

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              style={{
                background: message.role === 'assistant' ? theme.surface : theme.mode === 'dark' ? 'rgba(30,64,175,0.32)' : 'rgba(219,234,254,0.92)',
                borderRadius: 24,
                padding: 16,
                border,
                boxShadow: theme.shadow,
                color: theme.text,
                lineHeight: 1.6,
              }}
            >
              {message.text}
            </div>
          ))}
        </div>

        <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
      </div>
    </div>
  )
}
