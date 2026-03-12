export const pgsiOptions = [
  { label: 'Nunca', value: 0 },
  { label: 'A veces', value: 1 },
  { label: 'La mayoría de las veces', value: 2 },
  { label: 'Casi siempre', value: 3 },
]

export const pgsiQuestions = [
  'En los últimos 12 meses, ¿has apostado más de lo que realmente podías permitirte perder?',
  'En los últimos 12 meses, ¿has necesitado apostar con más dinero para sentir la misma emoción?',
  'En los últimos 12 meses, ¿has vuelto otro día para intentar recuperar el dinero perdido?',
  'En los últimos 12 meses, ¿has pedido dinero prestado o vendido algo para conseguir dinero para apostar?',
  'En los últimos 12 meses, ¿has sentido que podrías tener un problema con el juego?',
  'En los últimos 12 meses, ¿apostar te ha causado problemas de salud, incluyendo estrés o ansiedad?',
  'En los últimos 12 meses, ¿personas cercanas han criticado tu forma de apostar o te han dicho que es un problema?',
  'En los últimos 12 meses, ¿apostar te ha causado problemas económicos a ti o a tu hogar?',
  'En los últimos 12 meses, ¿te has sentido culpable por la forma en que apuestas o por lo que pasa cuando apuestas?',
]

export function getPgsiResult(score) {
  if (score === 0) {
    return {
      band: 'sin riesgo aparente',
      level: 'temprano',
      color: '#0f766e',
      copy: 'Hoy no aparece señal de problema en este screening, pero aun así la app puede ayudarte a mantener límites claros.',
    }
  }

  if (score <= 2) {
    return {
      band: 'riesgo bajo',
      level: 'temprano',
      color: '#0f766e',
      copy: 'Ya hay señales iniciales. Cortarlo ahora puede evitar que esto tome mucho más espacio.',
    }
  }

  if (score <= 7) {
    return {
      band: 'riesgo moderado',
      level: 'moderado',
      color: '#b45309',
      copy: 'El juego ya está generando desgaste real. Vale la pena activar fricción, seguimiento y apoyo desde ahora.',
    }
  }

  return {
    band: 'riesgo alto',
    level: 'alto',
    color: '#b91c1c',
    copy: 'Este screening sugiere un nivel de riesgo alto. Necesitas más barreras, apoyo y una estrategia concreta para cortar el patrón.',
  }
}