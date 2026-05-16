# 컬러워크 (Color Walk)

하루의 색을 찾아 9칸 사진 그리드와 엽서로 기록하는 모바일 웹 PWA입니다. 촬영·저장은 브라우저 **IndexedDB**에 로컬로 보관되며, 완성 후 엽서 이미지 저장·공유를 지원합니다.

## 시작하기

```bash
npm install
npm run dev
```

- 개발 서버: 기본 `http://localhost:5173`
- 프로덕션 빌드: `npm run build`
- 빌드 미리보기: `npm run preview`

## 환경 변수

`.env.example`을 복사해 `.env`를 만듭니다.

| 변수 | 설명 |
|------|------|
| `VITE_KAKAO_JS_KEY` | 카카오 JavaScript 키 (카카오톡 링크 피드 공유) |
| `VITE_APP_URL` | 배포된 앱 URL (카카오 공유 링크·피드 기준) |

키가 없으면 카카오 공유 버튼은 비활성화됩니다. 오프라인에서는 카카오 공유만 비활성이며, 사진첩 저장·이미지 공유(기기 지원 시)는 로컬에서 동작할 수 있습니다.

## PWA · 홈 화면 추가

빌드 후 HTTPS(또는 localhost)에서 서비스 워커가 등록됩니다.

- **iOS Safari**: 공유 → 「홈 화면에 추가」
- **Android Chrome**: 메뉴 → 「앱 설치」 또는 「홈 화면에 추가」

`manifest` 앱 이름: **컬러워크**, 테마·배경색 `#131313`, 세로(portrait) standalone.

## 카메라 · HTTPS

`getUserMedia` 및 일부 공유 API는 **보안 컨텍스트(HTTPS)** 또는 `localhost`에서만 동작합니다.

- 로컬 LAN 테스트: `npm run dev -- --host` 후 기기에서 `https://` 프록시 또는 터널(ngrok 등) 사용 권장
- 배포 시 Vercel·Netlify 등 정적 호스팅은 기본 HTTPS 제공

## 배포

정적 SPA로 배포합니다.

1. `npm run build` → `dist/` 생성
2. **Vercel**: 프로젝트 루트 연결, Build `npm run build`, Output `dist`, SPA fallback `index.html`
3. **Netlify**: 동일하게 `dist` publish, redirects에 `/* /index.html 200` (또는 `_redirects`)

환경 변수는 호스팅 대시보드에 `VITE_*` 이름으로 설정합니다.

## 개발 Phase 요약

| Phase | 내용 |
|-------|------|
| 1 | React·Vite·Tailwind·화면 스텁 (S01~S04) |
| 2 | IndexedDB·9칸 촬영·갤러리·메모 |
| 3 | 엽서 캡처·저장·이미지/카카오 공유 |
| 4 | PWA(manifest·SW)·오프라인 배너·카카오 오프라인 처리 |

상세 UI·체크리스트: `docs/FIGMA_UI_DESIGN.md`, `docs/PAGE_IMPLEMENTATION.md`
