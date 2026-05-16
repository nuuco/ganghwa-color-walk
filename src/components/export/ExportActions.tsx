export function ExportActions({ onEdit }: { onEdit: () => void }) {
  return (
    <section className="flex flex-col gap-3 px-page pb-8">
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-surface-high text-sm font-medium"
      >
        사진첩에 저장
      </button>
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-kakao text-sm font-semibold text-on-primary"
      >
        카카오톡으로 공유
      </button>
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center rounded-xl border border-outline-variant/50 text-sm font-medium"
      >
        이미지 공유
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="flex h-12 w-full items-center justify-center rounded-xl text-sm text-on-surface-variant underline"
      >
        수정
      </button>
    </section>
  )
}
