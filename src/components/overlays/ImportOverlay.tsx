interface ImportOverlayProps {
  open: boolean
}

export function ImportOverlay({ open }: ImportOverlayProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="사진 넣는 중"
    >
      <p className="rounded-xl bg-surface px-6 py-4 text-sm font-medium text-on-surface shadow-lg">
        사진 넣는 중…
      </p>
    </div>
  )
}
