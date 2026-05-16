interface SummaryBannerProps {
  sheetTitle: string
  themeLabel: string
  dateValue: string
  onDateChange: (value: string) => void
}

export function SummaryBanner({
  sheetTitle,
  themeLabel,
  dateValue,
  onDateChange,
}: SummaryBannerProps) {
  return (
    <section className="mx-page rounded-2xl bg-surface-high p-4">
      <p className="mb-2 text-lg">🎉</p>
      <p className="text-base font-semibold">
        {sheetTitle} | {themeLabel}
      </p>
      <label className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant">
        <span>날짜</span>
        <input
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-lg border border-outline-variant/50 bg-surface px-2 py-1 text-on-surface"
        />
      </label>
    </section>
  )
}
