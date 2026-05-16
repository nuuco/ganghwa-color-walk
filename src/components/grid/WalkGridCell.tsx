import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useCallback, type CSSProperties } from 'react'
import type { GridCellVariant } from './GridCell'
import { cellDndId } from './cellDndId'
import { GridCellDragHandle } from './GridCellDragHandle'

interface WalkGridCellProps {
  index: number
  variant: GridCellVariant
  imageUrl?: string
  themeColor: string
  dropDisabled?: boolean
  reorderDisabled?: boolean
  onClick: () => void
}

export function WalkGridCell({
  index,
  variant,
  imageUrl,
  themeColor,
  dropDisabled = false,
  reorderDisabled = false,
  onClick,
}: WalkGridCellProps) {
  const filled = variant === 'photo-filled'
  const dndId = cellDndId(index)

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: dndId,
    disabled: !filled || reorderDisabled,
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: dndId,
    disabled: dropDisabled,
  })

  const setNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDragRef(node)
      setDropRef(node)
    },
    [setDragRef, setDropRef],
  )

  const cellStyle: CSSProperties = {
    transition: 'opacity 180ms ease, box-shadow 180ms ease',
    opacity: isDragging ? 0 : 1,
    boxShadow: isOver && !dropDisabled ? `0 0 0 2px ${themeColor}` : undefined,
    transform: isDragging ? undefined : transform ? CSS.Translate.toString(transform) : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      className="relative aspect-square w-full overflow-hidden rounded-cell bg-surface-high"
      style={cellStyle}
    >
      <button
        type="button"
        onClick={onClick}
        className="relative h-full w-full overflow-hidden"
        aria-label={filled ? `칸 ${index + 1} 사진 보기` : `칸 ${index + 1} 사진 추가`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center border-2 border-dashed"
            style={{ borderColor: themeColor }}
          >
            <span
              className="select-none text-3xl font-light leading-none"
              style={{ color: themeColor }}
              aria-hidden
            >
              +
            </span>
          </div>
        )}
      </button>
      {filled && !reorderDisabled ? (
        <GridCellDragHandle listeners={listeners} attributes={attributes} />
      ) : null}
    </div>
  )
}
