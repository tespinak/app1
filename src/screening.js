export const pgsiOptions = [
  { label: 'Nunca', value: 0 },
  { label: 'A veces', value: 1 },
  { label: 'La mayor\u00eda de las veces', value: 2 },
  { label: 'Casi siempre', value: 3 },
]

export const pgsiQuestions = [
  '\u00bfHas apostado m\u00e1s de lo que realmente pod\u00edas permitirte perder?',
  '\u00bfHas necesitado apostar con m\u00e1s dinero para sentir la misma emoci\u00f3n?',
  '\u00bfHas vuelto otro d\u00eda para intentar recuperar el dinero perdido?',
  '\u00bfHas pedido dinero prestado o vendido algo para conseguir dinero para apostar?',
  '\u00bfHas sentido que podr\u00edas tener un problema con el juego?',
  '\u00bfApostar te ha causado problemas de salud, incluyendo estr\u00e9s o ansiedad?',
  '\u00bfPersonas cercanas han criticado tu forma de apostar o te han dicho que es un problema?',
  '\u00bfApostar te ha causado problemas econ\u00f3micos a ti o a tu hogar?',
  '\u00bfTe has sentido culpable por la forma en que apuestas o por lo que pasa cuando apuestas?',
]

export function getPgsiResult(score) {
  if (score === 0) {
    return {
      band: 'sin riesgo aparente',
      level: 'temprano',
      color: '#0f766e',
      copy: 'Hoy no aparece se\u00f1al de problema en este screening, pero aun as\u00ed la app puede ayudarte a mantener l\u00edmites claros.',
    }
  }

  if (score <= 2) {
    return {
      band: 'riesgo inicial',
      level: 'temprano',
      color: '#0f766e',
      copy: 'Ya hay se\u00f1ales iniciales. Este es un buen momento para poner l\u00edmites antes de que el patr\u00f3n tome m\u00e1s espacio.',
    }
  }

  if (score <= 7) {
    return {
      band: 'riesgo moderado',
      level: 'moderado',
      color: '#b45309',
      copy: 'El juego ya est\u00e1 generando desgaste real. Vale la pena activar seguimiento y m\u00e1s estructura desde ahora.',
    }
  }

  if (score <= 15) {
    return {
      band: 'riesgo alto',
      level: 'alto',
      color: '#dc2626',
      copy: 'El patr\u00f3n ya est\u00e1 pegando fuerte en tu energ\u00eda, tu dinero o tu tranquilidad. Necesitas m\u00e1s barreras y m\u00e1s apoyo.',
    }
  }

  return {
    band: 'riesgo muy alto',
    level: 'alto',
    color: '#b91c1c',
    copy: 'Este screening muestra una se\u00f1al de riesgo muy alta. Conviene intervenir con seriedad y sumar apoyo sostenido cuanto antes.',
  }
}
