import { BookOpen, Crown, House, MessageCircleHeart, SquarePen } from 'lucide-react'

const items = [
  { key: 'home', label: 'Inicio', icon: House },
  { key: 'education', label: 'Aprende', icon: BookOpen },
  { key: 'premium', label: 'Pro', icon: Crown },
  { key: 'assistant', label: 'IA', icon: MessageCircleHeart },
  { key: 'checkin', label: 'Check-in', icon: SquarePen },
]

export default function BottomNav({ current, onNavigate, theme }) {
  return (
    <nav
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 14,
        transform: 'translateX(-50%)',
        width: 'min(460px, calc(100% - 24px))',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 8,
        padding: 10,
        borderRadius: 26,
        background: theme.navSurface,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.navBorder}`,
        boxShadow: theme.navShadow,
        zIndex: 30,
        transition: theme.transition,
      }}
    >
      {items.map(({ key, label, icon: Icon }) => {
        const active = current === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onNavigate(key)}
            style={{
              border: active ? `1px solid ${theme.mode === 'dark' ? 'rgba(147,197,253,0.18)' : 'rgba(59,130,246,0.16)'}` : '1px solid transparent',
              borderRadius: 18,
              padding: '10px 6px 9px',
              background: active ? theme.navItemActive : theme.navItem,
              color: active ? theme.navTextActive : theme.navText,
              display: 'grid',
              placeItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 800,
              boxShadow: active ? (theme.mode === 'dark' ? '0 10px 24px rgba(14,165,233,0.16)' : '0 10px 24px rgba(37,99,235,0.12)') : 'none',
              transition: theme.transition,
            }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
