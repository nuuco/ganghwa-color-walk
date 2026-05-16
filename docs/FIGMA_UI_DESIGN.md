# Color Walk (컬러워크) — Figma UI 디자인 기획서

> **목적:** Stitch UI 캡처·`DESIGN.md` 토큰을 기준으로 Figma 제작 및 개발 UI 정합 유지  
> **대상:** UI 디자이너, Figma 제작자, 개발자  
> **버전:** 2.3 (2026-05-16) — MVP BottomNav 제외·의사결정 반영  
> **연계:** [개발 계획](/Users/yoong/.cursor/plans/color_walk_개발_99bd134d.plan.md) · [화면별 구현 체크리스트](./PAGE_IMPLEMENTATION.md)

### 디자인 소스 (Single Source 권장)

| 종류 | 경로 |
|------|------|
| 토큰·브랜드 문구 | 사용자 로컬 `~/Downloads/stitch_ganghwa_color_walk/nocturnal_wanderer/DESIGN.md` → 내용 요약 §3 |
| UI 캡처 (S01~S04) | 저장소 [`docs/reference/screenshots/`](./reference/screenshots/) — `archive-list.png`, `theme-new-sheet.png`, `walk-grid.png`, `view-complete.png` ([README](./reference/screenshots/README.md)) |

---

## 1. 제품·디자인 방향

### 1.1 한 줄 정의

강화도에서 **하나의 색**을 정해 거리를 걸으며 3×3 색깔을 모으고, **엽서 한 장**으로 남기는 느린 산책용 모바일 웹앱.

### 1.2 디자인 키워드 (Mindful Exploration)

| 키워드 | 의미 |
|--------|------|
| **느림** | 32–64px 구간 간격, 짧은 모션으로만 피드백 |
| **관찰** | 다크 배경 위 사진·HEX 스와치가 주연 |
| **강화** | 지역 색 이름(순무 보라, 갯벌 회록 등) |
| **기록** | 시트 제목·수기(선택)·엽서형 완성 카드 |

### 1.3 톤앤매너

- **다크 우선**: DESIGN.md `background` / surface 티어 참고
- **다이나믹 액센트**: `themeColor`가 진행·뱃지·강조 버튼에 혼입
- **미니멀 글래스모픽**: 톤 레이어링, 오버레이는 blur + 얇은 스트로크
- **모바일 세로** 우선

### 1.4 하지 않을 것

- V1 라이트 모드(후순위)
- 하단 탭 2~4번 **실기능**(MVP는 플레이스홀더만)
- 복잡한 온보딩

---

## 2. Figma 파일 설정

### 2.1 캔버스·프레임

| 항목 | 값 |
|------|-----|
| 기준 디바이스 | iPhone 14 / 15 (또는 390×844) |
| Safe area | 상단 59px, 하단 34px (홈 인디케이터) |
| 콘텐츠 최대 너비 | 390px (전폭), 내부 패딩 20px |
| 그리드 gap (3×3) | **6px** (`gutter-grid`) — Stitch·DESIGN.md |
| 레거시 4col | Figma Auto layout 보조용 가능, 콘텐츠는 margin 20 고정 |
| 방향 | **Portrait only** |

### 2.2 권장 Figma 페이지 구조

```
📁 Color Walk
├── 🎨 Design System (컬러·타입·컴포넌트)
├── 📱 Screens — Archive
├── 📱 Screens — Theme
├── 📱 Screens — Walk
├── 📱 Screens — View (완성)
├── 🧩 Overlays (Modal / Bottom Sheet)
├── 🔄 Prototype (플로우 연결)
└── 📋 Specs (간격·상태 표)
```

### 2.3 컴포넌트 네이밍 (Figma)

`Category/Name/Variant/State` 예: `Button/Primary/Default`, `Card/Sheet/Draft`

---

## 3. 디자인 시스템 (DESIGN.md 토큰 매핑)

CSS 변수·Tailwind 테마 작성 시 동일 문자열 사용 권장. YAML 원본은 `DESIGN.md` 참고.

### 3.1 컬러 (Foundation — 다크)

