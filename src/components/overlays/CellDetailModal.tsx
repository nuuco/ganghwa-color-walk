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
    <div className="fixed inset-0 z-50 flex flex-col bg-background" role="dialog" aria-modal="true">
      <header className="flex h-14 items-center justify-between px-page">
        <button type="button" onClick={onClose} className="h-11 px-2" aria-label="닫기">
          ✕
        </button>
      </header>
      <div className="flex flex-1 items-center justify-center p-page">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <p className="text-on-surface-variant">이미지 없음</p>
        )}
      </div>
      <footer className="flex gap-3 px-page pb-8">
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
