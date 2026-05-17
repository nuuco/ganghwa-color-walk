import { CellDetailImageViewer } from './CellDetailImageViewer'

interface CellDetailModalProps {
  open: boolean
  imageUrl?: string
  onClose: () => void
  onRetake: () => void
  onDelete: () => void
}

export function CellDetailModal({
  open,
  imageUrl,
  onClose,
  onRetake,
  onDelete,
}: CellDetailModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex h-dvh max-h-dvh flex-col overflow-hidden bg-background"
      role="dialog"
      aria-modal="true"
    >
      <header className="flex h-14 shrink-0 items-center justify-between px-page">
        <button type="button" onClick={onClose} className="h-11 px-2" aria-label="닫기">
          ✕
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-page">
        {imageUrl ? (
          <CellDetailImageViewer imageUrl={imageUrl} />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <p className="text-on-surface-variant">이미지 없음</p>
          </div>
        )}
        {imageUrl ? (
          <p className="shrink-0 py-2 text-center text-xs text-on-surface-variant">
            두 손가락으로 확대할 수 있어요
          </p>
        ) : null}
      </div>

      <footer className="flex shrink-0 gap-3 border-t border-outline-variant/30 bg-background/95 px-page py-4 pb-[max(2rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
        <button
          type="button"
          onClick={onRetake}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-surface-high"
        >
          다시 찍기
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-12 flex-1 items-center justify-center rounded-xl border border-red-500/50 text-red-400"
        >
          삭제
        </button>
      </footer>
    </div>
  )
}
