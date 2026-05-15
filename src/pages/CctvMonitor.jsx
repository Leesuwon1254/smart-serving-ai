import { useRef, useEffect, useState, useCallback } from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
import * as Draw from '../utils/canvasDraw'

// ── 채널 메타 정보 ────────────────────────────────────
const CAM_DATA = [
  {
    id: 1, ch: 1, label: '홀 A', location: '메인홀 A구역',
    status: 'alert',
    alerts: ['빈 소주병 2개 감지', '젓가락 낙하 감지', '바닥 지갑 분실물'],
    analysis: ['테이블 1,2 식사 중 (고기불판 가동)', '재킷 의자 걸침 1건 — 장기 착석 예측', '지갑 분실물 — 즉시 안내 필요'],
  },
  {
    id: 2, ch: 2, label: '홀 B', location: '메인홀 B구역',
    status: 'warning',
    alerts: ['불판 연기 증가 감지', '핸드폰 방치 감지'],
    analysis: ['6인 테이블 만석 — 회전율 낮음', '소주병 3개 중 2개 빈 병', '재킷 걸침 2건 — 장기 체류 예측'],
  },
  {
    id: 3, ch: 3, label: '홀 C', location: '메인홀 C구역',
    status: 'info',
    alerts: ['계산 준비 감지 (카드)', '핸드폰 방치 감지', '열쇠 분실물'],
    analysis: ['2인 테이블 1곳 — 1명 착석, 조기 퇴석 가능', '카드 꺼냄 → 계산 의도 감지', '바닥 열쇠 분실물 — 확인 필요'],
  },
  {
    id: 4, ch: 4, label: '홀 D', location: '메인홀 D구역',
    status: 'ok',
    alerts: [],
    analysis: ['빈 테이블 2개 — 즉시 입석 가능', '테이블 정리 진행 중 1개', 'AI 예측: 15분 내 2테이블 가용'],
  },
  {
    id: 5, ch: 5, label: '홀 E', location: '메인홀 E구역',
    status: 'warning',
    alerts: ['물컵 소진 감지', '반찬 소진 감지'],
    analysis: ['4인 테이블 만석 — 식사 중', '물컵 잔량 10% 미만 감지', '반찬 그릇 비어있음 — 리필 필요'],
  },
  {
    id: 6, ch: 6, label: '입구', location: '입구/대기존',
    status: 'info',
    alerts: ['우산 방치 감지'],
    analysis: ['대기 손님 2명 감지', '평균 대기 시간: 약 8분 예측', '우산 분실물 — 입구 보관함 안내 필요'],
  },
]

const STATUS_COLOR = {
  alert: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  ok: '#22c55e',
}

const STATUS_LABEL = {
  alert: '긴급',
  warning: '주의',
  info: 'AI분석',
  ok: '정상',
}

// ── 가상 좌표계 (320×180) ─────────────────────────────
const VW = 320
const VH = 180

// ── 씬 렌더 함수들 ─────────────────────────────────────

