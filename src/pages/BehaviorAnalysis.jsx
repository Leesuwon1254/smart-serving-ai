import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { useWindowSize } from '../hooks/useWindowSize'

// ── Mock 데이터 ──────────────────────────────────────────────
const TABLE_BEHAVIOR = {
  1: {
    status: 'urgent', guests: 3, startTime: '13:12', duration: 58,
    cam: { id: 1, label: 'CAM 1 · 테이블 1~3구역', tint: [0,15,0], people: [{x:70,y:45},{x:90,y:45},{x:80,y:55}], bboxes: [{x:52,y:36,w:76,h:58,color:'#ef4444',label:'빈 병'}] },
    timeline: [
      { time: '13:12', label: '착석 · 주문', level: 1.0, color: '#22c55e' },
      { time: '13:28', label: '음식 섭취 활발', level: 0.8, color: '#3b82f6' },
      { time: '13:45', label: '빈 병 감지', level: 0.55, color: '#f59e0b' },
      { time: '14:05', label: '젓가락 낙하 감지', level: 0.2, color: '#ef4444' },
    ],
    signals: { refill: 91, water: 55, drink: 78, payment: 30, leave: 20, call: 8 },
    aiRecommend: '빈 병 및 젓가락 낙하 감지. 즉시 테이블 방문하여 새 수저 제공 및 추가 주문 유도 권장. 추가 주문 확률 91%.',
    voiceHistory: [
      { level: '긴급', text: '"3번 테이블, 수저가 떨어졌습니다. 새 수저를 즉시 가져다 주세요."', time: '방금 전', cam: 'CAM 1' },
      { level: '주의', text: '"1번 테이블, 음료가 소진됐습니다. 추가 주문 안내 권장합니다."', time: '5분 전', cam: 'CAM 1' },
    ],
  },
  5: {
    status: 'warning', guests: 2, startTime: '13:58', duration: 34,
    cam: { id: 2, label: 'CAM 2 · 테이블 4~6구역', tint: [0,10,5], people: [{x:65,y:48},{x:85,y:48}], bboxes: [{x:46,y:38,w:80,h:52,color:'#f59e0b',label:'반찬 소진'}] },
    timeline: [
      { time: '13:58', label: '착석 · 주문', level: 1.0, color: '#22c55e' },
      { time: '14:10', label: '음식 섭취 활발', level: 0.75, color: '#3b82f6' },
      { time: '14:22', label: '반찬 소진 시작', level: 0.4, color: '#f59e0b' },
      { time: '14:32', label: '깍두기 거의 소진', level: 0.2, color: '#ef4444' },
    ],
    signals: { refill: 85, water: 65, drink: 42, payment: 18, leave: 12, call: 5 },
    aiRecommend: '깍두기 리필을 먼저 준비 후 테이블 방문. 물 상태도 함께 확인. 음료 추가 주문 자연스럽게 제안 가능.',
    voiceHistory: [
      { level: '긴급', text: '"3번 테이블, 수저가 떨어졌습니다. 새 수저를 즉시 가져다 주세요."', time: '방금 전', cam: 'CAM 1' },
      { level: '주의', text: '"5번 테이블, 깍두기가 거의 소진됐습니다. 리필 준비 후 방문 바랍니다."', time: '1분 전', cam: 'CAM 2' },
      { level: '정보', text: '"7번 테이블, 체류 58분 경과. 카드를 꺼내는 동작이 감지됐습니다."', time: '3분 전', cam: 'CAM 3' },
    ],
  },
  7: {
    status: 'ai', guests: 4, startTime: '13:12', duration: 58,
    cam: { id: 3, label: 'CAM 3 · 테이블 7~9구역', tint: [0,8,15], people: [{x:68,y:44},{x:88,y:44},{x:78,y:44},{x:108,y:44}], bboxes: [{x:50,y:34,w:90,h:60,color:'#3b82f6',label:'카드 감지'}] },
    timeline: [
      { time: '13:12', label: '착석 · 주문', level: 1.0, color: '#22c55e' },
      { time: '13:35', label: '메인 섭취', level: 0.85, color: '#3b82f6' },
      { time: '13:55', label: '식사 마무리', level: 0.5, color: '#f59e0b' },
      { time: '14:10', label: '카드 꺼냄 감지', level: 0.3, color: '#3b82f6' },
    ],
    signals: { refill: 20, water: 40, drink: 15, payment: 78, leave: 65, call: 3 },
    aiRecommend: '카드 꺼냄 동작 감지. 계산 가능성 78%. POS 시스템 준비 및 영수증 출력 대기 권장. 퇴석 후 즉시 테이블 정리.',
    voiceHistory: [
      { level: '정보', text: '"7번 테이블, 체류 58분 경과. 카드를 꺼내는 동작이 감지됐습니다."', time: '방금 전', cam: 'CAM 3' },
      { level: '정보', text: '"7번 테이블, 식사 마무리 단계로 판단됩니다. POS 준비 권장."', time: '8분 전', cam: 'CAM 3' },
    ],
  },
  13: {
    status: 'ok', guests: 4, startTime: '14:10', duration: 22,
    cam: { id: 5, label: 'CAM 5 · 테이블 13~15구역', tint: [0,10,8], people: [{x:72,y:46},{x:92,y:46},{x:82,y:46},{x:102,y:46}], bboxes: [{x:54,y:36,w:90,h:58,color:'#3b82f6',label:'패턴 분석'}] },
    timeline: [
      { time: '14:10', label: '착석 · 주문', level: 1.0, color: '#22c55e' },
      { time: '14:22', label: '음식 도착 · 섭취 시작', level: 0.9, color: '#3b82f6' },
      { time: '14:32', label: '정상 섭취 중', level: 0.8, color: '#22c55e' },
    ],
    signals: { refill: 25, water: 50, drink: 35, payment: 8, leave: 5, call: 2 },
    aiRecommend: '현재 이상 없음. 착석 22분, 정상 섭취 패턴 감지. 물 상태 확인 방문 권장 (잔량 50%).',
    voiceHistory: [
      { level: '정보', text: '"13번 테이블, 4인 착석 22분 경과. 정상 패턴으로 특이사항 없습니다."', time: '2분 전', cam: 'CAM 5' },
    ],
  },
}

