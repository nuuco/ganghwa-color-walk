import { forwardRef } from 'react'
import { isCenterColorSlot } from '../../config/grid'
import { CenterColorSlotCell } from '../grid/CenterColorSlotCell'
import type { ColorWalkSheet } from '../../types/sheet'

interface PostcardPreviewProps {
  sheet: ColorWalkSheet
}

function formatPostcardDate(iso?: string): string {
  const date = iso ? new Date(iso) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const PostcardPreview = forwardRef<HTMLElement, PostcardPreviewProps>(
  function PostcardPreview({ sheet }, ref) {
    const cellCount = sheet.rows * sheet.cols
    const displayTitle = sheet.sheetTitle.trim() || sheet.themeLabel
    const completedLabel = formatPostcardDate(sheet.completedAt ?? sheet.updatedAt)
    const memoText = sheet.noteReflection.trim()

    return (
      <section
        ref={ref}
        data-export-root
        className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl p-5 text-on-surface"
        style={{ backgroundColor: '#201f1f' }}
        aria-label="엽서 미리보기"
      >
        <header className="mb-4 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-on-surface-variant">
            COLOR WALK
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: `${sheet.themeColor}33`,
              color: sheet.themeColor,
            }}
          >
            {sheet.themeLabel}
          </span>
        </header>

        <h2 className="mb-4 text-xl font-bold leading-snug">{displayTitle}</h2>

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${sheet.cols}, minmax(0, 1fr))`,
            gap: 'var(--grid-gap)',
          }}
        >
          {sheet.cells.slice(0, cellCount).map((cell) => {
            if (isCenterColorSlot(sheet, cell.index)) {
              return (
                <CenterColorSlotCell
                  key={cell.index}
                  themeColor={sheet.themeColor}
                  themeLabel={sheet.themeLabel}
                  imageUrl={cell.imageUrl}
                  imageCrossOrigin="anonymous"
                />
              )
            }

            return (
              <div
                key={cell.index}
                className="relative aspect-square overflow-hidden rounded-cell bg-surface-high"
              >
                {cell.imageUrl ? (
                  <img
                    src={cell.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : null}
              </div>
            )
          })}
        </div>

        {memoText ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-on-surface">
            {memoText}
          </p>
        ) : null}

        <footer className="mt-4 flex items-end justify-between gap-3">
          <p className="text-xs text-on-surface-variant">{completedLabel}</p>
          {sheet.walkOrdinal ? (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/60 text-center text-[9px] font-bold leading-tight tracking-tight"
              style={{ color: sheet.themeColor }}
            >
              WALK
              <br />#{sheet.walkOrdinal}
            </span>
          ) : null}
        </footer>
      </section>
    )
  },
)
