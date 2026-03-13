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
  const transition = 'background 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease, opacity 180ms ease'

  if (mode === 'dark') {
    return {
      mode,
      canvas:
        'radial-gradient(circle at 18% 0%, rgba(59,130,246,0.16), transparent 28%), radial-gradient(circle at 85% 10%, rgba(14,165,233,0.10), transparent 24%), linear-gradient(180deg, #020617 0%, #0b1120 44%, #0f172a 100%)',
      hero: 'linear-gradient(145deg, #0b1220 0%, #10213f 52%, #1d4ed8 100%)',
      heroMuted: 'linear-gradient(145deg, rgba(8,15,30,0.96) 0%, rgba(15,23,42,0.92) 100%)',
      surface: 'rgba(12,18,32,0.74)',
      elevated: 'rgba(15,23,42,0.90)',
      surfaceSolid: '#0f172a',
      border: 'rgba(148,163,184,0.16)',
      text: '#f8fafc',
      muted: '#cbd5e1',
      subtle: '#94a3b8',
      input: '#0f172a',
      pill: 'rgba(255,255,255,0.08)',
      info: 'rgba(8,47,73,0.72)',
      infoText: '#bae6fd',
      shadow: '0 24px 60px rgba(2,6,23,0.34)',
      ringTrack: 'rgba(255,255,255,0.10)',
      navSurface: 'rgba(15,23,42,0.94)',
      navBorder: 'rgba(148,163,184,0.24)',
      navItem: 'rgba(255,255,255,0.02)',
      navItemActive: 'linear-gradient(135deg, rgba(37,99,235,0.34) 0%, rgba(14,165,233,0.24) 100%)',
      navText: '#cbd5e1',
      navTextActive: '#eff6ff',
      navShadow: '0 24px 54px rgba(2,6,23,0.42)',
      segmentedSurface: 'rgba(15,23,42,0.86)',
      segmentedIdle: 'rgba(255,255,255,0.04)',
      segmentedActive: 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)',
      transition,
    }
  }

  return {
    mode,
    canvas:
      'radial-gradient(circle at 18% 0%, rgba(59,130,246,0.14), transparent 28%), radial-gradient(circle at 85% 10%, rgba(56,189,248,0.10), transparent 24%), linear-gradient(180deg, #f4f8ff 0%, #f8fbff 48%, #eef2f7 100%)',
    hero: 'linear-gradient(145deg, #0f172a 0%, #16325c 46%, #2563eb 100%)',
    heroMuted: 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(241,245,249,0.96) 100%)',
    surface: 'rgba(255,255,255,0.82)',
    elevated: 'rgba(255,255,255,0.94)',
    surfaceSolid: '#ffffff',
    border: 'rgba(148,163,184,0.15)',
    text: '#0f172a',
    muted: '#475569',
    subtle: '#64748b',
    input: '#ffffff',
    pill: 'rgba(255,255,255,0.14)',
    info: 'rgba(236,254,255,0.92)',
    infoText: '#155e75',
    shadow: '0 22px 52px rgba(15,23,42,0.08)',
    ringTrack: 'rgba(15,23,42,0.08)',
    navSurface: 'rgba(255,255,255,0.9)',
    navBorder: 'rgba(148,163,184,0.18)',
    navItem: 'rgba(248,250,252,0.92)',
    navItemActive: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
    navText: '#64748b',
    navTextActive: '#1d4ed8',
    navShadow: '0 22px 50px rgba(15,23,42,0.10)',
    segmentedSurface: 'rgba(255,255,255,0.94)',
    segmentedIdle: '#eef2f7',
    segmentedActive: 'linear-gradient(135deg, #1d4ed8 0%, #38bdf8 100%)',
    transition,
  }
}