const SIGNALS = [
  { key: 'refill',  label: '반찬 소진',     emoji: '🥗', color: '#ef4444' },
  { key: 'water',   label: '물컵 잔량',     emoji: '💧', color: '#3b82f6' },
  { key: 'drink',   label: '음료 추가 주문', emoji: '🥤', color: '#22c55e' },
  { key: 'payment', label: '계산 예상',     emoji: '💳', color: '#f59e0b' },
  { key: 'leave',   label: '자리 이탈',     emoji: '🚶', color: '#a78bfa' },
  { key: 'call',    label: '직접 호출',     emoji: '🔔', color: '#94a3b8' },
]

const LEVEL_COLOR = { 긴급: '#ef4444', 주의: '#f59e0b', 정보: '#3b82f6' }
const LEVEL_BG    = { 긴급: '#fee2e2', 주의: '#fef3c7', 정보: '#dbeafe' }

// ── 미니 CCTV Canvas ─────────────────────────────────────────
function drawMiniCam(canvas, camData, frame) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const t = frame * 0.016
  const cam = camData

  ctx.fillStyle = `rgb(${6+cam.tint[0]},${10+cam.tint[1]},${8+cam.tint[2]})`
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(0,255,80,0.04)'
  ctx.lineWidth = 0.5
  for (let x = 0; x <= W; x += 16) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
  for (let y = 0; y <= H; y += 16) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }

  const bob = Math.sin(t * 0.8) * 1.2
  cam.people.forEach((p, i) => {
    const px = p.x*(W/200), py = (p.y+bob*(i%2?-0.5:1))*(H/120)
    ctx.fillStyle = 'rgba(180,220,200,0.6)'
    ctx.fillRect(px-6, py-7, 12, 17)
    ctx.beginPath(); ctx.arc(px, py-10, 5, 0, Math.PI*2); ctx.fill()
  })

  cam.bboxes.forEach(box => {
    const pulse = 0.55 + 0.45*Math.sin(t*2.5)
    ctx.globalAlpha = pulse
    ctx.strokeStyle = box.color
    ctx.lineWidth = 1.5
    const bx=box.x*(W/200), by=box.y*(H/120), bw=box.w*(W/200), bh=box.h*(H/120)
    ctx.strokeRect(bx, by, bw, bh)
    ctx.globalAlpha = 1
  })

  const sweepY = ((t*25+cam.id*20) % (H+16)) - 8
  const g = ctx.createLinearGradient(0, sweepY-10, 0, sweepY+10)
  g.addColorStop(0,'rgba(0,255,80,0)'); g.addColorStop(0.5,'rgba(0,255,80,0.15)'); g.addColorStop(1,'rgba(0,255,80,0)')
  ctx.fillStyle = g; ctx.fillRect(0, sweepY-10, W, 20)

  for (let y = 0; y < H; y += 3) { ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(0,y,W,1) }

  const now = new Date()
  const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
  ctx.font = `bold 8px monospace`
  ctx.fillStyle = 'rgba(0,255,80,0.55)'
  ctx.fillText(`CH${cam.id}  ${ts}`, 4, H-4)
}

