import { forwardRef } from 'react'
import { getCenterCellIndex, isCenterColorSlot } from '../../config/grid'
import { CenterColorSlotCell } from '../grid/CenterColorSlotCell'
import { gridMosaicClassName, gridMosaicColumnsStyle } from '../grid/gridMosaic'
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
    const centerIndex = getCenterCellIndex(sheet.rows, sheet.cols)
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
        <div className="mb-4">
          <h2 data-postcard-title className="text-xl font-bold leading-snug">
            {displayTitle}
          </h2>
          <div
            data-postcard-header
            className="mt-2.5 flex h-4 max-w-full items-center gap-1.5"
          >
            <span
              data-postcard-swatch
              className="size-4 shrink-0 rounded-full border border-white/25"
              style={{ backgroundColor: sheet.themeColor }}
              aria-hidden
            />
            <span
              data-export-theme-label
              className="min-w-0 text-xs font-medium leading-none text-white"
            >
              {sheet.themeLabel}
            </span>
          </div>
        </div>

        <div
          className={gridMosaicClassName}
          style={{
            ...gridMosaicColumnsStyle,
            gridTemplateColumns: `repeat(${sheet.cols}, minmax(0, 1fr))`,
          }}
        >
          {sheet.cells.slice(0, cellCount).map((cell) => {
            if (isCenterColorSlot(sheet, cell.index)) {
              return (
                <CenterColorSlotCell
                  key={cell.index}
                  themeColor={sheet.themeColor}
                  imageUrl={cell.imageUrl}
                  imageCrossOrigin="anonymous"
                />
              )
            }

            return (
              <div
                key={cell.index}
                className={`relative aspect-square overflow-hidden rounded-none bg-surface-high${
                  cell.index === centerIndex ? ' grid-cell-center' : ''
                }`}
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

        <footer className="mt-4 flex items-center justify-between gap-2">
          <p
            data-export-footer-attribution
            className="shrink-0 text-[10px] leading-none text-on-surface-variant"
          >
            @강화 컬러워크
          </p>
          <p className="shrink-0 text-xs leading-none text-on-surface-variant">
            {completedLabel}
          </p>
        </footer>
      </section>
    )
  },
)