function drawCam1(ctx, tick, noise) {
  Draw.drawBackground(ctx, VW, VH)
  Draw.drawGrid(ctx, VW, VH)
  Draw.drawSweep(ctx, VW, VH, tick)

  noise.forEach(n => {
    n.y = (n.y + n.speed) % VH
    Draw.drawNoiseLine(ctx, VW, n.y, n.alpha)
  })

  // 테이블1 (4인) — 좌상
  Draw.drawRectTable(ctx, 20, 20, 90, 55)
  Draw.drawPerson(ctx, 35, 18, tick, 0)
  Draw.drawPerson(ctx, 65, 18, tick, 1)
  Draw.drawPerson(ctx, 35, 80, tick, 2)
  Draw.drawPerson(ctx, 65, 80, tick, 3)
  Draw.drawHotPot(ctx, 65, 47, 12, tick)
  Draw.drawBowl(ctx, 30, 38, 5)
  Draw.drawBowl(ctx, 80, 38, 5)
  Draw.drawBowl(ctx, 30, 60, 4, '#4a7c59', '#1e4d2b')
  Draw.drawBowl(ctx, 80, 60, 4, '#4a7c59', '#1e4d2b')
  Draw.drawBottle(ctx, 44, 34, false)
  Draw.drawBottle(ctx, 51, 34, true)
  Draw.drawChopsticks(ctx, 38, 55, 0, true)
  Draw.drawChopsticks(ctx, 72, 55, 0, false)
  Draw.drawSpoon(ctx, 26, 47)
  Draw.drawDetectionBox(ctx, 49, 30, 14, 18, '#ef4444', '빈병감지', tick)
  Draw.drawDetectionBox(ctx, 30, 50, 18, 10, '#ef4444', '젓가락낙하', tick)

  // 테이블2 (4인) — 우상
  Draw.drawRectTable(ctx, 200, 20, 100, 55)
  Draw.drawPerson(ctx, 215, 18, tick, 4)
  Draw.drawPerson(ctx, 250, 18, tick, 5)
  Draw.drawPerson(ctx, 285, 18, tick, 6)
  Draw.drawPerson(ctx, 215, 80, tick, 7)
  Draw.drawPerson(ctx, 250, 80, tick, 8)
  Draw.drawPerson(ctx, 285, 80, tick, 9)
  Draw.drawGrillPlate(ctx, 220, 35, 60, 28, tick)
  Draw.drawBowl(ctx, 212, 38, 4)
  Draw.drawBowl(ctx, 212, 55, 4, '#4a7c59', '#1e4d2b')
  Draw.drawGlass(ctx, 290, 38, 0.6)
  Draw.drawGlass(ctx, 290, 52, 0.3)
  Draw.drawChopsticks(ctx, 225, 68, 0, false)
  Draw.drawChopsticks(ctx, 255, 68, 0, false)
  Draw.drawSpoon(ctx, 207, 47)
  Draw.drawJacket(ctx, 283, 85)
  Draw.drawDetectionBox(ctx, 280, 82, 20, 16, '#f59e0b', '재킷감지', tick)

  // 테이블3 (2인) — 좌하
  Draw.drawRectTable(ctx, 20, 105, 70, 40)
  Draw.drawPerson(ctx, 40, 102, tick, 10)
  Draw.drawPerson(ctx, 72, 102, tick, 11)
  Draw.drawBowl(ctx, 38, 125, 5)
  Draw.drawBowl(ctx, 72, 125, 5)
  Draw.drawGlass(ctx, 55, 118, 0.7)
  Draw.drawChopsticks(ctx, 45, 133, 0, false)
  Draw.drawSpoon(ctx, 28, 125)

  // 바닥 분실물 — 지갑
  Draw.drawFloorItem(ctx, 155, 140, 'wallet', tick)
  Draw.drawDetectionBox(ctx, 140, 128, 32, 24, '#ef4444', '분실물:지갑', tick)

  Draw.drawScanlines(ctx, VW, VH)
  Draw.drawTimestamp(ctx, VH, 1, tick)
}

