import { CenterColorSlotChip } from './CenterColorSlotChip'

interface ThemeHintBarProps {
  themeLabel: string
  themeColor: string
  centerColorSlot?: boolean
  onCenterColorSlotChange?: (enabled: boolean) => void
}

export function ThemeHintBar({
  themeLabel,
  themeColor,
  centerColorSlot = false,
  onCenterColorSlotChange,
}: ThemeHintBarProps) {
  const showCenterToggle = onCenterColorSlotChange !== undefined

  return (
    <div className="flex items-center gap-3 px-page py-2">
      <p className="min-w-0 flex-1 text-sm leading-snug text-on-surface-variant">
        오늘의 색{' '}
        <span className="font-medium" style={{ color: themeColor }}>
          {themeLabel}
        </span>
        를 찾아보세요
      </p>
      {showCenterToggle ? (
        <CenterColorSlotChip
          enabled={centerColorSlot}
          onChange={onCenterColorSlotChange}
        />
      ) : null}
    </div>
  )
}
