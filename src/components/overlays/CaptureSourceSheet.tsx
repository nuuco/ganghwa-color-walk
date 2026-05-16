import { useRef, type ChangeEvent } from 'react'

interface CaptureSourceSheetProps {
  open: boolean
  onClose: () => void
  onPick: (files: File[]) => void
}

export function CaptureSourceSheet({ open, onClose, onPick }: CaptureSourceSheetProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length > 0) onPick(files)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60"
      role="presentation"
    >
      <button type="button" className="flex-1" onClick={onClose} aria-label="닫기" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="사진 소스 선택"
        className="rounded-t-3xl border border-outline-variant/30 bg-surface px-page pb-8 pt-3"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-outline-variant" aria-hidden />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <ul className="flex flex-col gap-2">
          <li>
            <button
              type="button"
              className="flex h-12 w-full items-center rounded-xl px-4 text-left hover:bg-surface-high"
              onClick={() => cameraInputRef.current?.click()}
            >
              카메라로 촬영
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex h-12 w-full flex-col items-start justify-center rounded-xl px-4 text-left hover:bg-surface-high"
              onClick={() => galleryInputRef.current?.click()}
            >
              <span>갤러리에서 선택</span>
              <span className="text-xs text-on-surface-variant">여러 장 선택 가능</span>
            </button>
          </li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl text-on-surface-variant"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
