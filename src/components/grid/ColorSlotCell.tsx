import { normalizeThemeHex } from '../../config/grid'
import { getContrastTextColor } from '../../lib/colorContrast'

interface ColorSlotCellProps {
  themeColor: string
  overlay?: boolean
  className?: string
}

export function ColorSlotCell({
  themeColor,
  overlay = false,
  className = '',
}: ColorSlotCellProps) {
  const textColor = getContrastTextColor(themeColor)
  const hex = normalizeThemeHex(themeColor)

  return (
    <div
      className={
        overlay
          ? `col-start-1 row-start-1 z-10 flex h-full w-full min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-none px-1 text-center font-mono text-[10px] font-semibold leading-tight ${className}`.trim()
          : `flex aspect-square w-full items-center justify-center overflow-hidden rounded-none px-1 text-center font-mono text-[10px] font-semibold leading-tight ${className}`.trim()
      }
      style={{ backgroundColor: themeColor, color: textColor }}
      aria-hidden={overlay}
      aria-label={overlay ? undefined : `테마 컬러 ${hex}`}
    >
      <span className="truncate">{hex}</span>
    </div>
  )
}
