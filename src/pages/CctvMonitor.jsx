import { useEffect, useRef, useState, useCallback } from 'react'
import Header from '../components/Header'

const CAM_DATA = [
  {
    id: 1, label: 'CAM 1 · 테이블 1~3구역', status: 'urgent',
    alertBadge: '긴급', alertColor: '#ef4444',
    aiLines: [
      { text: '⚠ 3번 테이블 — 빈 병 + 젓가락 낙하 감지', color: '#f87171' },
      { text: '⚡ 추가 주문 확률 91% · 즉시 응대 권장', color: '#fbbf24' },
    ],
    people: [{ x: 70, y: 45 }, { x: 90, y: 45 }, { x: 80, y: 55 }],
    bboxes: [
      { x: 52, y: 36, w: 76, h: 58, color: '#ef4444', label: '빈 병' },
      { x: 130, y: 55, w: 24, h: 20, color: '#f59e0b', label: '낙하' },
    ],
    tint: [0, 15, 0],
  },
  {
    id: 2, label: 'CAM 2 · 테이블 4~6구역', status: 'warning',
    alertBadge: '주의', alertColor: '#f59e0b',
    aiLines: [
      { text: '⚡ 5번 테이블 — 깍두기 소진 85% 감지', color: '#fbbf24' },
      { text: '✓ 리필 가능성 84% · 2분 내 준비 권장', color: '#4ade80' },
    ],
    people: [{ x: 65, y: 48 }, { x: 85, y: 48 }],
    bboxes: [{ x: 46, y: 38, w: 80, h: 52, color: '#f59e0b', label: '반찬 소진' }],
    tint: [0, 10, 5],
  },
  {
    id: 3, label: 'CAM 3 · 테이블 7~9구역', status: 'ai',
    alertBadge: 'AI 분석', alertColor: '#3b82f6',
    aiLines: [
      { text: '◉ 7번 테이블 — 체류 58분 · 카드 꺼냄 감지', color: '#60a5fa' },
      { text: '⚡ 계산 가능성 78% · POS 준비 권장', color: '#fbbf24' },
    ],
    people: [{ x: 68, y: 44 }, { x: 88, y: 44 }, { x: 78, y: 44 }, { x: 108, y: 44 }],
    bboxes: [{ x: 50, y: 34, w: 90, h: 60, color: '#3b82f6', label: '카드 감지' }],
    tint: [0, 8, 15],
  },
  {
    id: 4, label: 'CAM 4 · 테이블 10~12구역', status: 'ok',
    alertBadge: null, alertColor: null,
    aiLines: [{ text: '✓ 이상 없음 · 10번 테이블 가용 상태', color: '#4ade80' }],
    people: [],
    bboxes: [],
    tint: [0, 12, 2],
  },
  {
    id: 5, label: 'CAM 5 · 테이블 13~15구역', status: 'ok',
    alertBadge: null, alertColor: null,
    aiLines: [
      { text: '◉ 13번 테이블 — 4인 착석 · 패턴 학습 중', color: '#60a5fa' },
      { text: '체류 22분 · 특이사항 없음', color: '#64748b' },
    ],
    people: [{ x: 72, y: 46 }, { x: 92, y: 46 }, { x: 82, y: 46 }, { x: 102, y: 46 }],
    bboxes: [{ x: 54, y: 36, w: 90, h: 58, color: '#3b82f6', label: '패턴 분석' }],
    tint: [0, 10, 8],
  },
  {
    id: 6, label: 'CAM 6 · 입구 / 홀 전경', status: 'ok',
    alertBadge: null, alertColor: null,
    aiLines: [{ text: '✓ 정상 · 신규 입장 대기 없음', color: '#4ade80' }],
    people: [{ x: 120, y: 60 }],
    bboxes: [],
    tint: [2, 12, 0],
  },
]

