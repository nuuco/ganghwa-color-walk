import { DEFAULT_COLS, isCenterColorSlot } from '../../config/grid'
import type { ColorWalkSheet } from '../../types/sheet'
import { CenterColorSlotCell } from './CenterColorSlotCell'
import { GridCell } from './GridCell'

interface DynamicGridProps {
  sheet: Pick<
    ColorWalkSheet,
    'cells' | 'rows' | 'cols' | 'centerColorSlot' | 'themeColor' | 'themeLabel'
  >
  onCellClick: (index: number, filled: boolean) => void
}

export function DynamicGrid({ sheet, onCellClick }: DynamicGridProps) {
  const cellCount = sheet.rows * sheet.cols

  return (
    <div
      className="grid w-full px-page"
      style={{
        gridTemplateColumns: `repeat(${DEFAULT_COLS}, minmax(0, 1fr))`,
        gap: 'var(--grid-gap)',
      }}
    >
      {sheet.cells.slice(0, cellCount).map((cell) => {
        if (isCenterColorSlot(sheet, cell.index)) {
          return (
            <CenterColorSlotCell
              key={cell.index}
              themeColor={sheet.themeColor}
              imageUrl={cell.imageUrl}
              showEmptyPlaceholder
            />
          )
        }

        const filled = Boolean(cell.imageUrl)
        return (
          <GridCell
            key={cell.index}
            index={cell.index}
            variant={filled ? 'photo-filled' : 'photo-empty'}
            imageUrl={cell.imageUrl}
            themeColor={sheet.themeColor}
            onClick={() => onCellClick(cell.index, filled)}
          />
        )
      })}
    </div>
  )
}
