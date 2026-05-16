interface WalkProgressFooterProps {
  filledCount: number
  total: number
  themeColor: string
}

export function WalkProgressFooter({ filledCount, total, themeColor }: WalkProgressFooterProps) {
  const percent = total > 0 ? Math.round((filledCount / total) * 100) : 0

  return (
    <footer className="sticky bottom-0 border-t border-outline-variant/30 bg-background/95 px-page py-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between text-xs font-medium tracking-wide text-on-surface-variant">
        <span>COLLECTION PROGRESS</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-high">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: themeColor }}
        />
      </div>
    </footer>
  )
}
