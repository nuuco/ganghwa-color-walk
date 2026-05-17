/** html2canvas 전용 — 클론 DOM에만 적용 (화면 미리보기 스타일은 변경하지 않음) */
const EXPORT_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif"

/** Pretendard baseline 보정 — export에서 컬러명이 원보다 아래로 그려질 때 */
const THEME_LABEL_NUDGE_Y = '-8px'

export function applyPostcardExportFixes(clonedDoc: Document): void {
  const root = clonedDoc.querySelector('[data-export-root]')
  if (!(root instanceof HTMLElement)) return

  const header = root.querySelector('[data-postcard-header]')
  if (header instanceof HTMLElement) {
    header.style.display = 'flex'
    header.style.alignItems = 'center'
    header.style.boxSizing = 'border-box'
    header.style.height = '20px'
    header.style.overflow = 'visible'
  }

  root.querySelectorAll('[data-export-theme-label]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    node.style.overflow = 'visible'
    node.style.textOverflow = 'clip'
    node.style.whiteSpace = 'nowrap'
    node.style.lineHeight = '1'
    node.style.fontFamily = EXPORT_FONT_STACK
    node.style.transform = `translateY(${THEME_LABEL_NUDGE_Y})`
  })

  root.querySelectorAll('[data-export-footer-attribution]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    node.style.lineHeight = '1.2'
    node.style.fontFamily = EXPORT_FONT_STACK
    node.style.overflow = 'visible'
  })
}
