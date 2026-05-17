/** html2canvas 전용 — 클론 DOM에만 적용 (화면 미리보기와 동일 픽셀 스펙) */
const EXPORT_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif"

/** 완성 화면 PostcardPreview와 동일 */
const TITLE_FONT_SIZE_PX = '20px'
const TITLE_LINE_HEIGHT = '1.375'
const HEADER_MARGIN_TOP_PX = '10px' /* mt-2.5 */
const HEADER_ROW_HEIGHT_PX = '16px' /* h-4 */
const SWATCH_SIZE_PX = '16px' /* size-4 */
const LABEL_FONT_SIZE_PX = '11px' /* export: 화면보다 살짝 작게 */
const LABEL_NUDGE_Y = '-2px'
const LABEL_FONT_WEIGHT = '400'
/** export에서 제목과 스와치 사이가 좁아 보일 때 */
const SWATCH_NUDGE_Y = '4px'

export function applyPostcardExportFixes(clonedDoc: Document): void {
  const root = clonedDoc.querySelector('[data-export-root]')
  if (!(root instanceof HTMLElement)) return

  const title = root.querySelector('[data-postcard-title]')
  if (title instanceof HTMLElement) {
    title.style.display = 'block'
    title.style.marginBottom = '0'
    title.style.fontSize = TITLE_FONT_SIZE_PX
    title.style.fontWeight = '700'
    title.style.lineHeight = TITLE_LINE_HEIGHT
    title.style.fontFamily = EXPORT_FONT_STACK
  }

  const header = root.querySelector('[data-postcard-header]')
  if (header instanceof HTMLElement) {
    header.style.display = 'flex'
    header.style.alignItems = 'center'
    header.style.boxSizing = 'border-box'
    header.style.height = HEADER_ROW_HEIGHT_PX
    header.style.marginTop = HEADER_MARGIN_TOP_PX
    header.style.overflow = 'visible'
  }

  root.querySelectorAll('[data-postcard-swatch]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    node.style.width = SWATCH_SIZE_PX
    node.style.height = SWATCH_SIZE_PX
    node.style.flexShrink = '0'
    node.style.transform = `translateY(${SWATCH_NUDGE_Y})`
  })

  root.querySelectorAll('[data-export-theme-label]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    node.style.overflow = 'visible'
    node.style.textOverflow = 'clip'
    node.style.whiteSpace = 'nowrap'
    node.style.fontSize = LABEL_FONT_SIZE_PX
    node.style.fontWeight = LABEL_FONT_WEIGHT
    node.style.lineHeight = '1'
    node.style.fontFamily = EXPORT_FONT_STACK
    node.style.transform = `translateY(${LABEL_NUDGE_Y})`
  })

  root.querySelectorAll('[data-export-footer-attribution]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    node.style.lineHeight = '1.2'
    node.style.fontFamily = EXPORT_FONT_STACK
    node.style.overflow = 'visible'
  })
}
