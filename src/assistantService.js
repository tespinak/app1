export async function requestAssistantReply(profile, message, messages = []) {
  const response = await fetch('/api/assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile, message, messages }),
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    throw new Error(errorPayload.error || 'assistant_request_failed')
  }

  const payload = await response.json()
  return payload.reply
}

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
    lowerMessage.includes('mal') ||
    lowerMessage.includes('impulso') ||
    lowerMessage.includes('panico') ||
    lowerMessage.includes('nerv')
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

export function buildFallbackReply(profile, message) {
  const lowerMessage = message.toLowerCase()
  const intent = detectIntent(lowerMessage)

  if (intent === 'boundary') {
    return 'No puedo ayudar con apuestas, cuotas ni decisiones de juego. Si ese tema te activó, salgamos de ahí y volvamos a algo que sí te proteja: cortar el estímulo, bajar el ruido mental y recordar por qué empezaste este cambio.'
  }

  if (intent === 'sports_trigger') {
    return `Si hoy te activaron ${profile.sportFocus}, no intentes negociar con la urgencia. Aléjate de marcadores, cuotas y apps de resultados por un bloque largo. Primero baja el ruido mental; después decides.`
  }

  if (intent === 'loss') {
    return `Perseguir pérdidas casi siempre agranda la bola de nieve. Hoy el objetivo no es recuperar dinero: es frenar más daño. Vuelve a tu razón: ${profile.reason}`
  }

  if (intent === 'relapse') {
    return 'Una recaída no borra todo lo que ya construiste. Lo urgente ahora no es castigarte, sino cortar la cadena, salir del gatillo y elegir una acción pequeña que te devuelva control.'
  }

  if (intent === 'calm') {
    return `Cuando aparezca ese ruido, vuelve a tu razón: ${profile.reason}. Usa el botón rojo, respira 90 segundos y corta el contacto con ${profile.mainTrigger}.`
  }

  return `Te leo. Lo importante ahora es volver a tu norte: recuperar ${profile.goal.toLowerCase()}. No necesitas resolver toda tu vida hoy, solo dar un paso pequeño y concreto que te aleje del impulso.`
}