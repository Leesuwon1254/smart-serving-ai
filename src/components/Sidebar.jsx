import { NavLink } from 'react-router-dom'
import { alertsData } from '../data/mockData'
import { VERSION } from '../version'

const unreadCount = alertsData.filter(a => a.unread).length

const navItems = [
  { to: '/',          icon: '🏠', label: '대시보드' },
  { to: '/tables',    icon: '🍽️', label: '테이블 현황' },
  { to: '/alerts',    icon: '🔔', label: '실시간 알림', badge: unreadCount },
  { to: '/analytics', icon: '📊', label: '분석 리포트' },
  { to: '/settings',  icon: '⚙️', label: '설정' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Smart Serving AI</h1>
        <p>AI 기반 레스토랑 관리 시스템</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">메인 메뉴</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge > 0 && <span className="badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div>AI 엔진 <span style={{ fontSize: '11px', opacity: 0.5 }}>v{VERSION}</span></div>
        <div style={{ marginTop: 4, color: '#6ee7b7' }}>모델 정확도: 94.2%</div>
      </div>
    </aside>
  )
}
