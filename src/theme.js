export const THEME_STORAGE_KEY = 'stop_theme_mode'

export function loadThemeMode() {
  if (typeof window === 'undefined') return 'light'
  return window.localStorage.getItem(THEME_STORAGE_KEY) || 'light'
}

export function saveThemeMode(mode) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_STORAGE_KEY, mode)
}

export function getTheme(mode = 'light') {
  if (mode === 'dark') {
    return {
      mode,
      canvas:
        'radial-gradient(circle at 18% 0%, rgba(59,130,246,0.22), transparent 28%), radial-gradient(circle at 85% 10%, rgba(16,185,129,0.16), transparent 22%), linear-gradient(180deg, #020617 0%, #0f172a 45%, #111827 100%)',
      hero: 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 74%, #38bdf8 100%)',
      surface: 'rgba(15,23,42,0.76)',
      elevated: 'rgba(15,23,42,0.88)',
      surfaceSolid: '#111827',
      border: 'rgba(148,163,184,0.16)',
      text: '#f8fafc',
      muted: '#cbd5e1',
      subtle: '#94a3b8',
      input: '#0f172a',
      pill: 'rgba(255,255,255,0.10)',
      info: '#082f49',
      infoText: '#bae6fd',
      shadow: '0 22px 50px rgba(0,0,0,0.28)',
    }
  }

  return {
    mode,
    canvas:
      'radial-gradient(circle at 18% 0%, rgba(37,99,235,0.18), transparent 26%), radial-gradient(circle at 85% 10%, rgba(16,185,129,0.14), transparent 24%), linear-gradient(180deg, #eef4ff 0%, #f8fbff 45%, #eef2f7 100%)',
    hero: 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 78%, #38bdf8 100%)',
    surface: 'rgba(255,255,255,0.82)',
    elevated: 'rgba(255,255,255,0.92)',
    surfaceSolid: '#ffffff',
    border: 'rgba(148,163,184,0.14)',
    text: '#0f172a',
    muted: '#475569',
    subtle: '#64748b',
    input: '#ffffff',
    pill: 'rgba(255,255,255,0.12)',
    info: '#ecfeff',
    infoText: '#155e75',
    shadow: '0 18px 40px rgba(15,23,42,0.06)',
  }
}