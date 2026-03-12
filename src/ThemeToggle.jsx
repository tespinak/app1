import { Moon, SunMedium } from 'lucide-react'
import { getTheme } from './theme.js'

export default function ThemeToggle({ mode, onToggle }) {
  const theme = getTheme(mode)

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: 46,
        height: 46,
        borderRadius: '50%',
        border: `1px solid ${theme.border}`,
        background: theme.surface,
        backdropFilter: 'blur(14px)',
        color: theme.text,
        display: 'grid',
        placeItems: 'center',
        boxShadow: theme.shadow,
      }}
    >
      {mode === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  )
}