| 토큰 (논리명) | Hex (YAML) | 용도 |
|---------------|------------|------|
| `background` | `#131313` | 앱 최하단 캔버스 |
| `surface-container` | `#201f1f` | 카드·인풋 배경 |
| `surface-container-high` | `#2a2a2a` | 테마 섹션 카드·랜덤 블록 등 |
| `surface-container-highest` | `#353534` | 칩·서브패널 |
| `on-surface` | `#e5e2e1` | 본문·제목 (Primary text) |
| `on-surface-variant` | `#c8c7be` | 메타·보조 텍스트 |
| `outline` / `outline-variant` | `#929189` / `#474741` | 보더·구분선 |
| **Primary CTA 채우기** | `primary` **`#ffffff`** | Stitch: 전폭 메인 버튼(「이 색으로 산책하기」) |
| `on-primary` | `#31312d` | Primary 버튼 위 텍스트 |
| `error` 계열 | YAML 참고 | 삭제 destructive |
| **동적 액센트** | `themeColor`(런타임) | 프로그레스·완성 뱃지·점선 빈 칸·랜덤 선택 순환 하이라이트 |

**카카오 버튼:** Stitch는 노란 대비 — Web 구현 시 `#FEE500` 또는 브랜드 가이드 준수.

### 3.2 타이포그래피 (DESIGN.md)

| 역할 | 스타일 소스 | 모바일 권장 |
|------|-------------|--------------|
| 히어로·큰 헤드 | `display-lg` / `headline-lg-mobile` | **Pretendard**, **Noto Sans KR** — 28px SemiBold(600) 근처 |
| 화면 제목 | `headline-lg-mobile` | 28px / 600 / line 36 |
| 카드 제목·시트명 | `title-md` | 20px / 500 |
| 본문 | `body-md` · `body-lg` | **Pretendard**, **Noto Sans KR** — 16–18 Regular |
| HEX·날짜·뱃지 | `label-sm` | **Pretendard**, **Noto Sans KR** — 12px Medium, letter-spacing 살짝 |

**웹 폰트 스택:** 전 구간 동일하게 **`Pretendard`, `Noto Sans KR`, sans-serif** (필요 시 `system-ui` 등은 그 뒤). `index.html` 또는 글로벌 CSS에서 한 번만 로드·선언한다. 두 패밀리 모두 SIL OFL 계열로 웹 배포에 무난하다.

### 3.3 라운드·간격·그리드 (DESIGN.md)

| 항목 | 값 |
|------|-----|
| `margin-main` | **20px** — 좌우 안전 패딩 |
| `gutter-grid` | **6px** — **3×3 모자이크** gap (Stitch 카드 미리보기 포함) |
| `stack-sm` ~ `stack-xl` | 8 · 16 · 32 · 64 — 섹션 수직 간격 |
| `rounded/sm` … `rounded/xl` | 4 · 8 · 12 · 16 · 24px — 버튼 8–12px, 바텀시트 상단 24px 등 |

### 3.4 디자인 효과 (Elevation)

- 카드 깊이: **그림자 최소**, surface 티어로 구분 (DESIGN.md Elevation 참고)
- 오버레이: **블러 배경**(약 20px) + 테두리 10% white stroke 느낌
- 그리드 셀 탭: scale **1.02** 피드백(DESIGN.md Interaction)

### 3.5 테마 프리셋 (`themes.ts`)

`themes.ts`에 **id · label · color(hex)**. 용도:

1. **랜덤 선택** — 순환·확정 풀  
2. **프리셋에서 고르기**(접힘 UI) — 카드 각 **스와치 + 한글 이름 + HEX**

직접 선택은 프리셋과 무관 — 사용자 `themeColor` + **컬러명(`themeLabel`)** → `themeId: 'custom'`.

| 이름 (예) | HEX (동기화) |
|-----------|----------------|
| 순무 보라 | `#A882E0` |
| 고구마 노랑 | `#D4A83A` |
| 약쑥 초록 | (캡처·`themes.ts`와 동기화) |
| 갯벌 회록 등 | §개발 플랜 `themes.ts` 목록 |

---

## 4. 컴포넌트 라이브러리 (Figma Components)

### 4.1 공통·내비

| 컴포넌트 | Variants | States |
|----------|----------|--------|
| **AppBar** | `Back + Title` · `Title Center` | Default |
| **BottomNav** | 4탭(그리드·팔레트·지도·프로필) | **MVP 미사용** — v2·Stitch 참고용 |
| **FAB** | Primary `+`, `themeColor` 링 또는 고정 | 플로팅, 카드 위 겹침 가능 |
| **Button/PrimaryInvert** | 전폭 화이트 + dark text (Stitch 하단 CTA) | Default, Disabled |
| **Button/Kakao** | 노랑 + 검정 텍스트 | — |
| **Badge** | `Draft` / `Done` | 플릴, 우상단 카드 |
| **ProgressBarThin** | 높이 ~2–4px | `themeColor` fill |
| **ProgressMeta** | 숫자 `%` + `n/m` | walk 하단 |
| **BottomSheet** | Handle 40px 높이 영역 중앙 핸들 (DESIGN.md) | Capture / 메뉴 |

