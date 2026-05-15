import { useState, useEffect } from 'react'
import { VERSION, CHANGELOG } from '../../version'

const typeConfig = {
  major: {
    emoji: '🚀',
    label: '메이저 업데이트',
    gradient: 'linear-gradient(135deg, #1F3864 0%, #2E75B6 100%)',
  },
  minor: {
    emoji: '⚡',
    label: '기능 업데이트',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
  },
  patch: {
    emoji: '🔧',
    label: '패치',
    gradient: 'linear-gradient(135deg, #374151 0%, #6B7280 100%)',
  },
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`
}

export default function VersionUpdateModal() {
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)
  const currentLog = CHANGELOG.find(c => c.version === VERSION)

  useEffect(() => {
    const lastSeen = localStorage.getItem('ssa_last_seen_version')
    if (lastSeen !== VERSION) {
      setShow(true)
      requestAnimationFrame(() => setVisible(true))
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      localStorage.setItem('ssa_last_seen_version', VERSION)
      setShow(false)
    }, 300)
  }

  if (!show || !currentLog) return null

  const cfg = typeConfig[currentLog.type] || typeConfig.patch

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px) scale(0.95); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .vsm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        .vsm-overlay.hide {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .vsm-modal {
          background: #ffffff;
          border-radius: 16px;
          max-width: 480px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.25);
          animation: slideUp 0.3s ease;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .vsm-modal.hide {
          transform: translateY(20px) scale(0.97);
          opacity: 0;
        }
        .vsm-header {
          padding: 28px 28px 24px;
          color: #ffffff;
          position: relative;
        }
        .vsm-emoji {
          font-size: 32px;
          margin-bottom: 10px;
          display: block;
        }
        .vsm-brand {
          font-size: 13px;
          font-weight: 600;
          opacity: 0.8;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .vsm-version-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .vsm-version-badge {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .vsm-type-badge {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
        }
        .vsm-body {
          padding: 24px 28px;
        }
        .vsm-title {
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .vsm-date {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 18px;
        }
        .vsm-changes {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .vsm-changes li {
          font-size: 14px;
          color: #334155;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .vsm-footer {
          padding: 0 28px 24px;
        }
        .vsm-confirm-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: #6366f1;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .vsm-confirm-btn:hover { background: #4f46e5; }
        .vsm-confirm-btn:active { transform: scale(0.98); }
        .vsm-hint {
          text-align: center;
          font-size: 11px;
          color: #cbd5e1;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .vsm-overlay {
            align-items: flex-end;
            padding: 0;
            padding-bottom: 60px;
          }
          .vsm-modal {
            max-width: 100%;
            border-radius: 16px 16px 0 0;
            animation: slideUpSheet 0.35s ease;
          }
          .vsm-modal.hide {
            transform: translateY(100%);
            opacity: 1;
          }
        }
      `}</style>

      <div
        className={`vsm-overlay${!visible ? ' hide' : ''}`}
        onClick={handleClose}
      >
        <div
          className={`vsm-modal${!visible ? ' hide' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="vsm-header" style={{ background: cfg.gradient }}>
            <span className="vsm-emoji">{cfg.emoji}</span>
            <div className="vsm-brand">Smart Serving AI</div>
            <div className="vsm-version-row">
              <span className="vsm-version-badge">v{currentLog.version}</span>
              <span className="vsm-type-badge">{cfg.label}</span>
            </div>
          </div>

          {/* Body */}
          <div className="vsm-body">
            <div className="vsm-title">{currentLog.title}</div>
            <div className="vsm-date">{formatDate(currentLog.date)}</div>
            <ul className="vsm-changes">
              {currentLog.changes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="vsm-footer">
            <button className="vsm-confirm-btn" onClick={handleClose}>
              확인했습니다 ✓
            </button>
            <div className="vsm-hint">다음 업데이트 시 다시 표시됩니다</div>
          </div>
        </div>
      </div>
    </>
  )
}
