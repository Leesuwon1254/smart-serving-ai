import { useState, useEffect } from 'react'
import { VERSION } from '../version'
import { useWindowSize } from '../hooks/useWindowSize'

export default function Header({ title, subtitle }) {
  const [time, setTime] = useState(new Date())
  const { isMobile } = useWindowSize()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatted = time.toLocaleString('ko-KR', {
    month: 'long', day: 'numeric', weekday: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  return (
    <header className="header">
      <div>
        <div className="header-title">{title}</div>
        {subtitle && !isMobile && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div className="header-right">
        {!isMobile && <span className="header-time">{formatted}</span>}
        <span style={{
          fontSize: '11px',
          color: '#94a3b8',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          padding: '2px 6px',
          fontFamily: 'monospace',
        }}>
          v{VERSION}
        </span>
        <span className="status-badge online">
          <span className="dot" />
          {isMobile ? 'AI 분석 중' : 'AI 실시간 분석 중'}
        </span>
      </div>
    </header>
  )
}
