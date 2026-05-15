// src/version.js
export const VERSION = '1.1.0';

export const CHANGELOG = [
  {
    version: '1.1.0',
    date: '2026-05-15',
    type: 'minor',
    title: 'CCTV 실시간 모니터 & 행동 패턴 분석 추가',
    changes: [
      '📹 CCTV 멀티뷰 모니터 페이지 신규 추가 (6채널 실시간 애니메이션)',
      '🤖 테이블별 AI 행동 패턴 상세 분석 페이지 추가',
      '🔊 보이스 알림 스크립트 관리 페이지 추가',
      '⚡ AI 감지 박스 펄스 애니메이션 (빨강/노랑/파랑 우선순위)',
      '📊 실시간 스캔라인 및 노이즈 효과로 실제 CCTV 느낌 구현',
      '🎯 테이블별 행동 신호 6종 확률 게이지 추가',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-15',
    type: 'major',
    title: 'Smart Serving AI 정식 출시',
    changes: [
      '🎉 React + Vite 기반 SaaS 대시보드 초기 구축',
      '📊 실시간 알림 피드 (HIGH / MID / LOW 우선순위)',
      '🗂️ 테이블 현황 모니터링 (20개 테이블)',
      '📈 분석 리포트 (시간대별 차트, 예측 정확도)',
      '⚙️ 설정 페이지 (알림 임계값, 매장명 등)',
      '🚀 GitHub + Render 배포 자동화 완료',
    ],
  },
];

// 버전 타입 규칙
// x.0.0 → Major: 메인 기능 변경 (UI 전면 개편, 핵심 구조 변경)
// 1.x.0 → Minor: 새 기능 추가 또는 업그레이드
// 1.0.x → Patch: 버그 수정, 소소한 개선
