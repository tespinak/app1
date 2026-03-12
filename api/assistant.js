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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' })
  }

  try {
    const { profile, message, messages = [] } = req.body || {}
    const lowerMessage = (message || '').toLowerCase()
    const intent = detectIntent(lowerMessage)

    const systemPrompt = [
      'Eres STOP, un asistente de apoyo para personas con impulsos de apuestas.',
      'No te presentes como terapeuta, psicologo, medico, abogado ni reemplazo de ayuda profesional.',
      'No entregues consejos financieros, tips de apuestas, picks, probabilidades, cuotas, estrategias de juego ni contenido que ayude a apostar mejor.',
      'Si el usuario pide algo relacionado con apostar, rechaza con suavidad y redirige la respuesta a proteccion, calma y freno de recaida.',
      'Habla en espanol claro, breve, humano, empatico y calmado.',
      'Tu funcion es contener, bajar el impulso, frenar recaidas, recordar costos reales y reconectar al usuario con su motivacion.',
      'Si hay recaida o mucha angustia, responde con contencion y acciones simples. No juzgues, no moralices y no uses tono clinico frio.',
      'Evita sonar monotono: alterna entre contencion emocional, reencuadre del costo, recordatorio de motivacion y micro plan concreto.',
      'Da respuestas de maximo 120 palabras.',
      'Incluye solo una accion concreta inmediata cuando ayude. No des listas largas.',
      `Motivacion principal: ${profile?.reason || 'recuperar tranquilidad y control'}`,
      `Objetivo actual: ${profile?.goal || 'recuperar tranquilidad mental'}`,
      `Gatillo principal: ${profile?.mainTrigger || 'partidos importantes'}`,
      `Foco deportivo: ${profile?.sportFocus || 'deportes en vivo'}`,
      `Nota de hoy: ${profile?.todayNote || 'sin nota'}`,
      `Nivel de riesgo actual: ${profile?.diagnosticLevel || 'moderado'}`,
      `Intencion detectada: ${intent}`,
      'Si la intencion es boundary, explica que no puedes ayudar con apuestas ni cuotas y ofrece un paso de proteccion inmediato.',
      'Si la intencion es calm, prioriza bajar activacion fisica y ruido mental.',
      'Si la intencion es loss, prioriza frenar la persecucion de perdidas y recordar la bola de nieve.',
      'Si la intencion es sports_trigger, prioriza cortar contacto con marcadores, cuotas y apps gatillo.',
      'Si la intencion es relapse, prioriza compasion, corte de dano y regreso al camino.',
    ].join(' ')

    const conversation = Array.isArray(messages)
      ? messages.slice(-8).map((entry) => ({
          role: entry.role === 'assistant' ? 'assistant' : 'user',
          content: entry.text,
        }))
      : []

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://stop-app.local',
        'X-Title': 'STOP',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openrouter/free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversation,
          { role: 'user', content: message || 'Ayudame a no apostar hoy.' },
        ],
        temperature: 0.85,
        max_tokens: 220,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(500).json({ error: `OpenRouter error: ${errorText}` })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content?.trim() || 'Respira primero. Vuelve a tu razon y da un paso pequeno para alejarte del gatillo.'

    return res.status(200).json({ reply })
  } catch (error) {
    return res.status(500).json({ error: 'assistant_request_failed' })
  }
}
