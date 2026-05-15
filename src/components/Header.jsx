import { useState, useEffect } from 'react'

export default function Header({ title, subtitle }) {
  const [time, setTime] = useState(new Date())

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
        {subtitle && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div className="header-right">
        <span className="header-time">{formatted}</span>
        <span className="status-badge online">
          <span className="dot" />
          AI 실시간 분석 중
        </span>
      </div>
    </header>
  )
}
