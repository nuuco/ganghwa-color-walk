import type { ArchiveViewMode } from '../../hooks/useArchiveViewMode'
import type { ColorWalkSheet } from '../../types/sheet'
import { DEFAULT_COLS, DEFAULT_ROWS, getEffectiveFilledCount, isCenterColorSlot } from '../../config/grid'
import { CenterColorSlotCell } from '../grid/CenterColorSlotCell'
import { ThemeColorLabel } from '../ui/ThemeColorLabel'

interface SheetCardProps {
  sheet: ColorWalkSheet
  viewMode: ArchiveViewMode
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

export function SheetCard({ sheet, viewMode, onOpen, onDelete }: SheetCardProps) {
  const total = sheet.rows * sheet.cols
  const effectiveFilled = getEffectiveFilledCount(sheet)
  const progress = total > 0 ? Math.round((effectiveFilled / total) * 100) : 0
  const dateLabel = formatDate(sheet.completedAt ?? sheet.updatedAt)
  const isCompleted = sheet.status === 'completed'

  return (
    <article className="rounded-2xl bg-surface p-4">
      <div
        className={[
          'flex items-start justify-between gap-2',
          viewMode === 'bento' ? 'mb-3' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{sheet.sheetTitle}</h3>
            {isCompleted ? (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${sheet.themeColor}33`,
                  color: sheet.themeColor,
                }}
              >
                완성
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-on-surface-variant">
            <ThemeColorLabel themeLabel={sheet.themeLabel} themeColor={sheet.themeColor} />
            {dateLabel ? <span className="shrink-0">· {dateLabel}</span> : null}
            {viewMode === 'compact' ? (
              <span className="shrink-0 font-medium tabular-nums text-on-surface">
                · {effectiveFilled}/{total}
              </span>
            ) : null}
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

      {viewMode === 'bento' ? (
        <button type="button" onClick={onOpen} className="w-full" aria-label={`${sheet.sheetTitle} 미니 그리드`}>
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${DEFAULT_COLS}, minmax(0, 1fr))`,
            gap: 'var(--grid-gap)',
          }}
        >
          {sheet.cells.slice(0, DEFAULT_ROWS * DEFAULT_COLS).map((cell) => {
            if (isCenterColorSlot(sheet, cell.index)) {
              return (
                <CenterColorSlotCell
                  key={cell.index}
                  themeColor={sheet.themeColor}
                  imageUrl={cell.imageUrl}
                />
              )
            }

            return (
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
            )
          })}
        </div>
        </button>
      ) : null}

      <div
        className={`h-0.5 overflow-hidden rounded-full bg-surface-high ${viewMode === 'bento' ? 'mt-3' : 'mt-2'}`}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, backgroundColor: sheet.themeColor }}
        />
      </div>
    </article>
  )
}
