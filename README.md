# Smart Serving AI

AI 기반 레스토랑 운영 관리 SaaS 대시보드입니다.
실시간 테이블 현황, AI 예측 알림, 매출 분석 리포트를 한 화면에서 관리할 수 있습니다.

---

## 주요 기능

| 페이지 | 설명 |
|--------|------|
| 대시보드 | KPI 카드, 시간대별 고객 현황, AI 예측 정확도, 알림 요약 |
| 테이블 현황 | 플로어 맵 시각화, 테이블별 AI 퇴석 예측, 상세 정보 |
| 실시간 알림 | 긴급/경고/정보/완료 알림 피드, 필터링, 읽음 처리 |
| 분석 리포트 | 주간 매출 비교, 고객 흐름, 메뉴별 판매 차트 |
| 설정 | AI 알림 임계값, 피크타임 예측 ON/OFF, 시스템 정보 |

---

## 기술 스택

- **프레임워크**: React 18 + Vite 5
- **라우팅**: React Router v6
- **차트**: Recharts
- **아이콘**: Lucide React
- **배포**: Render (Static Site)

---

## 설치 방법

Node.js 18 이상이 필요합니다.

```bash
# 1. 저장소 클론
git clone https://github.com/[YOUR_GITHUB_USERNAME]/smart-serving-ai.git
cd smart-serving-ai

# 2. 패키지 설치
npm install
```

---

## 실행 방법

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 빌드 결과 미리보기

```bash
npm run preview
```

---

## 환경변수

프로젝트 루트에 `.env` 파일을 생성하여 설정합니다.

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `VITE_APP_NAME` | 앱 표시 이름 | `Smart Serving AI` |
| `VITE_API_BASE_URL` | 백엔드 API 주소 (추후 연결) | 없음 |
| `VITE_AI_MODEL_VERSION` | AI 모델 버전 표시 | `v2.1.0` |

예시 (`.env`):

```env
VITE_APP_NAME=Smart Serving AI
VITE_API_BASE_URL=https://api.your-backend.com
VITE_AI_MODEL_VERSION=v2.1.0
```

> `.env` 파일은 `.gitignore`에 추가하여 Git에 커밋하지 마세요.

---

## 폴더 구조

```
smart-serving-ai/
├── public/
│   └── favicon.svg          # 파비콘
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx      # 사이드바 네비게이션
│   │   └── Header.jsx       # 페이지 상단 헤더 (실시간 시계 포함)
│   ├── data/
│   │   └── mockData.js      # Mock 데이터 (테이블, 알림, 차트 등)
│   ├── pages/
│   │   ├── Dashboard.jsx    # 메인 대시보드
│   │   ├── Tables.jsx       # 테이블 현황 (플로어 맵 + 목록)
│   │   ├── Alerts.jsx       # 실시간 알림 피드
│   │   ├── Analytics.jsx    # 분석 리포트 (차트)
│   │   └── Settings.jsx     # 설정 페이지
│   ├── App.jsx              # 루트 컴포넌트 + 라우팅
│   ├── main.jsx             # React 앱 진입점
│   └── index.css            # 전역 스타일
├── index.html               # HTML 진입점
├── vite.config.js           # Vite 설정
├── package.json             # 패키지 및 스크립트
├── render.yaml              # Render 배포 설정
└── README.md
```

---

## Render 배포

이 프로젝트는 Render Static Site로 배포됩니다.

1. [https://render.com](https://render.com) 접속 후 GitHub 계정으로 로그인
2. **New +** → **Static Site** 선택
3. `smart-serving-ai` 저장소 연결
4. 설정:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. **Create Static Site** 클릭 → 약 2~3분 후 배포 완료

---

## 다음 단계 (백엔드 연결)

현재는 Mock 데이터 기반으로 동작합니다. 백엔드 API 연결 시:

- `src/data/mockData.js` → API 호출로 교체
- `VITE_API_BASE_URL` 환경변수 설정
- 실시간 데이터는 WebSocket 또는 SSE(Server-Sent Events) 연결 권장

---

## 라이선스

MIT