### 4.2 아카이브

| 컴포넌트 | 설명 |
|----------|------|
| **PageHeader** | 앱바 아래 **대제목** 「나의 강화도 색 수집」 (Stitch) |
| **SheetCard** | **인라인 미니 3×3** (gap 6px): 빈 칸 = `themeColor` 솔리드, 채움 = 썸네일 crop. 우상단 뱃지. 제목·테마 스와치·이름·날짜(선택)·완료 시 하단 얇은 프로그레스 라인 |
| **EmptyArchive** | 중앙 안내 「첫 컬러워크를 시작해 보세요」(버튼 없음); 시작은 **FAB** |
| **Overflow** | ⋮ → 삭제 confirm |

### 4.3 테마 (새 컬러워크) — S02

**우선순위:** ① 직접 선택(메인) → ② 랜덤 선택 → ③ 프리셋 카드(서브·접힘).

| 컴포넌트 | 설명 |
|----------|------|
| **SheetTitleField** | 「시트 제목을 입력하세요 (최대 20자)」+ 검증 |
| **SectionHeader** | 「강화 색상」 |
| **CustomColorPicker** | **메인** — 컬러 피커 + **컬러명 입력** + 대형 스와치 미리보기; `themeId='custom'` |
| **ColorRandomButton** | **2순위** — 「랜덤 선택」: 프리셋 색·이름 **빠른 순환** 후 1개 확정 → 해당 프리셋 메타 반영 |
| **ThemePresetPicker** | **3순위·접힘** — disclosure(「프리셋에서 고르기」); 펼치면 **ThemePresetCard** 그리드(2열, 스와치+이름+HEX, 선택=흰 굵은 보더) |
| **StickySummaryBar** | 하단: 스와치·`themeLabel`·「선택됨」+ 「이 색으로 산책하기」(화이트) |

*(구 Stitch: 룰렛·2열 카드 메인 — **폐기**, `theme-new-sheet.png`는 참고용 레거시.)*

### 4.4 그리드·산책

| 컴포넌트 | States |
|----------|--------|
| **GridCell** | `Empty` dashed + `themeColor` + 중앙 `+` · `Filled` cover **radius 4px** (DESIGN.md) |
| **Grid3x3** | gap **6px** |
| **ThemeHintBar** | 전구 아이콘 + 「오늘의 색: {테마명}을 찾아보세요」 |
| **WalkJournal** | 선택 **멀티라인** 2개 — 상단 「산책의 시작을…」, 하단 「발견한 색들에 대한 감상…」 (Stitch) |
| **WalkHeader** | 메인: **시트 제목**, 서브: 테마명 · 우측 `n/m` |

### 4.5 오버레이

| 컴포넌트 | 설명 |
|----------|------|
| **BottomSheet/CaptureSource** | 카메라로 찍기 / 갤러리에서 고르기 |
| **Modal/CellDetail** | 풀스크린 이미지 + 다시 찍기 + 삭제 |
| **Dialog/ConfirmDelete** | 시트·사진 삭제 confirm |

### 4.6 완성(view)

| 컴포넌트 | 설명 |
|----------|------|
| **ViewAppBar** | 「완성된 컬러워크」 |
| **SummaryBanner** | 테마 톤 반투명 배너 + 제목·테마·날짜 한 줄 (Stitch 캡처) |
| **PostcardCard** | 엽서 카드: 로고+테마칩·대형 헤드라인·**3×3 중앙=HEX 패치**(나머지 8=사진)·푸터·**WALK #nn** 배지 |
| **ExportBar** | 사진첩 저장(stitch)·카카오(노랑)·(+ 이미지 공유) |
| **Button/Edit** | 「수정」→ walk |

**헤드라인 문구:** `postcardHeadline` — **S04 view에서 사용자 편집**(초기값은 `themeLabel` 템플릿 가능).

---

## 5. 화면 목록 (Screen Inventory)

총 **4개 스텝별 화면** + **하단 고정 바텀내비(전역)** + **3개 오버레이**.

