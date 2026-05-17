import { isCenterColorSlot } from '../../config/grid'
import { gridMosaicClassName, gridMosaicColumnsStyle } from './gridMosaic'
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
    <div className={`${gridMosaicClassName} px-page`} style={gridMosaicColumnsStyle}>
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