function drawCam2(ctx, tick, noise) {
  Draw.drawBackground(ctx, VW, VH)
  Draw.drawGrid(ctx, VW, VH)
  Draw.drawSweep(ctx, VW, VH, tick, 'rgba(0,200,120,0.04)')

  noise.forEach(n => {
    n.y = (n.y + n.speed) % VH
    Draw.drawNoiseLine(ctx, VW, n.y, n.alpha)
  })

  // 6인 테이블 — 중앙 좌측
  Draw.drawRectTable(ctx, 15, 25, 130, 65)
  Draw.drawPerson(ctx, 30, 22, tick, 0)
  Draw.drawPerson(ctx, 75, 22, tick, 1)
  Draw.drawPerson(ctx, 120, 22, tick, 2)
  Draw.drawPerson(ctx, 30, 95, tick, 3)
  Draw.drawPerson(ctx, 75, 95, tick, 4)
  Draw.drawPerson(ctx, 120, 95, tick, 5)
  Draw.drawGrillPlate(ctx, 35, 38, 40, 22, tick)
  Draw.drawGrillPlate(ctx, 85, 38, 40, 22, tick)
  Draw.drawBottle(ctx, 22, 45, false)
  Draw.drawBottle(ctx, 29, 45, true)
  Draw.drawBottle(ctx, 36, 45, true)
  Draw.drawShotGlass(ctx, 50, 65)
  Draw.drawShotGlass(ctx, 58, 65)
  Draw.drawShotGlass(ctx, 66, 65)
  Draw.drawShotGlass(ctx, 74, 65)
  Draw.drawGlass(ctx, 136, 42, 0.6)
  Draw.drawGlass(ctx, 136, 55, 0.5)
  Draw.drawJacket(ctx, 27, 100)
  Draw.drawJacket(ctx, 118, 100)
  Draw.drawDetectionBox(ctx, 24, 97, 18, 16, '#f59e0b', '재킷', tick)
  Draw.drawDetectionBox(ctx, 115, 97, 18, 16, '#f59e0b', '재킷', tick)
  Draw.drawPhone(ctx, 110, 58)
  Draw.drawDetectionBox(ctx, 107, 54, 14, 16, '#3b82f6', '폰방치', tick)

  // 원형 테이블 4인 — 우측
  Draw.drawRoundTable(ctx, 245, 85, 45)
  Draw.drawPerson(ctx, 245, 38, tick, 6)
  Draw.drawPerson(ctx, 292, 85, tick, 7)
  Draw.drawPerson(ctx, 245, 132, tick, 8)
  Draw.drawPerson(ctx, 198, 85, tick, 9)
  Draw.drawHotPot(ctx, 245, 85, 14, tick)
  Draw.drawBowl(ctx, 232, 68, 5)
  Draw.drawBowl(ctx, 258, 68, 5)
  Draw.drawBowl(ctx, 232, 100, 5)
  Draw.drawBowl(ctx, 258, 100, 5)
  Draw.drawGlass(ctx, 275, 72, 0.7)
  Draw.drawGlass(ctx, 275, 88, 0.5)

  Draw.drawDetectionBox(ctx, 30, 22, 130, 75, '#f59e0b', '불판:연기증가', tick)

  Draw.drawScanlines(ctx, VW, VH)
  Draw.drawTimestamp(ctx, VH, 2, tick)
}

function drawCam3(ctx, tick, noise) {
  Draw.drawBackground(ctx, VW, VH)
  Draw.drawGrid(ctx, VW, VH)
  Draw.drawSweep(ctx, VW, VH, tick, 'rgba(0,150,200,0.04)')

  noise.forEach(n => {
    n.y = (n.y + n.speed) % VH
    Draw.drawNoiseLine(ctx, VW, n.y, n.alpha)
  })

  // 2인 테이블A
  Draw.drawRectTable(ctx, 15, 20, 65, 35)
  Draw.drawPerson(ctx, 30, 17, tick, 0)
  Draw.drawPerson(ctx, 65, 17, tick, 1)
  Draw.drawBowl(ctx, 32, 37, 5)
  Draw.drawBowl(ctx, 62, 37, 5)
  Draw.drawGlass(ctx, 47, 30, 0.7)
  Draw.drawChopsticks(ctx, 37, 48, 0, false)

  // 2인 테이블B (1명 착석, 가방 방치)
  Draw.drawRectTable(ctx, 15, 80, 65, 35)
  Draw.drawPerson(ctx, 30, 77, tick, 2)
  Draw.drawBag(ctx, 60, 85)
  Draw.drawDetectionBox(ctx, 56, 82, 18, 16, '#3b82f6', '가방방치', tick)
  Draw.drawBowl(ctx, 32, 97, 5)
  Draw.drawGlass(ctx, 47, 90, 0.4)

  // 2인 테이블C
  Draw.drawRectTable(ctx, 15, 137, 65, 35)
  Draw.drawPerson(ctx, 30, 134, tick, 3)
  Draw.drawPerson(ctx, 65, 134, tick, 4)
  Draw.drawBowl(ctx, 32, 154, 5)
  Draw.drawBowl(ctx, 62, 154, 5)
  Draw.drawGlass(ctx, 47, 148, 0.6)
  Draw.drawSpoon(ctx, 22, 155)

  // 원형 테이블 4인 — 우측
  Draw.drawRoundTable(ctx, 225, 90, 45)
  Draw.drawPerson(ctx, 225, 43, tick, 5)
  Draw.drawPerson(ctx, 272, 90, tick, 6)
  Draw.drawPerson(ctx, 225, 137, tick, 7)
  Draw.drawPerson(ctx, 178, 90, tick, 8)
  Draw.drawBowl(ctx, 212, 75, 5)
  Draw.drawBowl(ctx, 238, 75, 5)
  Draw.drawBowl(ctx, 212, 103, 5)
  Draw.drawBowl(ctx, 238, 103, 5)
  Draw.drawCard(ctx, 215, 110)
  Draw.drawDetectionBox(ctx, 212, 107, 28, 18, '#3b82f6', '계산감지', tick)

  Draw.drawPhone(ctx, 165, 88)
  Draw.drawDetectionBox(ctx, 161, 84, 14, 16, '#3b82f6', '폰방치', tick)

  Draw.drawFloorItem(ctx, 140, 155, 'key', tick)
  Draw.drawDetectionBox(ctx, 127, 143, 26, 24, '#ef4444', '분실물:열쇠', tick)

  Draw.drawScanlines(ctx, VW, VH)
  Draw.drawTimestamp(ctx, VH, 3, tick)
}