| ID | 화면명 | step | Figma 프레임명 |
|----|--------|------|----------------|
| S01 | 아카이브 (목록) | `archive` | `01_Archive_List` |
| S01-E | 아카이브 빈 상태 | `archive` | `01_Archive_Empty` |
| S02 | 테마·색 선택 (직접/랜덤/프리셋) | `theme` | `02_Theme_Select` |
| S03 | 산책 그리드 (편집) | `walk` | `03_Walk_Grid` |
| S04 | 완성 (축하+엽서+export) | `view` | `04_View_Complete` |
| NAV | 하단 바 (4탭) | global | `00_BottomNav` — **MVP 제외** |
| O01 | 사진 소스 선택 | overlay | `Overlay_CaptureSource` |
| O02 | 셀 상세 (크게 보기) | overlay | `Overlay_CellDetail` |
| O03 | 삭제 확인 | overlay | `Overlay_ConfirmDelete` |

---

## 6. 화면별 상세 스펙

### S01 — 아카이브 (통합 목록)

**목적:** Stitch 「나의 강화도 색 수집」 — 시트 카드 목록·FAB·플로팅 바텀 네브.

```
┌─────────────────────────────┐
│ ←  컬러워크                   │
│ 나의 강화도 색 수집 (headline)   │
├─────────────────────────────┤
│ [카드] 제목 · 뱃지 · 미니 3×3…  │
│ [카드] …                      │
├─────────────────────────────┤
│              (하단 탭 없음)      │
└─────────────────────────────┘
         FAB (우하)
```

| 영역 | 스펙 |
|------|------|
| 헤더 | **← 없음**(루트) + 앱명, headline-lg **「나의 강화도 색 수집」** |
| SheetCard | **미니 그리드 3×3** (gap 6px)/제목/**테마명+●스와치**/임시저장·완성 뱃지/완성 시 카드 하단 얇은 `themeColor` 라인 등 Stitch 참고 |
| FAB | 우하단 `+`, 새 컬러워크 |
| 하단 | **BottomNav 없음**(MVP) |
| 프로토타입 | Draft 카드→S03 · Done 카드→S04 |

**S01-E 빈 상태**

- 중앙: 부드러운 일러스트(강화 산책 실루엣 등) 또는 3×3 빈 그리드 아이콘
- 카피: 「첫 컬러워크를 시작해 보세요」(안내 문구만 — **중앙 버튼 없음**)
- 새 시트: **FAB `+`만**(S01과 동일, 우하 플로팅) → `theme`

---

### S02 — 테마 선택·새 시트 만들기

```
┌─────────────────────────────┐
│ ←  새 컬러워크               │
│ [시트 제목 입력]              │
│ ── 강화 색상 ──               │
│ [메인] 스와치 + 컬러피커        │
│       컬러명 입력              │
│ [랜덤 선택] 버튼               │
│ ▶ 프리셋에서 고르기 (접힘)      │
│   └ (펼침 시) 2열 카드…        │
├─────────────────────────────┤
│ ● 이름  선택됨  [이 색으로…]   │
└─────────────────────────────┘
```

| 영역 | 스펙 |
|------|------|
| 시트 제목 | 최대 **20자** |
| **① 직접 선택** | 컬러 피커 + **컬러명** — 화면 **상시** 노출(메인) |
| **② 랜덤 선택** | `themes.ts` 프리셋 순환 애니메이션 → 1개 확정(순무 보라·고구마 노랑·약쑥 초록 등) |
| **③ 프리셋** | 기본 **숨김/접힘**; 펼치면 2열 카드(이름·HEX), 선택=흰 보더 |
| 하단 Sticky | 스와치+이름+「선택됨」+ 화이트 CTA |

---

### S03 — 산책 그리드 (walk)

**Stitch 참고**: 시트 제목이 앱바 메인 라인(`순무 밭 산책`), 서브 라인 테마색명, 우측 `4/9`, 힌트 배너(전구), 그리드 **위아래 각각 선택 멀티라인 메모**(산책 시작 / 감상), 하단 **퍼센트**+얇은 progress.

| 요소 | 스펙 |
|------|------|
| 헤더 | 제목=`sheetTitle`, 서브=`themeLabel`, 우측 `n/N` |
| ThemeHintBar | 「오늘의 색: {테마}를 찾아보세요」 |
| GridCell | gap 6px, radius **4px** |
| 메모 필드 | 2블록 스크롤, placeholder Stitch 문구 준수, **IndexedDB 문자열**(개발 계획 §데이터모델) |
| 진행바 | `Math.round((n/N)*100)%` 표시 선택 |

