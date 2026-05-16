import { PencilIcon } from '../ui/PencilIcon'

interface WalkThemeDisplayProps {
  themeLabel: string
  themeColor: string
  editable?: boolean
  onEditClick?: () => void
}

/** 산책 헤더 — 색 스와치 + 컬러명 한 줄 (제목과는 별도 줄) */
export function WalkThemeDisplay({
  themeLabel,
  themeColor,
  editable = false,
  onEditClick,
}: WalkThemeDisplayProps) {
  const swatch = (
    <span
      className="h-4 w-4 shrink-0 rounded-full border border-outline-variant/40"
      style={{ backgroundColor: themeColor }}
      aria-hidden
    />
  )

  if (!editable) {
    return (
      <span className="inline-flex max-w-full min-w-0 items-center gap-1.5 text-sm text-on-surface-variant">
        {swatch}
        <span className="truncate">{themeLabel}</span>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onEditClick}
      aria-label="색상·컬러명 편집"
      className="inline-flex max-w-full min-w-0 items-center gap-1.5 border-0 bg-transparent p-0 text-left text-sm text-on-surface-variant"
    >
      {swatch}
      <span className="min-w-0 truncate">{themeLabel}</span>
      <span className="shrink-0 text-outline">
        <PencilIcon size={14} />
      </span>
    </button>
  )
}
