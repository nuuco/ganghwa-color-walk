interface ThemeColorLabelProps {
  themeLabel: string
  themeColor: string
  className?: string
}

/** 아카이브 SheetCard·산책 헤더 등 공통 — 스와치 + 컬러명 */
export function ThemeColorLabel({
  themeLabel,
  themeColor,
  className = '',
}: ThemeColorLabelProps) {
  return (
    <span
      className={['flex min-w-0 items-center gap-2 text-sm text-on-surface-variant', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className="h-4 w-4 shrink-0 rounded-full border border-outline-variant/40"
        style={{ backgroundColor: themeColor }}
        aria-hidden
      />
      <span className="truncate">{themeLabel}</span>
    </span>
  )
}
