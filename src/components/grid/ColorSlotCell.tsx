import { normalizeThemeHex } from '../../config/grid'

interface ColorSlotCellProps {
  themeColor: string
  className?: string
}

export function ColorSlotCell({ themeColor, className = '' }: ColorSlotCellProps) {
  const hex = normalizeThemeHex(themeColor)

  return (
    <div
      className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-cell font-mono text-[10px] font-bold tracking-wide text-white ${className}`.trim()}
      style={{ backgroundColor: themeColor }}
      aria-label={`테마 컬러 ${hex}`}
    >
      {hex}
    </div>
  )
}