---

### S04 — 완성 (view)

- 앱바: 「완성된 컬러워크」
- 요약 배너: 🎉 + `제목 | 테마색 | 날짜`
- **PostcardCard**: Stitch 시안처럼 헤드라인·브랜딩 행·**중앙 셀 HEX**·팔머파트 8칸 사진·푸터·walk 시퀀스 뱃지
- 버튼: 사진첩 저장(테마 tinted)·카카오(노랑)·(+ 이미지 공유)·텍스트 「수정」

---

### O01 — 사진 소스 선택 (Bottom Sheet)

| 항목 | 스펙 |
|------|------|
| 높이 | ~200px + safe area |
| 핸들 | 상단 4×32 pill |
| 행 1 | 아이콘 카메라 + 「카메라로 찍기」 Body/L |
| 행 2 | 아이콘 갤러리 + 「갤러리에서 고르기」 |
| 취소 | 「닫기」 Text 또는 스와이프 다운 |

---

### O02 — 셀 상세 (Full Screen Modal)

| 항목 | 스펙 |
|------|------|
| 배경 | `#000` 또는 이미지 위 gradient |
| 이미지 | contain, 최대 세로 70vh |
| 상단 | X 닫기 |
| 하단 고정 | Primary 「다시 찍기」 / Destructive 「삭제」 |
| 삭제 탭 | → O03 |

---

### O03 — 삭제 확인 Dialog

- 시트 삭제: 「이 컬러워크를 삭제할까요? 되돌릴 수 없어요」
- 사진 삭제: 「이 칸의 사진을 삭제할까요?」
- 버튼: 취소(Secondary) / 삭제(Destructive)

---

## 7. 사용자 플로우 (Figma Prototype)

### 7.1 메인 플로우

```
S01 → (FAB) → S02 → (CTA) → S03
S03 → (9/9) → S04
S04 → (수정) → S03
S04 → (←목록) → S01
S03 → (←목록) → S01
S01 Draft card → S03
S01 Done card → S04
```

### 7.2 그리드 인터랙션

```
S03 empty cell → O01 → (camera|gallery) → S03 filled
S03 filled cell → O02 → (retake) → O01 → S03
S03 filled cell → O02 → (delete) → O03 → S03 empty or fewer count
S03/S04 delete to <9 → status Draft (카드 뱃지 변경, S01 반영)
S03 → 9/9 again → S04 (축하 항상)
```

### 7.3 인터랙션·모션 가이드

| 동작 | 모션 |
|------|------|
| 화면 전환 | Push left / Dissolve 300ms ease |
| Bottom sheet | Slide up 250ms |
| 랜덤 선택 | 프리셋 색·라벨 **빠른 순환** 1~2s → 1개 **감속 정지**(ease-out); 스핀 중 CTA 비활성 |
| 9/9 → view | 요약 배너·카드 숏 피드백(scale/fade 선택) |
| 체크 on cell | Fade in 150ms |

---

## 8. 엽서(Postcard) 아트보드

html2canvas·공유 출력과 **픽셀 일치**.

| 항목 | 값 |
|------|-----|
| 프레임명 | `05_Postcard_Export` |
| 레이아웃 | 카드 헤더(로고+테마태그)·헤드라인·**3×3**(정가운데 셀= **솔리드 `themeColor` + HEX 텍스트** — Stitch)·푸터 날짜·`WALK #nn` 원형 배지 |

**중앙 HEX 셀:** 사용자는 여전히 **9칸 모두 사진 촬영**. Export 시 레이아웃 엔진이 **row=1,col=1(중앙)** 또는 고정 좌표에만 테마 스와치+코드를 렌더(사진 레이어는 가림)·나머지 8셀은 촬영 이미지. (개발 플래그로 전체 9사진 버전 선택 가능하게 할지 과제 적기)

**확정 (2026-05-16)**

- BottomNav: **MVP 없음**
- `postcardHeadline`: **view에서 편집**
- 엽서 메모: **미포함**
- 9/9: **9칸 모두 촬영**, export만 중앙 HEX
- 카드 날짜: 기본 `completedAt`, **S04에서 수정 가능**

**잔여 과제**

- 라이트 모드, BottomNav v2, 전 9컷 엽서 토글 여부.
- `themes.ts`·약쑥 초록 HEX 최종.

---

## 9. 카피·마이크로카피 목록

