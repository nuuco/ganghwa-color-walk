import type { DraggableAttributes } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

interface GridCellDragHandleProps {
  listeners?: SyntheticListenerMap
  attributes?: DraggableAttributes
}

export function GridCellDragHandle({ listeners, attributes }: GridCellDragHandleProps) {
  return (
    <button
      type="button"
      className="absolute left-1 top-1 z-10 flex h-7 w-7 touch-none items-center justify-center rounded-md bg-black/50 text-white backdrop-blur-sm"
      style={{ touchAction: 'none' }}
      aria-label="사진 위치 옮기기"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      {...listeners}
      {...attributes}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="4" cy="3" r="1.25" />
        <circle cx="10" cy="3" r="1.25" />
        <circle cx="4" cy="7" r="1.25" />
        <circle cx="10" cy="7" r="1.25" />
        <circle cx="4" cy="11" r="1.25" />
        <circle cx="10" cy="11" r="1.25" />
      </svg>
    </button>
  )
}
