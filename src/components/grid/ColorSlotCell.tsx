import { getContrastTextColor } from '../../lib/colorContrast'

interface ColorSlotCellProps {
  themeColor: string
  themeLabel: string
  overlay?: boolean
  className?: string
}

export function ColorSlotCell({
  themeColor,
  themeLabel,
  overlay = false,
  className = '',
}: ColorSlotCellProps) {
  const textColor = getContrastTextColor(themeColor)
  const label = themeLabel.trim() || ' '

  return (
    <div
      className={
        overlay
          ? `absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-cell px-1 text-center text-[10px] font-semibold leading-tight ${className}`.trim()
          : `flex aspect-square w-full items-center justify-center overflow-hidden rounded-cell px-1 text-center text-[10px] font-semibold leading-tight ${className}`.trim()
      }
      style={{ backgroundColor: themeColor, color: textColor }}
      aria-hidden={overlay}
      aria-label={overlay ? undefined : `테마 컬러 ${label}`}
    >
      <span className="line-clamp-2">{label}</span>
    </div>
  )
}
