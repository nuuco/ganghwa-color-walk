import { ThemeColorLabel } from '../ui/ThemeColorLabel'

interface WalkHeaderProps {
  sheetTitle: string
  themeLabel: string
  themeColor: string
  filledCount: number
  total: number
}

export function WalkHeader({
  sheetTitle,
  themeLabel,
  themeColor,
  filledCount,
  total,
}: WalkHeaderProps) {
  return (
    <div className="px-page pb-2 pt-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold">{sheetTitle}</h2>
          <ThemeColorLabel
            themeLabel={themeLabel}
            themeColor={themeColor}
            className="mt-1"
          />
        </div>
        <span className="shrink-0 rounded-full bg-surface-high px-3 py-1 text-sm font-medium">
          {filledCount}/{total}
        </span>
      </div>
    </div>
  )
}
