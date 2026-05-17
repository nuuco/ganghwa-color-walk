interface ExitConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ExitConfirmDialog({ open, onClose, onConfirm }: ExitConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-page">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="exit-confirm-title"
        className="w-full max-w-sm rounded-2xl bg-surface-high p-6"
      >
        <p id="exit-confirm-title" className="mb-6 text-center text-sm">
          앱을 종료할까요?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-surface"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-red-600 text-white"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  )
}