function drawCam4(ctx, tick, noise) {
  Draw.drawBackground(ctx, VW, VH)
  Draw.drawGrid(ctx, VW, VH)
  Draw.drawSweep(ctx, VW, VH, tick, 'rgba(0,200,100,0.03)')

  noise.forEach(n => {
    n.y = (n.y + n.speed) % VH
    Draw.drawNoiseLine(ctx, VW, n.y, n.alpha)
  })

  // 빈 테이블1
  Draw.drawRectTable(ctx, 25, 30, 80, 45, '#091520')
  ctx.fillStyle = 'rgba(34,197,94,0.15)'
  ctx.beginPath(); ctx.roundRect(25, 30, 80, 45, 3); ctx.fill()
  Draw.drawDetectionBox(ctx, 25, 30, 80, 45, '#22c55e', '가용:즉시', tick)

  // 빈 테이블2
  Draw.drawRectTable(ctx, 120, 30, 80, 45, '#091520')
  ctx.fillStyle = 'rgba(34,197,94,0.15)'
  ctx.beginPath(); ctx.roundRect(120, 30, 80, 45, 3); ctx.fill()
  Draw.drawDetectionBox(ctx, 120, 30, 80, 45, '#22c55e', '가용:즉시', tick)

  // 정리 중 테이블
  Draw.drawRectTable(ctx, 215, 30, 90, 45, '#0a1a0d')
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath(); ctx.ellipse(260, 52, 18, 8, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.ellipse(260, 52, 18, 8, 0.3, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = 'rgba(34,197,94,0.7)'
  ctx.font = '8px monospace'
  ctx.fillText('정리중', 242, 65)
  Draw.drawDetectionBox(ctx, 215, 30, 90, 45, '#22c55e', '정리중', tick)

  // 원형 빈 테이블
  Draw.drawRoundTable(ctx, 100, 135, 30)
  ctx.fillStyle = 'rgba(34,197,94,0.1)'
  ctx.beginPath(); ctx.arc(100, 135, 30, 0, Math.PI * 2); ctx.fill()
  Draw.drawDetectionBox(ctx, 68, 103, 64, 64, '#22c55e', '가용', tick)

  ctx.fillStyle = 'rgba(34,197,94,0.6)'
  ctx.font = '9px monospace'
  ctx.fillText('AI: 가용 테이블 3개 확인됨', 15, VH - 8)

  Draw.drawScanlines(ctx, VW, VH)
  Draw.drawTimestamp(ctx, VH, 4, tick)
}

function drawCam5(ctx, tick, noise) {
  Draw.drawBackground(ctx, VW, VH)
  Draw.drawGrid(ctx, VW, VH)
  Draw.drawSweep(ctx, VW, VH, tick, 'rgba(200,150,0,0.04)')

  noise.forEach(n => {
    n.y = (n.y + n.speed) % VH
    Draw.drawNoiseLine(ctx, VW, n.y, n.alpha)
  })

  // 2인 테이블A
  Draw.drawRectTable(ctx, 15, 20, 65, 35)
  Draw.drawPerson(ctx, 30, 17, tick, 0)
  Draw.drawPerson(ctx, 65, 17, tick, 1)
  Draw.drawBowl(ctx, 32, 37, 5)
  Draw.drawBowl(ctx, 62, 37, 5)
  Draw.drawGlass(ctx, 47, 30, 0.05)
  Draw.drawDetectionBox(ctx, 43, 27, 14, 16, '#f59e0b', '물소진', tick)
  Draw.drawChopsticks(ctx, 37, 48, 0, false)
  Draw.drawSpoon(ctx, 22, 37)

  // 2인 테이블B
  Draw.drawRectTable(ctx, 15, 80, 65, 35)
  Draw.drawPerson(ctx, 30, 77, tick, 2)
  Draw.drawPerson(ctx, 65, 77, tick, 3)
  Draw.drawBowl(ctx, 32, 97, 5)
  Draw.drawBowl(ctx, 62, 97, 5)
  Draw.drawGlass(ctx, 47, 90, 0.6)
  Draw.drawBowl(ctx, 47, 108, 4, '#1e293b', '#0f172a')
  Draw.drawDetectionBox(ctx, 43, 104, 14, 12, '#f59e0b', '반찬소진', tick)

  // 4인 테이블 — 우측
  Draw.drawRectTable(ctx, 185, 30, 120, 65)
  Draw.drawPerson(ctx, 205, 27, tick, 4)
  Draw.drawPerson(ctx, 260, 27, tick, 5)
  Draw.drawPerson(ctx, 205, 100, tick, 6)
  Draw.drawPerson(ctx, 260, 100, tick, 7)
  Draw.drawGrillPlate(ctx, 200, 45, 90, 36, tick)
  Draw.drawBowl(ctx, 186, 45, 5)
  Draw.drawBowl(ctx, 186, 65, 5)
  Draw.drawBowl(ctx, 296, 45, 5)
  Draw.drawBowl(ctx, 296, 65, 5)
  Draw.drawGlass(ctx, 300, 83, 0.08)
  Draw.drawDetectionBox(ctx, 296, 80, 14, 16, '#f59e0b', '물소진', tick)
  Draw.drawBottle(ctx, 297, 45, false)
  Draw.drawBottle(ctx, 304, 45, true)
  Draw.drawChopsticks(ctx, 210, 88, 0, false)
  Draw.drawChopsticks(ctx, 265, 88, 0, false)
  Draw.drawSpoon(ctx, 180, 63)

  ctx.fillStyle = 'rgba(245,158,11,0.6)'
  ctx.font = '9px monospace'
  ctx.fillText('주의: 물컵/반찬 보충 필요', 15, VH - 8)

  Draw.drawScanlines(ctx, VW, VH)
  Draw.drawTimestamp(ctx, VH, 5, tick)
}

function drawCam6(ctx, tick, noise) {
  Draw.drawBackground(ctx, VW, VH)
  Draw.drawGrid(ctx, VW, VH)
  Draw.drawSweep(ctx, VW, VH, tick, 'rgba(0,120,200,0.04)')

  noise.forEach(n => {
    n.y = (n.y + n.speed) % VH
    Draw.drawNoiseLine(ctx, VW, n.y, n.alpha)
  })

  // 문 프레임
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 3
  ctx.strokeRect(110, 40, 100, VH - 40)
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2
  ctx.strokeRect(113, 43, 94, VH - 46)
  ctx.fillStyle = 'rgba(51,65,85,0.5)'
  ctx.fillRect(110, 30, 100, 12)
  ctx.fillStyle = 'rgba(148,163,184,0.6)'
  ctx.font = '8px monospace'
  ctx.fillText('ENTRANCE', 125, 39)
  ctx.fillStyle = '#94a3b8'
  ctx.beginPath(); ctx.arc(195, 115, 3, 0, Math.PI * 2); ctx.fill()

  // 대기 손님 1
  Draw.drawPerson(ctx, 65, 110, tick, 0)
  Draw.drawDetectionBox(ctx, 54, 95, 24, 32, '#3b82f6', '대기:1', tick)

  // 대기 손님 2
  Draw.drawPerson(ctx, 245, 115, tick, 1)
  Draw.drawDetectionBox(ctx, 234, 100, 24, 32, '#3b82f6', '대기:2', tick)

  // 우산 분실물
  Draw.drawFloorItem(ctx, 90, 158, 'umbrella', tick)
  Draw.drawDetectionBox(ctx, 77, 146, 28, 24, '#ef4444', '분실물:우산', tick)

  ctx.fillStyle = 'rgba(96,165,250,0.6)'
  ctx.font = '9px monospace'
  ctx.fillText('대기: 2명 | 예상 8분', 15, VH - 8)

  Draw.drawScanlines(ctx, VW, VH)
  Draw.drawTimestamp(ctx, VH, 6, tick)
}

const SCENE_FUNCS = [drawCam1, drawCam2, drawCam3, drawCam4, drawCam5, drawCam6]

function drawScene(ctx, camIdx, tick, noise, actualW, actualH) {
  ctx.save()
  ctx.scale(actualW / VW, actualH / VH)
  SCENE_FUNCS[camIdx](ctx, tick, noise)
  ctx.restore()
}

// ── 컴포넌트 ────────────────────────────────────────────

export default function CctvMonitor() {
  const { isMobile } = useWindowSize()
  const canvasRefs = useRef([])
  const tickRef = useRef(0)
  const noiseRef = useRef(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 8 }, () => ({
        y: Math.random() * VH,
        alpha: 0.02 + Math.random() * 0.06,
        speed: 0.3 + Math.random() * 0.9,
      }))
    )
  )
  const [selectedCam, setSelectedCam] = useState(null)
  const modalCanvasRef = useRef(null)
  const modalTickRef = useRef(0)
  const modalNoiseRef = useRef(
    Array.from({ length: 8 }, () => ({
      y: Math.random() * VH,
      alpha: 0.02 + Math.random() * 0.06,
      speed: 0.3 + Math.random() * 0.9,
    }))
  )

  useEffect(() => {
    let animId
    const loop = () => {
      tickRef.current++
      canvasRefs.current.forEach((canvas, i) => {
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        drawScene(ctx, i, tickRef.current, noiseRef.current[i], canvas.width, canvas.height)
      })
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  useEffect(() => {
    if (selectedCam === null) return
    let animId
    const loop = () => {
      modalTickRef.current++
      const canvas = modalCanvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        drawScene(ctx, selectedCam, modalTickRef.current, modalNoiseRef.current, canvas.width, canvas.height)
      }
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [selectedCam])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setSelectedCam(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleCamClick = useCallback((idx) => {
    modalNoiseRef.current = Array.from({ length: 8 }, () => ({
      y: Math.random() * VH,
      alpha: 0.02 + Math.random() * 0.06,
      speed: 0.3 + Math.random() * 0.9,
    }))
    modalTickRef.current = tickRef.current
    setSelectedCam(idx)
  }, [])

  const camW = isMobile ? Math.floor((window.innerWidth - 32) / 2) : 280
  const camH = Math.round(camW * 9 / 16)

  const cam = selectedCam !== null ? CAM_DATA[selectedCam] : null

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', background: '#0a0f1a', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: '#e2e8f0' }}>
            CCTV 실시간 모니터
          </div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 2 }}>
            AI 객체 인식 시뮬레이션 — 6채널 실시간 분석 중
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[k] }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 채널 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? 8 : 16,
        marginBottom: 16,
      }}>
        {CAM_DATA.map((camItem, idx) => (
          <div
            key={camItem.id}
            onClick={() => handleCamClick(idx)}
            style={{
              background: '#0d1520',
              border: `1px solid ${STATUS_COLOR[camItem.status]}33`,
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = STATUS_COLOR[camItem.status] + '88'
              e.currentTarget.style.transform = 'scale(1.01)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = STATUS_COLOR[camItem.status] + '33'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <div style={{
              padding: '6px 10px',
              background: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: STATUS_COLOR[camItem.status],
                  boxShadow: `0 0 6px ${STATUS_COLOR[camItem.status]}`,
                }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>
                  CH{camItem.ch} {camItem.label}
                </span>
              </div>
              <span style={{
                fontSize: 10,
                color: STATUS_COLOR[camItem.status],
                background: STATUS_COLOR[camItem.status] + '22',
                padding: '1px 6px',
                borderRadius: 4,
                fontWeight: 600,
              }}>
                {STATUS_LABEL[camItem.status]}
              </span>
            </div>

            <canvas
              ref={el => canvasRefs.current[idx] = el}
              width={camW}
              height={camH}
              style={{ display: 'block', width: '100%' }}
            />

            {camItem.alerts.length > 0 && (
              <div style={{ padding: '6px 10px', borderTop: '1px solid #1e293b' }}>
                {camItem.alerts.slice(0, isMobile ? 1 : 2).map((a, i) => (
                  <div key={i} style={{ fontSize: 10, color: STATUS_COLOR[camItem.status], marginBottom: i < camItem.alerts.length - 1 ? 2 : 0 }}>
                    ▸ {a}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 감지 항목 범례 */}
      <div style={{
        background: '#0d1520',
        border: '1px solid #1e293b',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: isMobile ? 80 : 0,
      }}>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 10, fontFamily: 'monospace' }}>
          AI 감지 항목 범례
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 8 : 16 }}>
          {[
            { color: '#ef4444', label: '긴급 — 분실물 / 빈 병 / 젓가락 낙하' },
            { color: '#f59e0b', label: '주의 — 재킷 감지 / 물·반찬 소진' },
            { color: '#3b82f6', label: 'AI분석 — 계산 감지 / 가방·폰 방치' },
            { color: '#22c55e', label: '정상 — 가용 테이블 / 정리 완료' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: color + '33', border: `1.5px solid ${color}`, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 클릭 확대 모달 */}
      {selectedCam !== null && cam && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setSelectedCam(null)}
        >
          <div
            style={{
              background: '#0d1520',
              border: `1px solid ${STATUS_COLOR[cam.status]}44`,
              borderRadius: 12, overflow: 'hidden', maxWidth: 560, width: '100%',
              boxShadow: `0 0 40px ${STATUS_COLOR[cam.status]}22`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '12px 16px', background: '#111827',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: STATUS_COLOR[cam.status],
                  boxShadow: `0 0 8px ${STATUS_COLOR[cam.status]}`,
                }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>
                  CH{cam.ch} — {cam.label} ({cam.location})
                </span>
              </div>
              <button
                onClick={() => setSelectedCam(null)}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px',
                }}
              >✕</button>
            </div>

            <canvas
              ref={modalCanvasRef}
              width={480}
              height={270}
              style={{ display: 'block', width: '100%' }}
            />

            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 600, marginBottom: 8, fontFamily: 'monospace' }}>
                AI 분석 결과
              </div>
              {cam.analysis.map((a, i) => (
                <div key={i} style={{
                  fontSize: 12, color: '#cbd5e1', marginBottom: 5,
                  padding: '6px 10px', background: '#111827', borderRadius: 6,
                  borderLeft: `2px solid ${STATUS_COLOR[cam.status]}`,
                }}>
                  {a}
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 10, color: '#475569', textAlign: 'right', fontFamily: 'monospace' }}>
                ESC 또는 바깥 클릭으로 닫기
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
