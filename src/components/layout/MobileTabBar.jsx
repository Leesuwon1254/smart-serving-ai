import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',         emoji: '🏠', label: '홈' },
  { to: '/cctv',     emoji: '📹', label: 'CCTV' },
  { to: '/behavior', emoji: '🔍', label: '행동분석' },
  { to: '/alerts',   emoji: '🔔', label: '알림' },
  { to: '/tables',   emoji: '🍽️', label: '테이블' },
]

export default function MobileTabBar() {
  return (
    <nav
      className="mobile-tabbar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: '#1e1b4b',
        borderTop: '1px solid #312e81',
        zIndex: 1000,
      }}
    >
      {tabs.map(({ to, emoji, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            color: isActive ? '#a5b4fc' : '#6b7280',
            textDecoration: 'none',
            fontSize: 10,
            padding: '6px 0',
            borderTop: isActive ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'color 0.15s',
          })}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
