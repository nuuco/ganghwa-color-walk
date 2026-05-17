import { useEffect, useId, useRef, useState } from 'react'

interface SheetCardOverflowMenuProps {
  onEdit: () => void
  onDelete: () => void
}

export function SheetCardOverflowMenu({ onEdit, onDelete }: SheetCardOverflowMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div ref={rootRef} className="relative shrink-0 self-start -mr-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="flex h-11 w-11 items-start justify-center pt-0.5 text-on-surface-variant"
        aria-label="시트 메뉴"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        ⋮
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-30 mt-1 min-w-[7.5rem] overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-high py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="flex h-11 w-full items-center px-4 text-left text-sm text-on-surface"
            onClick={(e) => {
              e.stopPropagation()
              close()
              onEdit()
            }}
          >
            수정
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex h-11 w-full items-center px-4 text-left text-sm text-red-400"
            onClick={(e) => {
              e.stopPropagation()
              close()
              onDelete()
            }}
          >
            삭제
          </button>
        </div>
      ) : null}
    </div>
  )
}
