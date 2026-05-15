// src/version.js
export const VERSION = '1.2.0';

export const CHANGELOG = [
  {
    version: '1.2.0',
    date: '2026-05-16',
    type: 'minor',
    title: 'CCTV 장면 고도화 — 실물 객체 인식 시뮬레이션',
    changes: [
      '🍽️ 테이블 위 식기류 전체 표현 (냄비, 불판, 밥그릇, 반찬, 숟가락, 젓가락)',
      '🍶 음료/주류 표현 (물컵, 술잔, 소주병, 맥주병, 빈 병 구분)',
      '🪑 의자 걸친 옷(재킷) AI 감지',
      '👜 빈의자 가방·핸드폰 방치 감지 (퇴청 예측)',
      '🔍 바닥 분실물 감지 (지갑·열쇠·핸드폰) + 경고 링 애니메이션',
      '🔵 원형 테이블 + 직사각 2인/4인/6인 테이블 혼합 배치',
      '👤 사람 실루엣 착석 위치 정확 배치 (얼굴 비식별 유지)',
      '🔥 고기불판 글로우 애니메이션, 찌개 냄비 김 효과',
    ],
  },
  {
    version: '1.1.2',
    date: '2026-05-15',
    type: 'patch',
    title: '행동 분석 보이스 알림 필터링 버그 수정',
    changes: ['🔧 선택된 테이블의 보이스 알림 이력만 표시되도록 수정'],
  },
  {
    version: '1.1.1',
    date: '2026-05-15',
    type: 'patch',
    title: '모바일 반응형 전면 수정',
    changes: ['📱 CCTV 모니터 모바일 대응', '📱 하단 탭바 추가'],
  },
  {
    version: '1.1.0',
    date: '2026-05-15',
    type: 'minor',
    title: 'CCTV 실시간 모니터 & 행동 패턴 분석 추가',
    changes: ['📹 CCTV 멀티뷰 모니터 페이지 신규 추가'],
  },
  {
    version: '1.0.0',
    date: '2026-05-15',
    type: 'major',
    title: 'Smart Serving AI 정식 출시',
    changes: ['🎉 React + Vite 기반 SaaS 대시보드 초기 구축'],
  },
];

// 버전 타입 규칙
// x.0.0 → Major: 메인 기능 변경 (UI 전면 개편, 핵심 구조 변경)
// 1.x.0 → Minor: 새 기능 추가 또는 업그레이드
// 1.0.x → Patch: 버그 수정, 소소한 개선
