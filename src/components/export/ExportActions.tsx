import { primaryButtonClassName } from '../ui/primaryButton'

interface ExportActionsProps {
  onSave: () => void
  onKakaoShare: () => void
  onImageShare: () => void
  busy?: boolean
  kakaoDisabled?: boolean
  statusMessage?: string
}

export function ExportActions({
  onSave,
  onKakaoShare,
  onImageShare,
  busy = false,
  kakaoDisabled = false,
  statusMessage,
}: ExportActionsProps) {
  const disabled = busy

  return (
    <section className="flex flex-col gap-3 px-page pb-8">
      {statusMessage ? (
        <p className="text-center text-xs text-on-surface-variant" role="status">
          {statusMessage}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className={`flex h-12 w-full items-center justify-center rounded-xl text-sm ${primaryButtonClassName} disabled:opacity-50`}
      >
        사진첩에 저장
      </button>
      <button
        type="button"
        onClick={onKakaoShare}
        disabled={disabled || kakaoDisabled}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#FEE500] text-sm font-semibold text-black disabled:opacity-50"
      >
        카카오톡으로 공유
      </button>
      <button
        type="button"
        onClick={onImageShare}
        disabled={disabled}
        className="flex h-12 w-full items-center justify-center rounded-xl border border-outline-variant/50 text-sm font-medium disabled:opacity-50"
      >
        이미지 공유
      </button>
    </section>
  )
}
