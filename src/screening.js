export const pgsiOptions = [
  { label: 'Nunca', value: 0 },
  { label: 'A veces', value: 1 },
  { label: 'La mayor\u00eda de las veces', value: 2 },
  { label: 'Casi siempre', value: 3 },
]

export const pgsiQuestions = [
  'En los \u00faltimos 12 meses, \u00bfhas apostado m\u00e1s de lo que realmente pod\u00edas permitirte perder?',
  'En los \u00faltimos 12 meses, \u00bfhas necesitado apostar con m\u00e1s dinero para sentir la misma emoci\u00f3n?',
  'En los \u00faltimos 12 meses, \u00bfhas vuelto otro d\u00eda para intentar recuperar el dinero perdido?',
  'En los \u00faltimos 12 meses, \u00bfhas pedido dinero prestado o vendido algo para conseguir dinero para apostar?',
  'En los \u00faltimos 12 meses, \u00bfhas sentido que podr\u00edas tener un problema con el juego?',
  'En los \u00faltimos 12 meses, \u00bfapostar te ha causado problemas de salud, incluyendo estr\u00e9s o ansiedad?',
  'En los \u00faltimos 12 meses, \u00bfpersonas cercanas han criticado tu forma de apostar o te han dicho que es un problema?',
  'En los \u00faltimos 12 meses, \u00bfapostar te ha causado problemas econ\u00f3micos a ti o a tu hogar?',
  'En los \u00faltimos 12 meses, \u00bfte has sentido culpable por la forma en que apuestas o por lo que pasa cuando apuestas?',
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
      band: 'riesgo bajo',
      level: 'temprano',
      color: '#0f766e',
      copy: 'Ya hay se\u00f1ales iniciales. Cortarlo ahora puede evitar que esto tome mucho m\u00e1s espacio.',
    }
  }

  if (score <= 7) {
    return {
      band: 'riesgo moderado',
      level: 'moderado',
      color: '#b45309',
      copy: 'El juego ya est\u00e1 generando desgaste real. Vale la pena activar fricci\u00f3n, seguimiento y apoyo desde ahora.',
    }
  }

  return {
    band: 'riesgo alto',
    level: 'alto',
    color: '#b91c1c',
    copy: 'Este screening sugiere un nivel de riesgo alto. Necesitas m\u00e1s barreras, apoyo y una estrategia concreta para cortar el patr\u00f3n.',
  }
}
