function parseHexRgb(hexColor: string): { r: number; g: number; b: number } | null {
  const hex = hexColor.replace('#', '').trim()
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    if ([r, g, b].some(Number.isNaN)) return null
    return { r, g, b }
  }
  if (hex.length >= 6) {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    if ([r, g, b].some(Number.isNaN)) return null
    return { r, g, b }
  }
  return null
}

/** 배경 밝기에 따라 어두운/밝은 전경색 */
export function getContrastTextColor(hexColor: string): '#131313' | '#ffffff' {
  const rgb = parseHexRgb(hexColor)
  if (!rgb) return '#ffffff'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.55 ? '#131313' : '#ffffff'
}