function drawCamera(canvas, cam, frame) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const t = frame * 0.016

  // 1. 어두운 배경
  ctx.fillStyle = `rgb(${6 + cam.tint[0]},${10 + cam.tint[1]},${8 + cam.tint[2]})`
  ctx.fillRect(0, 0, W, H)

  // 2. AI 격자 오버레이
  ctx.strokeStyle = 'rgba(0,255,80,0.04)'
  ctx.lineWidth = 0.5
  const grid = 20
  for (let x = 0; x <= W; x += grid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y <= H; y += grid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // 3. 테이블 영역 (채널별 위치 다르게)
  const tableOffset = (cam.id - 1) * 18
  ctx.fillStyle = 'rgba(0,60,30,0.5)'
  ctx.strokeStyle = 'rgba(0,200,80,0.2)'
  ctx.lineWidth = 1
  const tx = 30 + tableOffset * 0.3, ty = 55 + tableOffset * 0.1
  ctx.fillRect(tx, ty, 50, 30)
  ctx.strokeRect(tx, ty, 50, 30)
  if (cam.id <= 4) {
    ctx.fillRect(tx + 65, ty - 5, 50, 30)
    ctx.strokeRect(tx + 65, ty - 5, 50, 30)
  }

  // 4. 사람 실루엣
  const bob = Math.sin(t * 0.8 + cam.id) * 1.5
  cam.people.forEach((p, i) => {
    const px = p.x * (W / 200), py = (p.y + bob * (i % 2 === 0 ? 1 : -0.5)) * (H / 120)
    ctx.fillStyle = 'rgba(180,220,200,0.65)'
    // 몸체
    ctx.fillRect(px - 7, py - 8, 14, 20)
    // 머리
    ctx.beginPath()
    ctx.arc(px, py - 12, 6, 0, Math.PI * 2)
    ctx.fill()
  })

  // 5. 채널별 특수 오브젝트
  if (cam.id === 1) {
    // 빈 병 (초록 사각형)
    ctx.fillStyle = 'rgba(0,180,80,0.6)'
    ctx.fillRect(110 * (W / 200), 68 * (H / 120), 8, 18)
    // 기울어진 젓가락 (주황 선)
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(100 * (W / 200), 82 * (H / 120))
    ctx.lineTo(120 * (W / 200), 86 * (H / 120))
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(103 * (W / 200), 80 * (H / 120))
    ctx.lineTo(122 * (W / 200), 84 * (H / 120))
    ctx.stroke()
  }
  if (cam.id === 2) {
    // 거의 빈 반찬 접시 (타원, 노란 테두리)
    ctx.strokeStyle = 'rgba(250,204,21,0.7)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.ellipse(85 * (W / 200), 72 * (H / 120), 14, 7, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = 'rgba(250,204,21,0.15)'
    ctx.fill()
  }
  if (cam.id === 3) {
    // 카드 (파란 사각형)
    ctx.fillStyle = 'rgba(59,130,246,0.55)'
    ctx.strokeStyle = 'rgba(147,197,253,0.8)'
    ctx.lineWidth = 1
    ctx.fillRect(118 * (W / 200), 60 * (H / 120), 18, 11)
    ctx.strokeRect(118 * (W / 200), 60 * (H / 120), 18, 11)
  }
  if (cam.id === 6) {
    // 출입구 문 프레임
    ctx.strokeStyle = 'rgba(0,255,80,0.25)'
    ctx.lineWidth = 2
    ctx.strokeRect(148 * (W / 200), 20 * (H / 120), 32, 70)
    ctx.beginPath()
    ctx.moveTo(164 * (W / 200), 20 * (H / 120))
    ctx.lineTo(164 * (W / 200), 90 * (H / 120))
    ctx.stroke()
  }

  // 6. AI 감지 박스 (펄스)
  cam.bboxes.forEach((box, bi) => {
    const pulse = 0.6 + 0.4 * Math.sin(t * 2.5 + bi * 1.2)
    const bx = box.x * (W / 200), by = box.y * (H / 120)
    const bw = box.w * (W / 200), bh = box.h * (H / 120)
    ctx.globalAlpha = pulse
    ctx.strokeStyle = box.color
    ctx.lineWidth = 1.5
    ctx.strokeRect(bx, by, bw, bh)

    // L자 코너 마커
    const cs = 8
    ctx.lineWidth = 3
    ;[[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(([cx, cy], ci) => {
      const sx = ci === 1 || ci === 3 ? -1 : 1
      const sy = ci >= 2 ? -1 : 1
      ctx.beginPath(); ctx.moveTo(cx, cy + sy * cs); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * cs, cy); ctx.stroke()
    })

    // 라벨 칩
    ctx.globalAlpha = pulse * 0.92
    ctx.fillStyle = box.color
    ctx.font = `bold ${Math.max(9, W * 0.052)}px monospace`
    const tw = ctx.measureText(box.label).width
    ctx.fillRect(bx, by - 16, tw + 8, 15)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(box.label, bx + 4, by - 4)
    ctx.globalAlpha = 1
  })

  // 7. 녹색 스위프 라인
  const sweepY = ((t * 28 + cam.id * 22) % (H + 20)) - 10
  const grad = ctx.createLinearGradient(0, sweepY - 12, 0, sweepY + 12)
  grad.addColorStop(0, 'rgba(0,255,80,0)')
  grad.addColorStop(0.5, 'rgba(0,255,80,0.18)')
  grad.addColorStop(1, 'rgba(0,255,80,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, sweepY - 12, W, 24)

  // 8. 노이즈 라인
  for (let n = 0; n < 8; n++) {
    const ny = ((t * (12 + n * 3) + n * 37 + cam.id * 13) % (H + 5))
    ctx.fillStyle = `rgba(200,255,220,${0.03 + Math.random() * 0.04})`
    ctx.fillRect(0, ny, W, 1 + (n % 2))
  }

  // 9. 스캔라인 효과
  for (let y = 0; y < H; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    ctx.fillRect(0, y, W, 1)
  }

  // 10. 타임스탬프 + 채널번호 워터마크
  const now = new Date()
  const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
  ctx.font = `bold ${Math.max(9, W * 0.05)}px monospace`
  ctx.fillStyle = 'rgba(0,255,80,0.6)'
  ctx.fillText(`CH${cam.id}  ${ts}`, 6, H - 7)
}

function CameraCanvas({ cam, size, onClick }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let running = true
    function loop() {
      if (!running) return
      frameRef.current++
      drawCamera(canvasRef.current, cam, frameRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [cam])

  const statusDot = cam.status === 'urgent' ? '#ef4444' : cam.status === 'warning' ? '#f59e0b' : '#22c55e'

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
        border: `2px solid ${cam.status === 'urgent' ? '#ef4444' : cam.status === 'warning' ? '#f59e0b' : '#1e3a2e'}`,
        boxShadow: cam.status === 'urgent'
          ? '0 0 16px rgba(239,68,68,0.4)'
          : cam.status === 'warning' ? '0 0 12px rgba(245,158,11,0.3)' : 'none',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* 좌상단 채널명 */}
      <div style={{
        position: 'absolute', top: 6, left: 6,
        display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,0,0,0.65)', borderRadius: 4,
        padding: '3px 7px', backdropFilter: 'blur(2px)',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusDot, boxShadow: `0 0 6px ${statusDot}` }} />
        <span style={{ color: '#e2e8f0', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }}>{cam.label}</span>
      </div>

      {/* 우상단 배지 */}
      {cam.alertBadge && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          background: cam.alertColor, color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
        }}>
          {cam.alertBadge}
        </div>
      )}

      {/* 하단 AI 분석 바 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)',
        padding: '5px 8px',
      }}>
        {cam.aiLines.map((line, i) => (
          <div key={i} style={{ color: line.color, fontSize: 10, fontFamily: 'monospace', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function CameraModal({ cam, onClose }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let running = true
    function loop() {
      if (!running) return
      frameRef.current++
      drawCamera(canvasRef.current, cam, frameRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [cam])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 900 }}>
        {/* 모달 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: '#4ade80', fontFamily: 'monospace', fontWeight: 700, fontSize: 15 }}>
            ● {cam.label}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 18 }}
          >✕</button>
        </div>

        {/* 큰 canvas */}
        <canvas
          ref={canvasRef}
          width={880}
          height={495}
          style={{ width: '100%', borderRadius: 8, border: `2px solid ${cam.alertColor || '#1e3a2e'}`, display: 'block' }}
        />

        {/* AI 분석 결과 상세 */}
        <div style={{ marginTop: 12, background: 'rgba(0,20,10,0.9)', borderRadius: 8, padding: '12px 16px', border: '1px solid rgba(0,255,80,0.15)' }}>
          <div style={{ color: '#4ade80', fontSize: 11, fontFamily: 'monospace', marginBottom: 8, fontWeight: 700 }}>AI ANALYSIS RESULT</div>
          {cam.aiLines.map((line, i) => (
            <div key={i} style={{ color: line.color, fontSize: 13, fontFamily: 'monospace', lineHeight: 1.8 }}>{line.text}</div>
          ))}
        </div>
        <div style={{ color: '#475569', fontSize: 11, textAlign: 'center', marginTop: 8 }}>ESC 또는 바깥 클릭으로 닫기</div>
      </div>
    </div>
  )
}

