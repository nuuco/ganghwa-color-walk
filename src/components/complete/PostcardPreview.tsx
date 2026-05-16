import { DEFAULT_COLS, DEFAULT_ROWS } from '../../config/grid'
import type { ColorWalkSheet } from '../../types/sheet'

interface PostcardPreviewProps {
  sheet: ColorWalkSheet
  headline: string
}

export function PostcardPreview({ sheet, headline }: PostcardPreviewProps) {
  const centerIndex = Math.floor((DEFAULT_ROWS * DEFAULT_COLS) / 2)

  return (
    <section
      className="mx-page overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface p-4"
      aria-label="엽서 미리보기"
    >
      <input
        type="text"
        value={headline}
        readOnly
        className="mb-3 w-full border-none bg-transparent text-lg font-bold outline-none"
        aria-label="엽서 헤드라인"
      />
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${DEFAULT_COLS}, minmax(0, 1fr))`,
          gap: 'var(--grid-gap)',
        }}
      >
        {sheet.cells.slice(0, DEFAULT_ROWS * DEFAULT_COLS).map((cell) => (
          <div
            key={cell.index}
            className="flex aspect-square items-center justify-center overflow-hidden rounded-cell bg-surface-high"
          >
            {cell.index === centerIndex ? (
              <span className="font-mono text-xs" style={{ color: sheet.themeColor }}>
                {sheet.themeColor}
              </span>
            ) : cell.imageUrl ? (
              <img src={cell.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] text-on-surface-variant">—</span>
            )}
          </div>
        ))}
      </div>
      {sheet.walkOrdinal ? (
        <p className="mt-3 text-center text-xs tracking-widest text-on-surface-variant">
          WALK #{sheet.walkOrdinal}
        </p>
      ) : null}
    </section>
  )
}