function MiniCamCanvas({ camData }) {
  const ref = useRef(null)
  const frameRef = useRef(0)
  useEffect(() => {
    let running = true
    function loop() {
      if (!running) return
      frameRef.current++
      drawMiniCam(ref.current, camData, frameRef.current)
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
    return () => { running = false }
  }, [camData])
  return (
    <canvas ref={ref} width={280} height={160}
      style={{ width:'100%', borderRadius:6, border:'1px solid #1a3a1e', display:'block', background:'#060c06' }} />
  )
}

// ── Waveform 시각화 ──────────────────────────────────────────
function Waveform({ color }) {
  const bars = Array.from({ length: 20 }, (_, i) => 20 + Math.sin(i * 1.3) * 14 + Math.random() * 8)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24, marginTop: 6 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ width: 3, height: h * 0.5, background: color, opacity: 0.5 + i * 0.025, borderRadius: 2 }} />
      ))}
    </div>
  )
}

// ── 메인 컴포넌트 ────────────────────────────────────────────
export default function BehaviorAnalysis() {
  const [selectedTable, setSelectedTable] = useState(5)
  const data = TABLE_BEHAVIOR[selectedTable]
  const { isMobile } = useWindowSize()

  const alertTables = [1, 5, 7]
  const emptyTables = [2, 4, 6, 8, 9, 10, 11, 14, 15]

  return (
    <>
      <Header title="행동 분석" subtitle="테이블별 AI 행동 패턴 실시간 분석" />
      <div className="page-content">

        {/* 테이블 선택 탭 */}
        <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#64748b', marginBottom: 12 }}>테이블 선택</div>
          <div style={{
            display: 'flex',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            gap: isMobile ? 6 : 8,
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? 8 : 0,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {Array.from({ length: 15 }, (_, i) => i + 1).map(num => {
              const isAlert = alertTables.includes(num)
              const isEmpty = emptyTables.includes(num)
              const isSelected = selectedTable === num
              const hasBehavior = !!TABLE_BEHAVIOR[num]
              return (
                <button
                  key={num}
                  onClick={() => hasBehavior && setSelectedTable(num)}
                  style={{
                    width: 46, height: 46, borderRadius: 8, fontWeight: 700, fontSize: 13,
                    cursor: hasBehavior ? 'pointer' : 'default',
                    border: isSelected ? '2px solid #6366f1' : isAlert ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    background: isSelected ? '#6366f1' : isAlert ? '#fee2e2' : isEmpty ? '#f8fafc' : '#f1f5f9',
                    color: isSelected ? '#fff' : isAlert ? '#dc2626' : isEmpty ? '#cbd5e1' : '#334155',
                    position: 'relative',
                    boxShadow: isSelected ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {num}
                  {isAlert && !isSelected && (
                    <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}>⚠</span>
                  )}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: '#94a3b8' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#fee2e2', border: '1px solid #ef4444', marginRight: 4 }} />긴급/주의 알림</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f1f5f9', border: '1px solid #e2e8f0', marginRight: 4 }} />분석 데이터 있음</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f8fafc', border: '1px solid #e2e8f0', marginRight: 4 }} />빈 테이블</span>
          </div>
        </div>

        {!data ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
            해당 테이블의 분석 데이터가 없습니다.
          </div>
        ) : (
          <>
            {/* 2컬럼 패널 — 모바일 1열 */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>

              {/* 좌측: CCTV 미리보기 + 타임라인 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>CCTV 미리보기</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{data.cam.label}</span>
                  </div>
                  <MiniCamCanvas camData={data.cam} />
                  <div style={{ marginTop: 10, display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                    <span>착석: <strong>{data.startTime}</strong></span>
                    <span>체류: <strong style={{ color: data.duration > 45 ? '#ef4444' : '#f59e0b' }}>{data.duration}분</strong></span>
                    <span>인원: <strong>{data.guests}명</strong></span>
                  </div>
                </div>

                <div className="card" style={{ padding: 0 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 14 }}>행동 타임라인</div>
                  <div style={{ padding: '12px 16px' }}>
                    {data.timeline.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 38, fontFamily: 'monospace' }}>{item.time}</span>
                        <div style={{ flex: 1, height: 20, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${item.level * 100}%`, height: '100%', background: item.color, borderRadius: 4, transition: 'width 0.5s' }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#334155', minWidth: 120 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측: AI 행동 신호 */}
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
                  AI 행동 신호 감지
                  <span style={{ marginLeft: 8, fontSize: 11, color: '#94a3b8' }}>{selectedTable}번 테이블</span>
                </div>
                {SIGNALS.map(sig => (
                  <div key={sig.key} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: '#334155' }}>{sig.emoji} {sig.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: sig.color, fontFamily: 'monospace' }}>
                        {data.signals[sig.key]}%
                      </span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                      <div style={{
                        width: `${data.signals[sig.key]}%`, height: '100%',
                        background: sig.color, borderRadius: 6,
                        transition: 'width 0.6s ease',
                        boxShadow: data.signals[sig.key] > 70 ? `0 0 8px ${sig.color}88` : 'none',
                      }} />
                    </div>
                  </div>
                ))}

                {/* AI 추천 액션 */}
                <div style={{
                  marginTop: 16, background: '#fefce8', border: '1px solid #fde047',
                  borderRadius: 8, padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#854d0e', marginBottom: 6 }}>💡 AI 추천 액션</div>
                  <div style={{ fontSize: 13, color: '#713f12', lineHeight: 1.6 }}>{data.aiRecommend}</div>
                </div>
              </div>
            </div>

            {/* 하단: 보이스 알림 이력 */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 14 }}>
                보이스 알림 전송 이력
              </div>
              {data.voiceHistory.map((vh, i) => (
                <div key={i} style={{
                  padding: '14px 20px', borderBottom: i < data.voiceHistory.length - 1 ? '1px solid #f1f5f9' : 'none',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      background: LEVEL_BG[vh.level], color: LEVEL_COLOR[vh.level],
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                    }}>{vh.level}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{vh.cam}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>{vh.time}</span>
                    <button style={{
                      background: '#f1f5f9', border: 'none', borderRadius: 6,
                      padding: '3px 10px', cursor: 'pointer', fontSize: 12, color: '#6366f1',
                    }}>▶ 재생</button>
                  </div>
                  <div style={{ fontSize: 13, color: '#334155', fontStyle: 'italic' }}>{vh.text}</div>
                  <Waveform color={LEVEL_COLOR[vh.level]} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