export default function CctvMonitor() {
  const [selectedCam, setSelectedCam] = useState(null)
  const [detectCount, setDetectCount] = useState(12)
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDetectCount(c => c + 1)
      forceUpdate(n => n + 1)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const canvasSize = { w: 320, h: 180 }

  return (
    <>
      <style>{`
        .cctv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 900px) { .cctv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .cctv-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* 상단 topbar */}
      <div style={{
        background: '#0a0f0a', borderBottom: '1px solid #1a3a1e',
        padding: '10px 20px', display: 'flex', alignItems: 'center',
        gap: 16, flexShrink: 0, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444', animation: 'pulse 1s infinite' }} />
          <span style={{ color: '#4ade80', fontFamily: 'monospace', fontWeight: 700, fontSize: 14 }}>CCTV 실시간 모니터</span>
        </div>
        <span style={{ color: '#475569', fontSize: 12, fontFamily: 'monospace' }}>카메라 {CAM_DATA.length}채널 연결됨</span>
        <span style={{
          background: 'rgba(0,255,80,0.1)', border: '1px solid rgba(0,255,80,0.3)',
          color: '#4ade80', fontSize: 11, fontFamily: 'monospace', padding: '2px 10px', borderRadius: 4,
        }}>● AI 분석 중</span>
        <span style={{ marginLeft: 'auto', color: '#475569', fontSize: 11, fontFamily: 'monospace' }}>
          {new Date().toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      <div style={{ padding: 16, background: '#060c06', minHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>

        {/* 카메라 그리드 */}
        <div className="cctv-grid" style={{ marginBottom: 16 }}>
          {CAM_DATA.map(cam => (
            <CameraCanvas
              key={cam.id}
              cam={cam}
              size={canvasSize}
              onClick={() => setSelectedCam(cam)}
            />
          ))}
        </div>

        {/* 하단 통계 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'AI 감지 이벤트', value: detectCount, color: '#4ade80', unit: '건' },
            { label: '긴급 알림', value: 2, color: '#ef4444', unit: '건' },
            { label: '평균 감지 정확도', value: '91.4', color: '#60a5fa', unit: '%' },
            { label: '점유 테이블', value: '7 / 15', color: '#fbbf24', unit: '' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(0,20,10,0.8)', border: '1px solid rgba(0,255,80,0.1)',
              borderRadius: 8, padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ color: stat.color, fontSize: 24, fontWeight: 700, fontFamily: 'monospace' }}>
                {stat.value}{stat.unit}
              </div>
              <div style={{ color: '#475569', fontSize: 11, marginTop: 4, fontFamily: 'monospace' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 확대 모달 */}
      {selectedCam && <CameraModal cam={selectedCam} onClose={() => setSelectedCam(null)} />}
    </>
  )
}
