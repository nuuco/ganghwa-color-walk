interface ThemeHintBarProps {
  themeLabel: string
  themeColor: string
}

export function ThemeHintBar({ themeLabel, themeColor }: ThemeHintBarProps) {
  return (
    <p className="px-page py-2 text-sm text-on-surface-variant">
      오늘의 색{' '}
      <span className="font-medium" style={{ color: themeColor }}>
        {themeLabel}
      </span>
      를 찾아보세요
    </p>
  )
}
