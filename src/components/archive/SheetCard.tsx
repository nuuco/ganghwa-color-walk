import type { ColorWalkSheet } from '../../types/sheet'
import { DEFAULT_COLS, DEFAULT_ROWS } from '../../config/grid'

interface SheetCardProps {
  sheet: ColorWalkSheet
  onOpen: () => void
  onDelete: () => void
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function SheetCard({ sheet, onOpen, onDelete }: SheetCardProps) {
  const total = sheet.rows * sheet.cols
  const progress = total > 0 ? Math.round((sheet.filledCount / total) * 100) : 0
  const dateLabel = formatDate(sheet.completedAt ?? sheet.updatedAt)
  const badge = sheet.status === 'completed' ? '완성' : '임시저장'

  return (
    <article className="rounded-2xl bg-surface p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{sheet.sheetTitle}</h3>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `${sheet.themeColor}33`,
                color: sheet.themeColor,
              }}
            >
              {badge}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-on-surface-variant">
            <span
              className="h-4 w-4 shrink-0 rounded-full border border-outline-variant/40"
              style={{ backgroundColor: sheet.themeColor }}
              aria-hidden
            />
            <span className="truncate">{sheet.themeLabel}</span>
            {dateLabel ? <span className="shrink-0">· {dateLabel}</span> : null}
          </div>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-on-surface-variant"
          aria-label="시트 메뉴"
        >
          ⋮
        </button>
      </div>

      <button type="button" onClick={onOpen} className="w-full" aria-label={`${sheet.sheetTitle} 미니 그리드`}>
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${DEFAULT_COLS}, minmax(0, 1fr))`,
            gap: 'var(--grid-gap)',
          }}
        >
          {sheet.cells.slice(0, DEFAULT_ROWS * DEFAULT_COLS).map((cell) => (
            <div
              key={cell.index}
              className="aspect-square overflow-hidden rounded-cell bg-surface-high"
            >
              {cell.imageUrl ? (
                <img src={cell.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div
                  className="h-full w-full border border-dashed border-outline-variant/60"
                  style={{ borderColor: `${sheet.themeColor}88` }}
                />
              )}
            </div>
          ))}
        </div>
      </button>

      {sheet.status !== 'completed' ? (
        <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-surface-high">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: sheet.themeColor }}
          />
        </div>
      ) : null}
    </article>
  )
}
