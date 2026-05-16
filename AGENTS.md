# Color Walk — 작업 이력

- 개발 계획 repo 반영: `.cursor/plans` → `docs/plan.md` · FIGMA·PAGE 연계 링크 갱신
- 화면별 구현 체크리스트 초안 추가: `docs/PAGE_IMPLEMENTATION.md` (FIGMA_UI_DESIGN·개발 플랜 연계)
- Stitch 스크린샷 정리: `screen1~4.png` → `docs/reference/screenshots/` (S01~S04 파일명 변경) · `PAGE_IMPLEMENTATION`·`FIGMA_UI_DESIGN` 연결
- 타이포 기준 확정: 웹 폰트 **Pretendard + Noto Sans KR** 단일 스택 (`FIGMA_UI_DESIGN` §3.2 · `PAGE_IMPLEMENTATION` 공통)
- 개발 플랜 정합: 화면 ID·구성요소 체크리스트·Phase 매핑·폰트·S01-E/O01~O03·SheetCard ⋮ 반영 (`color_walk_개발` 플랜)
- S01-E 확정: 빈 목록은 중앙 「첫 컬러워크를 시작해 보세요」만, 새 시트는 **FAB `+`만** (중앙 CTA 없음)
- S02 색 선택 UX: 직접(컬러+이름) 메인, 랜덤 선택, 프리셋 카드 접힘 서브 — FIGMA·PAGE·개발 플랜 반영
- MVP 의사결정: BottomNav 없음, S01 ← 없음, 제목·컬러명 필수, 엽서 헤드 view 편집, 9칸 촬영, 공유 3종, 날짜 S04 수정
- Phase 1 scaffold complete: React 19·Vite·Tailwind·Context step 전환·S01~S04·O01~O03 스텁
- Phase 2 IndexedDB camera persist: localforage·셀 Blob·카메라/갤러리·O03 삭제·메모 debounce·9/9 완성
- Phase 3 S04 export: html2canvas 엽서 캡처·저장/이미지 공유·카카오 링크 피드·PostcardPreview·ExportActions
- Phase 4 PWA: vite-plugin-pwa·manifest·오프라인 배너·카카오 오프라인 비활성·README
- IndexedDB thumb 저장 제거: 셀 blob만 유지
- FAB 위치: `max-w-app`(448px) 컬럼 안 우하단 정렬 (`OfflineBanner`·Walk 오류 배너와 동일 패턴)
