function detectIntent(lowerMessage) {
  if (
    lowerMessage.includes('cuota') ||
    lowerMessage.includes('pick') ||
    lowerMessage.includes('parlay') ||
    lowerMessage.includes('apuesta') ||
    lowerMessage.includes('que juego') ||
    lowerMessage.includes('que apuesto')
  ) {
    return 'boundary'
  }

  if (lowerMessage.includes('perdi') || lowerMessage.includes('perd') || lowerMessage.includes('recuperar')) {
    return 'loss'
  }

  if (lowerMessage.includes('reca') || lowerMessage.includes('cai') || lowerMessage.includes('volvi')) {
    return 'relapse'
  }

  if (
    lowerMessage.includes('ansiedad') ||
    lowerMessage.includes('nerv') ||
    lowerMessage.includes('impulso') ||
    lowerMessage.includes('panico')
  ) {
    return 'calm'
  }

  if (
    lowerMessage.includes('nba') ||
    lowerMessage.includes('tenis') ||
    lowerMessage.includes('partido') ||
    lowerMessage.includes('flashscore') ||
    lowerMessage.includes('sofascore')
  ) {
    return 'sports_trigger'
  }

  return 'support'
}

function resolveGroqModel() {
  const configuredModel = process.env.GROQ_MODEL?.trim()

  if (!configuredModel) {
    return 'llama-3.1-8b-instant'
  }

  return configuredModel
}

function extractReply(data) {
  const content = data?.choices?.[0]?.message?.content

  if (typeof content === 'string' && content.trim()) {
    return content.trim()
  }

  if (Array.isArray(content)) {
    const textParts = content
      .map((item) => {
        if (typeof item === 'string') return item
        if (item?.type === 'text' && typeof item.text === 'string') return item.text
        return ''
      })
      .filter(Boolean)

    if (textParts.length > 0) {
      return textParts.join('\n').trim()
    }
  }

  return ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY?.trim()

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY' })
  }

  try {
    const { profile, message, messages = [] } = req.body || {}
    const lowerMessage = (message || '').toLowerCase()
    const intent = detectIntent(lowerMessage)
    const model = resolveGroqModel()

    const systemPrompt = [
      'Eres STOP, un asistente de apoyo para personas con impulsos de apuestas.',
      'No te presentes como terapeuta, psicólogo, médico, abogado ni reemplazo de ayuda profesional.',
      'No entregues consejos financieros, tips de apuestas, picks, probabilidades, cuotas, estrategias de juego ni contenido que ayude a apostar mejor.',
      'Si el usuario pide algo relacionado con apostar, rechaza con suavidad y redirige la respuesta a protección, calma y freno de recaída.',
      'Habla en español claro, breve, humano, empático y calmado.',
      'Tu función es contener, bajar el impulso, frenar recaídas, recordar costos reales y reconectar al usuario con su motivación.',
      'Si hay recaída o mucha angustia, responde con contención y acciones simples. No juzgues, no moralices y no uses tono clínico frío.',
      'Evita sonar monótono: alterna entre contención emocional, reencuadre del costo, recordatorio de motivación y micro plan concreto.',
      'Da respuestas de máximo 140 palabras.',
      'Incluye solo una acción concreta inmediata cuando ayude. No des listas largas.',
      `Motivación principal: ${profile?.reason || 'recuperar tranquilidad y control'}`,
      `Objetivo actual: ${profile?.goal || 'recuperar tranquilidad mental'}`,
      `Gatillo principal: ${profile?.mainTrigger || 'partidos importantes'}`,
      `Foco deportivo: ${profile?.sportFocus || 'deportes en vivo'}`,
      `Nota de hoy: ${profile?.todayNote || 'sin nota'}`,
      `Nivel de riesgo actual: ${profile?.diagnosticLevel || 'moderado'}`,
      `Intención detectada: ${intent}`,
      'Si la intención es boundary, explica que no puedes ayudar con apuestas ni cuotas y ofrece un paso de protección inmediato.',
      'Si la intención es calm, prioriza bajar activación física y ruido mental.',
      'Si la intención es loss, prioriza frenar la persecución de pérdidas y recordar la bola de nieve.',
      'Si la intención es sports_trigger, prioriza cortar contacto con marcadores, cuotas y apps gatillo.',
      'Si la intención es relapse, prioriza compasión, corte de daño y regreso al camino.',
      'Nunca repitas exactamente la misma frase genérica de cierre en todos los casos.',
    ].join(' ')

    const conversation = Array.isArray(messages)
      ? messages.slice(-8).map((entry) => ({
          role: entry.role === 'assistant' ? 'assistant' : 'user',
          content: entry.text,
        }))
      : []

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversation,
          { role: 'user', content: message || 'Ayúdame a no apostar hoy.' },
        ],
        temperature: 0.9,
        max_tokens: 260,
      }),
    })

    const rawText = await response.text()
    let data = null

    try {
      data = rawText ? JSON.parse(rawText) : null
    } catch {
      data = null
    }

    if (!response.ok) {
      return res.status(500).json({ error: `Groq error with model ${model}: ${rawText}` })
    }

    const reply = extractReply(data)

    if (!reply) {
      return res.status(500).json({ error: `Groq returned no reply with model ${model}: ${rawText.slice(0, 500)}` })
    }

    return res.status(200).json({ reply, model })
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'assistant_request_failed' })
  }
}