interface ThemeHintBarProps {
  themeLabel: string
}

export function ThemeHintBar({ themeLabel }: ThemeHintBarProps) {
  return (
    <p className="px-page py-2 text-sm text-on-surface-variant">
      오늘의 색: <span className="text-on-surface">{themeLabel}</span>를 찾아보세요
    </p>
  )
}
