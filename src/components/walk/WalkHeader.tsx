import { useEffect, useRef, useState } from 'react'
import { isValidSheetTitle, SHEET_TEXT_MAX_LENGTH } from '../../config/textLimits'
import { ThemeEditModal } from '../overlays/ThemeEditModal'
import { PencilIcon } from '../ui/PencilIcon'
import { WalkThemeDisplay } from './WalkThemeDisplay'

interface WalkHeaderProps {
  sheetTitle: string
  themeLabel: string
  themeColor: string
  filledCount: number
  total: number
  titleEditable?: boolean
  onTitleChange?: (title: string) => void
  themeEditable?: boolean
  onThemeChange?: (patch: { themeLabel: string; themeColor: string }) => void
}

export function WalkHeader({
  sheetTitle,
  themeLabel,
  themeColor,
  filledCount,
  total,
  titleEditable = false,
  onTitleChange,
  themeEditable = false,
  onThemeChange,
}: WalkHeaderProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(sheetTitle)
  const [themeModalOpen, setThemeModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const skipBlurCommitRef = useRef(false)

  useEffect(() => {
    setDraftTitle(sheetTitle)
  }, [sheetTitle])

  useEffect(() => {
    if (!editingTitle) return
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
      skipBlurCommitRef.current = false
    })
    return () => window.cancelAnimationFrame(frame)
  }, [editingTitle])

  const commitTitle = () => {
    const trimmed = draftTitle.trim()
    if (!isValidSheetTitle(trimmed)) {
      setDraftTitle(sheetTitle)
      setEditingTitle(false)
      return
    }
    if (trimmed !== sheetTitle) {
      onTitleChange?.(trimmed)
    }
    setEditingTitle(false)
  }

  const handleTitleBlur = () => {
    if (skipBlurCommitRef.current) return
    commitTitle()
  }

  const startEditingTitle = () => {
    if (!titleEditable || editingTitle) return
    skipBlurCommitRef.current = true
    setDraftTitle(sheetTitle)
    setEditingTitle(true)
  }

  return (
    <div className="px-page pb-2 pt-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {editingTitle ? (
            <div className="w-full border-b border-primary pb-0.5">
              <input
                ref={inputRef}
                type="text"
                maxLength={SHEET_TEXT_MAX_LENGTH}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    commitTitle()
                  }
                  if (e.key === 'Escape') {
                    setDraftTitle(sheetTitle)
                    setEditingTitle(false)
                  }
                }}
                className="block w-full min-w-0 border-0 bg-transparent p-0 text-xl font-normal text-on-surface-variant outline-none"
                aria-label="컬러워크 제목 편집"
              />
            </div>
          ) : titleEditable ? (
            <button
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              onClick={startEditingTitle}
              aria-label="제목 편집"
              className="inline-flex max-w-full min-w-0 items-center border-0 bg-transparent p-0 text-left text-xl font-bold"
            >
              <span className="min-w-0 truncate">{sheetTitle}</span>
              <span className="ml-1.5 shrink-0 text-outline">
                <PencilIcon />
              </span>
            </button>
          ) : (
            <h2 className="truncate text-xl font-bold">{sheetTitle}</h2>
          )}

          <WalkThemeDisplay
            themeLabel={themeLabel}
            themeColor={themeColor}
            editable={themeEditable}
            onEditClick={() => setThemeModalOpen(true)}
          />
        </div>
        <span className="shrink-0 rounded-full bg-surface-high px-3 py-1 text-sm font-medium">
          {filledCount}/{total}
        </span>
      </div>

      <ThemeEditModal
        open={themeModalOpen}
        themeLabel={themeLabel}
        themeColor={themeColor}
        onClose={() => setThemeModalOpen(false)}
        onSave={(patch) => onThemeChange?.(patch)}
      />
    </div>
  )
}
