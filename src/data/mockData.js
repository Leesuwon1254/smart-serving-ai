// 테이블 현황 Mock 데이터
export const tablesData = [
  { id: 1,  status: 'occupied',  guests: 4, time: '47분', order: 68000,  aiPredict: '20분 후 퇴석' },
  { id: 2,  status: 'available', guests: 0, time: '-',    order: 0,      aiPredict: '입석 가능' },
  { id: 3,  status: 'occupied',  guests: 2, time: '12분', order: 24000,  aiPredict: '30분 이상 체류' },
  { id: 4,  status: 'reserved',  guests: 6, time: '18:30',order: 0,      aiPredict: '예약 30분 전' },
  { id: 5,  status: 'occupied',  guests: 3, time: '31분', order: 45000,  aiPredict: '추가 주문 예상' },
  { id: 6,  status: 'cleaning',  guests: 0, time: '정리중',order: 0,     aiPredict: '5분 후 가용' },
  { id: 7,  status: 'occupied',  guests: 5, time: '58분', order: 92000,  aiPredict: '곧 퇴석 예상' },
  { id: 8,  status: 'available', guests: 0, time: '-',    order: 0,      aiPredict: '입석 가능' },
  { id: 9,  status: 'occupied',  guests: 2, time: '8분',  order: 16000,  aiPredict: '메인 주문 대기' },
  { id: 10, status: 'reserved',  guests: 4, time: '19:00',order: 0,      aiPredict: '예약 1시간 전' },
  { id: 11, status: 'available', guests: 0, time: '-',    order: 0,      aiPredict: '입석 가능' },
  { id: 12, status: 'occupied',  guests: 1, time: '22분', order: 12000,  aiPredict: '15분 후 퇴석' },
  { id: 13, status: 'occupied',  guests: 4, time: '41분', order: 78000,  aiPredict: '디저트 주문 예상' },
  { id: 14, status: 'available', guests: 0, time: '-',    order: 0,      aiPredict: '입석 가능' },
  { id: 15, status: 'cleaning',  guests: 0, time: '정리중',order: 0,     aiPredict: '3분 후 가용' },
]

// 실시간 알림 Mock 데이터
export const alertsData = [
  { id: 1,  type: 'critical', icon: '🔴', title: '7번 테이블 대기 시간 초과', desc: '58분 체류 중 — 결제 유도 또는 직원 확인 필요', time: '방금 전', unread: true },
  { id: 2,  type: 'warning',  icon: '⚠️', title: 'AI 예측: 1번 테이블 20분 후 퇴석', desc: '현재 4명 체류, 대기 고객 3팀 — 사전 테이블 정리 준비 권장', time: '2분 전', unread: true },
  { id: 3,  type: 'info',     icon: '🔵', title: '4번 테이블 예약 30분 전 알림', desc: '6인 예약 (18:30) — 테이블 세팅 시작 권장', time: '5분 전', unread: true },
  { id: 4,  type: 'success',  icon: '✅', title: '피크타임 예측 정확도 94.2%', desc: '오늘 18:00~20:00 피크타임 AI 예측이 실제와 94.2% 일치', time: '12분 전', unread: false },
  { id: 5,  type: 'warning',  icon: '⚠️', title: '주방 대기 주문 5건 초과', desc: '현재 처리 대기 주문 7건 — 조리 속도 조절 필요', time: '15분 전', unread: false },
  { id: 6,  type: 'info',     icon: '💡', title: 'AI 추천: 5번 테이블 추가 주문 제안', desc: '식사 패턴 분석 — 음료 또는 사이드 메뉴 추가 가능성 73%', time: '18분 전', unread: false },
  { id: 7,  type: 'success',  icon: '✅', title: '6번 테이블 정리 완료', desc: '청소 완료, 5분 내 신규 고객 입석 가능 상태', time: '22분 전', unread: false },
  { id: 8,  type: 'info',     icon: '📊', title: '오늘 매출 목표 78% 달성', desc: '현재 매출 1,248,000원 / 목표 1,600,000원', time: '30분 전', unread: false },
  { id: 9,  type: 'warning',  icon: '⚠️', title: '9번 테이블 주문 지연', desc: '착석 8분 경과, 아직 주문 미완료 — 직원 방문 권장', time: '35분 전', unread: false },
  { id: 10, type: 'info',     icon: '🤖', title: 'AI 모델 재학습 완료', desc: '최근 7일 데이터 반영 — 예측 정확도 +1.3% 향상', time: '1시간 전', unread: false },
]

// 분석 리포트 — 시간대별 고객 수
export const hourlyCustomers = [
  { time: '11시', customers: 12, predicted: 10 },
  { time: '12시', customers: 48, predicted: 45 },
  { time: '13시', customers: 62, predicted: 58 },
  { time: '14시', customers: 35, predicted: 38 },
  { time: '15시', customers: 18, predicted: 20 },
  { time: '16시', customers: 22, predicted: 25 },
  { time: '17시', customers: 41, predicted: 40 },
  { time: '18시', customers: 68, predicted: 65 },
  { time: '19시', customers: 74, predicted: 72 },
  { time: '20시', customers: 58, predicted: 60 },
  { time: '21시', customers: 32, predicted: 35 },
]

// 분석 리포트 — 주간 매출
export const weeklySales = [
  { day: '월', sales: 1240000, lastWeek: 1100000 },
  { day: '화', sales: 980000,  lastWeek: 920000 },
  { day: '수', sales: 1380000, lastWeek: 1250000 },
  { day: '목', sales: 1560000, lastWeek: 1400000 },
  { day: '금', sales: 1920000, lastWeek: 1750000 },
  { day: '토', sales: 2340000, lastWeek: 2100000 },
  { day: '일', sales: 2180000, lastWeek: 1980000 },
]

// 분석 리포트 — 메뉴별 판매량
export const menuSales = [
  { name: '시그니처 스테이크', count: 142, revenue: 4970000 },
  { name: '파스타 3종',       count: 218, revenue: 3924000 },
  { name: '리조또',           count: 96,  revenue: 1632000 },
  { name: '샐러드',           count: 174, revenue: 1566000 },
  { name: '와인',             count: 88,  revenue: 3520000 },
  { name: '디저트 세트',      count: 132, revenue: 1188000 },
]

// 대시보드 KPI
export const kpiData = {
  todayCustomers:  { value: 284, trend: '+12%', up: true },
  tableOccupancy:  { value: '73%', trend: '+5%', up: true },
  avgSeatTime:     { value: '38분', trend: '-3분', up: true },
  todayRevenue:    { value: '1,248,000', trend: '+18%', up: true },
}

// AI 예측 정확도 (주간)
export const aiAccuracy = [
  { day: '월', accuracy: 91.2 },
  { day: '화', accuracy: 92.8 },
  { day: '수', accuracy: 90.5 },
  { day: '목', accuracy: 93.1 },
  { day: '금', accuracy: 94.0 },
  { day: '토', accuracy: 93.7 },
  { day: '일', accuracy: 94.2 },
]
