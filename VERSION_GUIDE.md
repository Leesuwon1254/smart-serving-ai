# Smart Serving AI — 버전 관리 가이드

## 버전 규칙 (Semantic Versioning)

| 변경 유형 | 버전 변경 | 예시 | 설명 |
|-----------|-----------|------|------|
| 메이저 | X.0.0 | 1.0.0 → 2.0.0 | UI 전면 개편, 핵심 구조 변경, 플랫폼 전환 |
| 마이너 | 1.X.0 | 1.0.0 → 1.1.0 | 새 기능 추가, 주요 개선, 새 페이지 추가 |
| 패치 | 1.0.X | 1.0.0 → 1.0.1 | 버그 수정, 텍스트 수정, 스타일 소수 변경 |

## 업데이트 절차

### 1. src/version.js 수정

```javascript
export const VERSION = '1.0.1'; // 버전 숫자 변경

export const CHANGELOG = [
  {
    version: '1.0.1',
    date: '2026-05-20',
    type: 'patch', // 'major' | 'minor' | 'patch'
    title: '버그 수정 및 UI 개선',
    changes: [
      '🔧 알림 필터 버그 수정',
      '💄 테이블 카드 디자인 개선',
    ],
  },
  // 기존 로그는 아래에 유지
  {
    version: '1.0.0',
    date: '2026-05-15',
    type: 'major',
    title: 'Smart Serving AI 정식 출시',
    changes: [
      '🎉 React + Vite 기반 SaaS 대시보드 초기 구축',
    ],
  },
];
```

### 2. package.json 버전도 동일하게 수정

```json
{
  "version": "1.0.1"
}
```

### 3. Git commit & push

```bash
git add .
git commit -m "chore: v1.0.1 — 버그 수정 및 UI 개선"
git push
```

→ Render가 자동 재배포
→ 사용자가 다음 접속 시 팝업으로 변경사항 확인

---

## 팝업 동작 방식

| 상황 | 팝업 표시 여부 |
|------|--------------|
| 최초 방문자 | 표시 (localStorage 값 없음) |
| 버전 변경 후 재접속 | 표시 (저장된 버전 != 현재 버전) |
| 팝업 확인 후 재접속 | 미표시 (버전 동일) |
| 버전 변경 없이 재접속 | 미표시 |

localStorage 키: `ssa_last_seen_version`

---

## 변경사항 이모지 가이드

| 이모지 | 용도 |
|--------|------|
| 🎉 | 새로운 출시/기능 |
| ⚡ | 성능 개선 |
| 🔧 | 버그 수정 |
| 💄 | UI/디자인 개선 |
| 📊 | 데이터/차트 관련 |
| 🔒 | 보안 관련 |
| 🚀 | 배포/인프라 |
| 📱 | 모바일 대응 |
| ♿ | 접근성 |
| 🌐 | API 연동 |
