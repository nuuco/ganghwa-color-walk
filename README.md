# 강화 컬러워크

강화도에서 **하루의 색** 하나를 정하고, 그 색을 찾아 걸으며 **3×3 사진 그리드**와 **엽서**로 남기는 느린 산책용 **모바일 웹 PWA**입니다.

촬영·메모·시트 목록은 브라우저 **IndexedDB**에만 저장됩니다. 사진은 서버로 전송되지 않습니다.

**배포 예시:** [https://ganghwa-color-walk.vercel.app](https://ganghwa-color-walk.vercel.app)

## 주요 기능

### 아카이브 (S01)

| 기능 | 설명 |
|------|------|
| 통합 목록 | 진행 중·완성 시트를 한 목록에 표시 (`나의 강화도 색 수집`) |
| 카드 보기 | **간략**(기본) / **벤토**(미니 3×3) 토글 — `localStorage` 유지 |
| 시트 카드 | 제목·테마명·진행률 바·날짜, 미니 그리드 미리보기 |
| ⋮ 메뉴 | **수정**(제목·색) · **삭제**(확인 후 일괄 삭제) |
| 새 시트 | 우하단 FAB `+` |
| 빈 목록 | 「첫 컬러워크를 시작해 보세요」 안내만 표시 |
| PWA 설치 안내 | 진입 시 상단 배너 (iOS·Android·카카오 인앱·standalone 분기) |

### 테마 선택 (S02)

| 기능 | 설명 |
|------|------|
| 시트 제목 | 1~20자 필수 |
| 강화 색상 | ① **직접 선택**(컬러 피커 + 컬러명) ② **랜덤 선택** ③ **프리셋 8종**(접힌 영역) |
| 프리셋 예시 | 순무 보라, 고구마 노랑, 진달래 분홍, 약쑥 초록, 소창 하양, 인삼 열매 빨강, 갯벌 회색, 고인돌 바위색 |
| 시트 수정 | 아카이브 ⋮ → 수정 시 기존 값으로 진입, CTA 「수정하기」 |

### 컬러워크 (S03)

| 기능 | 설명 |
|------|------|
| 3×3 그리드 | 빈 칸 탭 → 카메라 / 갤러리(다중 선택 시 빈 칸 순차 채움) |
| 셀 상세 | 채워진 칸 탭 → 크게 보기 · 다시 찍기 · 삭제 |
| 가운데 색 | 토글 ON 시 중앙 칸은 테마색 + **HEX** 오버레이(사진 유지), OFF 시 일반 사진 칸 — 완성 카운트 **8+1** |
| 드래그 정렬 | 채워진 칸 핸들로 드래그·스왑(중앙 컬러 슬롯 ON일 때 중앙 제외) |
| 헤더 편집 | 시트 제목·테마(스와치+컬러명) 인라인 / 모달 수정 |
| 산책 노트 | 최대 200자, debounce 자동 저장 — 엽서에 표시 |
| 진행 | 테마색 progress bar + %, **9/9여도 자동 완성 없음** → 「완성하기」로 완성 화면 이동 |
| 완성 후 편집 | 「완성 화면 보기」·뒤로 시 완성 화면 복귀 |

### 완성·공유 (S04)

| 기능 | 설명 |
|------|------|
| 축하 | 완성·재완성·「완성 화면 보기」 시 컨페티 + 「오늘의 컬러워크를 완성했어요!」 배너 |
| 엽서 | 시트 제목·테마 태그·3×3 모자이크(중앙 컬러 슬롯 반영)·산책 노트·완성 날짜 |
| 수정 | AppBar 우측 「수정」→ walk 편집 |
| 공유 | **사진첩에 저장** · **카카오톡 링크 피드** · **이미지 공유**(Web Share, 미지원 시 저장) |

### PWA · 오프라인

- `vite-plugin-pwa`: manifest · Service Worker · `standalone` 세로 화면
- 오프라인 배너, standalone 앱에서 뒤로가기 시 **종료 확인** 다이얼로그
- 오프라인 시 카카오 공유만 비활성 — 저장·이미지 공유는 기기·브라우저에 따라 로컬 동작 가능

## 사용자 흐름

```
아카이브 ──FAB──► 테마(제목·색) ──► walk(9칸·메모) ──「완성하기」──► view(엽서·공유)
   ▲                    │                    │
   │                    └── ⋮ 수정 ──────────┤
   └──── 카드 탭(진행/완성) ◄── 수정·삭제 ────┘
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| UI | **React 19** · **TypeScript** · **Vite 6** · **Tailwind CSS 3** |
| 저장 | **localforage** (IndexedDB, 셀별 이미지 Blob) |
| 그리드 | **@dnd-kit/core** (칸 드래그·스왑) |
| 엽서 export | **html2canvas** (엽서 JPEG 캡처) |
| 완성 연출 | **canvas-confetti** |
| PWA | **vite-plugin-pwa** (manifest · Workbox) |
| 폰트 | Pretendard + Noto Sans KR |

## 시작하기

**요구 사항:** Node.js 18 이상 권장

```bash
npm install
npm run dev
```

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (기본 `http://localhost:5173`) |
| `npm run build` | TypeScript 검사 후 `dist/` 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |

## 환경 변수

`.env.example`을 복사해 `.env`를 만듭니다. `.env`는 Git에 포함되지 않습니다.

| 변수 | 설명 |
|------|------|
| `VITE_KAKAO_JS_KEY` | 카카오 JavaScript 키 ([Kakao Developers](https://developers.kakao.com/) → 앱 → 앱 키) |
| `VITE_APP_URL` | 배포된 앱 URL (카카오 링크·피드·`?sheet=` 공유 링크 기준) |

- 키가 없으면 **카카오톡으로 공유**만 비활성화됩니다.
- 오프라인에서는 카카오 공유만 비활성입니다.

## PWA · 홈 화면 추가

`npm run build` 후 **HTTPS**(또는 `localhost`)에서 Service Worker가 등록됩니다.

| 플랫폼 | 방법 |
|--------|------|
| iOS Safari | 공유 → 「홈 화면에 추가」 |
| Android Chrome | 메뉴 → 「앱 설치」 또는 「홈 화면에 추가」 |

- 앱 이름: **강화 컬러워크**
- 테마·배경색: `#131313`
- 표시: `standalone`, 세로(`portrait`)

## 카메라 · HTTPS

`getUserMedia` 및 일부 공유 API는 **보안 컨텍스트(HTTPS)** 또는 `localhost`에서만 동작합니다.

- 로컬 LAN: `npm run dev -- --host` 후 HTTPS 터널(ngrok 등) 권장
- 배포: Vercel·Netlify 등 정적 호스팅의 기본 HTTPS 사용

## 배포

정적 SPA로 배포합니다.

1. `npm run build` → `dist/` 생성
2. **Vercel**: Build `npm run build`, Output Directory `dist`, SPA fallback `index.html`
3. **Netlify**: Publish `dist`, redirects `/* /index.html 200`

호스팅 대시보드에 환경 변수를 **`VITE_` 접두사 그대로** 등록합니다. `VITE_APP_URL`을 실제 배포 URL과 맞추면 카카오 공유 링크가 올바르게 동작합니다.

## 문서

| 문서 | 내용 |
|------|------|
| [`docs/plan.md`](docs/plan.md) | 개발 계획·UX 의사결정·데이터 모델 |
| [`docs/FIGMA_UI_DESIGN.md`](docs/FIGMA_UI_DESIGN.md) | UI·컴포넌트·디자인 토큰 |
| [`docs/PAGE_IMPLEMENTATION.md`](docs/PAGE_IMPLEMENTATION.md) | 화면별 구현 체크리스트 |
| [`docs/reference/screenshots/`](docs/reference/screenshots/) | Stitch 기준 S01~S04 캡처 |

## 개발 Phase 요약

| Phase | 내용 |
|-------|------|
| 1 | React·Vite·Tailwind·화면 스텁 (S01~S04) |
| 2 | IndexedDB·9칸 촬영·갤러리·메모·완성 |
| 3 | 엽서 캡처·저장·이미지/카카오 공유 |
| 4 | PWA·오프라인·설치 배너 |
| 이후 | 중앙 컬러 슬롯·DnD·아카이브 보기 토글·완성 수동·축하 연출·테마/제목 편집 등 (상세: [`AGENTS.md`](AGENTS.md)) |
