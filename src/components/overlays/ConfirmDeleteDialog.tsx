import type { DeleteTarget } from '../../types/sheet'

interface ConfirmDeleteDialogProps {
  open: boolean
  target: DeleteTarget | null
  onClose: () => void
  onConfirm: () => void
}

function getMessage(target: DeleteTarget | null): string {
  if (!target) return '삭제하시겠습니까?'
  if (target.type === 'sheet') return '이 컬러워크를 삭제할까요? 되돌릴 수 없습니다.'
  return '이 사진을 삭제할까요?'
}

export function ConfirmDeleteDialog({
  open,
  target,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-page">
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-surface-high p-6"
      >
        <p className="mb-6 text-center text-sm">{getMessage(target)}</p>
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
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
