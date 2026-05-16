import { DEFAULT_COLS, DEFAULT_ROWS } from '../../config/grid'
import type { SheetCell } from '../../types/sheet'
import { GridCell } from './GridCell'

interface DynamicGridProps {
  cells: SheetCell[]
  themeColor: string
  onCellClick: (index: number, filled: boolean) => void
}

export function DynamicGrid({ cells, themeColor, onCellClick }: DynamicGridProps) {
  return (
    <div
      className="grid w-full px-page"
      style={{
        gridTemplateColumns: `repeat(${DEFAULT_COLS}, minmax(0, 1fr))`,
        gap: 'var(--grid-gap)',
      }}
    >
      {cells.slice(0, DEFAULT_ROWS * DEFAULT_COLS).map((cell) => (
        <GridCell
          key={cell.index}
          index={cell.index}
          imageUrl={cell.imageUrl}
          themeColor={themeColor}
          filled={Boolean(cell.imageUrl)}
          onClick={() => onCellClick(cell.index, Boolean(cell.imageUrl))}
        />
      ))}
    </div>
  )
}
