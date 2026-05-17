import {
  DndContext,
  DragOverlay,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
} from '@dnd-kit/core'
import { useState } from 'react'
import { getCenterCellIndex, isCenterColorSlot } from '../../config/grid'
import { gridMosaicClassName, gridMosaicColumnsStyle } from './gridMosaic'
import type { ColorWalkSheet } from '../../types/sheet'
import { CenterColorSlotCell } from './CenterColorSlotCell'
import { parseCellDndId } from './cellDndId'
import { WalkGridCell } from './WalkGridCell'

const dropAnimation: DropAnimation = {
  duration: 220,
  easing: 'cubic-bezier(0.18, 0.67, 0.35, 1)',
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0',
      },
    },
  }),
}

interface DraggableWalkGridProps {
  sheet: Pick<
    ColorWalkSheet,
    'cells' | 'rows' | 'cols' | 'centerColorSlot' | 'themeColor' | 'themeLabel'
  >
  reorderDisabled?: boolean
  onCellClick: (index: number, filled: boolean) => void
  onSwapCells: (fromIndex: number, toIndex: number) => void
}

export function DraggableWalkGrid({
  sheet,
  reorderDisabled = false,
  onCellClick,
  onSwapCells,
}: DraggableWalkGridProps) {
  const cellCount = sheet.rows * sheet.cols
  const centerIndex = getCenterCellIndex(sheet.rows, sheet.cols)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const activeCell = activeIndex !== null ? sheet.cells[activeIndex] : undefined

  const handleDragStart = (event: DragStartEvent) => {
    const index = parseCellDndId(event.active.id)
    setActiveIndex(index)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const fromIndex = parseCellDndId(event.active.id)
    const toIndex = event.over ? parseCellDndId(event.over.id) : null

    if (
      !reorderDisabled &&
      fromIndex !== null &&
      toIndex !== null &&
      fromIndex !== toIndex
    ) {
      onSwapCells(fromIndex, toIndex)
    }

    setActiveIndex(null)
  }

  const handleDragCancel = () => {
    setActiveIndex(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
            <WalkGridCell
              key={cell.index}
              index={cell.index}
              variant={filled ? 'photo-filled' : 'photo-empty'}
              imageUrl={cell.imageUrl}
              themeColor={sheet.themeColor}
              className={cell.index === centerIndex ? 'grid-cell-center' : undefined}
              dropDisabled={reorderDisabled}
              reorderDisabled={reorderDisabled}
              onClick={() => onCellClick(cell.index, filled)}
            />
          )
        })}
      </div>
      <DragOverlay dropAnimation={dropAnimation} className="touch-none">
        {activeCell?.imageUrl ? (
          <div className="aspect-square w-[calc((100vw-2*var(--page-padding,1.25rem))/3)] max-w-[140px] scale-[1.02] overflow-hidden rounded-none shadow-lg ring-2 ring-white/30">
            <img
              src={activeCell.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
