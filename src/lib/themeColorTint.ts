/** HEX 표시용 — 채도를 낮춘 회색기 톤 */
export function hexDisplayColor(hex: string): string {
  return `color-mix(in srgb, ${hex} 55%, #9ca3af)`
}

/** 컬러명 입력 필드 스핀 중 tint */
export function inputTintStyle(hex: string): {
  backgroundColor: string
  borderColor: string
} {
  return {
    backgroundColor: `color-mix(in srgb, ${hex} 20%, var(--color-surface))`,
    borderColor: `color-mix(in srgb, ${hex} 45%, var(--color-outline-variant, #3a3a3a))`,
  }
}
