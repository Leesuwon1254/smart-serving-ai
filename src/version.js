// src/version.js
export const VERSION = '1.0.0';

export const CHANGELOG = [
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
