import { normalizeThemeHex } from '../../config/grid'

interface ColorSlotCellProps {
  themeColor: string
  overlay?: boolean
  className?: string
}

export function ColorSlotCell({ themeColor, overlay = false, className = '' }: ColorSlotCellProps) {
  const hex = normalizeThemeHex(themeColor)

  return (
    <div
      className={
        overlay
          ? `absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-cell font-mono text-[10px] font-bold tracking-wide text-white ${className}`.trim()
          : `flex aspect-square w-full items-center justify-center overflow-hidden rounded-cell font-mono text-[10px] font-bold tracking-wide text-white ${className}`.trim()
      }
      style={{ backgroundColor: themeColor }}
      aria-hidden={overlay}
      aria-label={overlay ? undefined : `테마 컬러 ${hex}`}
    >
      {hex}
    </div>
  )
}
