// src/version.js
export const VERSION = '1.1.2';

export const CHANGELOG = [
  {
    version: '1.1.2',
    date: '2026-05-15',
    type: 'patch',
    title: '행동 분석 보이스 알림 필터링 버그 수정',
    changes: [
      '🔧 선택된 테이블의 보이스 알림 이력만 표시되도록 수정',
      '🔧 테이블 전환 시 이력 목록 즉시 갱신',
      '🔧 해당 테이블 이력 없을 때 안내 메시지 표시',
    ],
  },
  {
    version: '1.1.1',
    date: '2026-05-15',
    type: 'patch',
    title: '모바일 반응형 전면 수정',
    changes: [
      '📱 CCTV 모니터 모바일 대응 (1열 세로 스택)',
      '📱 행동 분석 모바일 대응 (단일 컬럼 레이아웃)',
      '📱 사이드바 → 하단 탭바로 전환 (모바일)',
      '📱 Canvas 크기 모바일 화면에 맞게 자동 조정',
      '📱 테이블 선택 탭 가로 스크롤 처리',
      '📱 폰트 및 여백 모바일 최적화',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-15',
    type: 'minor',
    title: 'CCTV 실시간 모니터 & 행동 패턴 분석 추가',
    changes: [
      '📹 CCTV 멀티뷰 모니터 페이지 신규 추가',
      '🤖 테이블별 AI 행동 패턴 상세 분석 페이지 추가',
      '🔊 보이스 알림 스크립트 관리 페이지 추가',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-15',
    type: 'major',
    title: 'Smart Serving AI 정식 출시',
    changes: [
      '🎉 React + Vite 기반 SaaS 대시보드 초기 구축',
      '🚀 GitHub + Render 배포 자동화 완료',
    ],
  },
];

// 버전 타입 규칙
// x.0.0 → Major: 메인 기능 변경 (UI 전면 개편, 핵심 구조 변경)
// 1.x.0 → Minor: 새 기능 추가 또는 업그레이드
// 1.0.x → Patch: 버그 수정, 소소한 개선