| 위치 | 문구 |
|------|------|
| 앱명 | 컬러워크 |
| 아카이브 중제목 | 나의 강화도 색 수집 |
| 시트 제목 필드 placeholder | 시트 제목을 입력하세요 (최대 20자) |
| 색 영역 헤더 | 강화 색상 |
| 컬러명 필드 placeholder | 컬러 이름을 입력하세요 |
| 랜덤 선택 버튼 | 랜덤 선택 |
| 프리셋 접힘 | 프리셋에서 고르기 |
| FAB | 새 컬러워크(a11y) |
| 임시/완성 뱃지 | 임시저장 / 완성 |
| walk 힌트 | 오늘의 색: {테마명}를 찾아보세요 |
| 메모 상단 placeholder | 산책의 시작을 기록해보세요… |
| 메모 하단 placeholder | 발견한 색들에 대한 감상을 남겨주세요… |
| 완성 앱바 | 완성된 컬러워크 |
| CTA 테마 단계 하단 상태 | 선택됨 |
| CTA 시작 | 이 색으로 산책하기 |
| export | 사진첩에 저장 / 카카오톡으로 공유 |
| 수정 | 수정 |
| 오프라인 (Phase4) | 인터넷 없이도 촬영·저장할 수 있어요 |
| 오류 용량 | 사진 용량이 너무 커요 (8MB 이하) |
| 비활성 탭 | 준비 중입니다 (토스트 예시) |

---

## 10. 접근성·터치

| 항목 | 최소값 |
|------|--------|
| 터치 타겟 | 44×44px |
| 본문 대비 | WCAG AA (4.5:1) |
| 스와치 | 색만으로 정보 전달 금지 → **항상 텍스트 라벨 병행** |
| 아이콘 버튼 | aria-label (Figma에 Notes로 기재) |

---

## 11. Figma 제작 체크리스트

- [ ] Design System 페이지: 컬러·타입·버튼·뱃지·스와치
- [ ] 8개 테마 Color Style 등록
- [ ] ~~`00_BottomNav`~~ MVP 제외 · v2 시 추가
- [ ] S01 카드 미니 3×3(mosaic)·PageHeader 문구 반영
- [ ] S02 직접선택(피커+컬러명)·랜덤선택·접힘 프리셋·StickySummaryBar
- [ ] S03 WalkJournal 2종·진행바%
- [ ] `05_Postcard_Export`: 중앙 HEX 셀·WALK 번호
- [ ] GridCell Empty / Filled / Filled+Check
- [ ] Prototype: §7 플로우 연결
- [ ] `05_Postcard_Export` 아트보드
- [ ] 개발 핸드오프: spacing·hex Notes 또는 Dev Mode

---

## 12. 개발 연동 메모

| Figma | 코드 컴포넌트 |
|-------|----------------|
| S01 | `SheetList`, `SheetCard`(미니그리드), `BottomNav` |
| S02 | `SheetTitleInput`, `CustomColorPicker`, `ColorRandomButton`, `ThemePresetPicker`, `ThemeStickyBar` |
| S03 | `WalkHeader`, `DynamicGrid`, `WalkJournal`(x2), `WalkProgressFooter` |
| S04 | `CompleteView`, `PostcardPreview`, `ExportActions` |
| O01 | `CaptureSourceSheet` |
| O02 | `CellDetailModal` |
| O03 | confirm dialog |

**동적 테마:** Figma Component property `themeColor` ↔ 런타임 CSS variable `--theme-color`.

---

## 13. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-05-16 | v1.0 초안 |
| 2026-05-16 | **v2.0** Stitch·`DESIGN.md`(Nocturnal) 반영 — 다크 토큰, 타이포, gap 6px, 바텀내비, 시트명, 워킹 노트 2종, 엽서 중앙 HEX, 하단 선택 요약+CTA |
| 2026-05-16 | **v2.1** §9 카피 섹션 제목 복구; [`PAGE_IMPLEMENTATION.md`](./PAGE_IMPLEMENTATION.md) 연계 추가 |
| 2026-05-16 | **v2.2** S02 — 직접(컬러+이름) 메인, 랜덤 선택, 프리셋 접힘 서브; 룰렛·2열 메인 UI 폐기 |
| 2026-05-16 | **v2.3** MVP BottomNav 제외; 엽서·제목·날짜·공유 등 의사결정 반영 |

---

*이 문서는 구현 전 디자인 기준이며, Figma 작업 후 개발 계획과 불일치 시 본 문서와 개발 계획을 함께 갱신합니다.*
