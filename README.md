# 강화 컬러워크

하루의 색을 정하고, 그 색을 찾아 **9칸 사진 그리드**와 **엽서**로 기록하는 모바일 웹 PWA입니다. 촬영·메모·시트 목록은 브라우저 **IndexedDB**에만 저장되며, 완성 후 엽서 이미지 저장·공유를 지원합니다.

## 주요 기능

| 구분 | 내용 |
|------|------|
| 아카이브 | 완료·진행 중 시트 목록, FAB로 새 시트 생성 |
| 테마 선택 | 직접 색·이름, 랜덤, 프리셋 / 시트 제목·테마 색 필수 |
| 컬러워크 | 3×3 그리드 촬영·갤러리 선택, 셀 상세·재촬영·삭제, 메모 |
| 완성·공유 | 엽서 헤드·날짜 편집, 사진첩 저장 / 카카오 링크 피드 / 이미지 공유(Web Share) |

데이터는 서버로 전송되지 않습니다. 카카오 공유는 `VITE_KAKAO_JS_KEY`·`VITE_APP_URL` 설정과 온라인 연결이 필요합니다.

## 기술 스택

- **React 19** · **TypeScript** · **Vite 6**
- **Tailwind CSS 3**
- **localforage** (IndexedDB) · **html2canvas** (엽서 캡처)
- **vite-plugin-pwa** (manifest · Service Worker)

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

- 키가 없으면 **카카오톡으로 공유** 버튼만 비활성화됩니다.
- 오프라인에서는 카카오 공유만 비활성이며, **사진첩에 저장**·**이미지 공유**(기기·브라우저 지원 시)는 로컬에서 동작할 수 있습니다.

## PWA · 홈 화면 추가

`npm run build` 후 **HTTPS**(또는 `localhost`)에서 Service Worker가 등록됩니다.

- **iOS Safari**: 공유 → 「홈 화면에 추가」
- **Android Chrome**: 메뉴 → 「앱 설치」 또는 「홈 화면에 추가」

`manifest` 앱 이름: **강화 컬러워크**, 테마·배경색 `#131313`, 세로(portrait) `standalone`.

## 카메라 · HTTPS

`getUserMedia` 및 일부 공유 API는 **보안 컨텍스트(HTTPS)** 또는 `localhost`에서만 동작합니다.

- 로컬 LAN 테스트: `npm run dev -- --host` 후 기기에서 HTTPS 프록시 또는 터널(ngrok 등) 사용 권장
- 배포 시 Vercel·Netlify 등 정적 호스팅은 기본 HTTPS 제공

## 배포

정적 SPA로 배포합니다.

1. `npm run build` → `dist/` 생성
2. **Vercel**: Build `npm run build`, Output Directory `dist`, SPA fallback `index.html`
3. **Netlify**: Publish `dist`, redirects `/* /index.html 200` (또는 `public/_redirects`)

호스팅 대시보드에 환경 변수를 **`VITE_` 접두사 그대로** 등록합니다. 배포 URL을 `VITE_APP_URL`에 맞추면 카카오 공유 링크가 올바르게 동작합니다.

## 개발 Phase 요약

| Phase | 내용 |
|-------|------|
| 1 | React·Vite·Tailwind·화면 스텁 (S01~S04) |
| 2 | IndexedDB·9칸 촬영·갤러리·메모 |
| 3 | 엽서 캡처·저장·이미지/카카오 공유 |
| 4 | PWA(manifest·SW)·오프라인 배너·카카오 오프라인 처리 |

UI·화면별 체크리스트: [`docs/FIGMA_UI_DESIGN.md`](docs/FIGMA_UI_DESIGN.md), [`docs/PAGE_IMPLEMENTATION.md`](docs/PAGE_IMPLEMENTATION.md)
