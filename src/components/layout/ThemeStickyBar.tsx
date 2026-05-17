interface ThemeStickyBarProps {
  themeColor: string
  themeLabel: string
  ctaLabel: string
  disabled?: boolean
  onCta: () => void
}

export function ThemeStickyBar({
  themeColor,
  themeLabel,
  ctaLabel,
  disabled = false,
  onCta,
}: ThemeStickyBarProps) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-outline-variant/40 bg-background/95 px-page py-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="h-10 w-10 shrink-0 rounded-full border border-outline-variant/50"
          style={{ backgroundColor: themeColor }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{themeLabel || '색을 선택해 주세요'}</p>
          <p className="text-xs text-on-surface-variant">선택됨</p>
        </div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onCta}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-on-accent shadow-[0_4px_14px_rgba(247,148,30,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {ctaLabel}
      </button>
    </div>
  )
}
