interface GridCellProps {
  index: number
  imageUrl?: string
  themeColor: string
  filled?: boolean
  onClick: () => void
}

export function GridCell({ index, imageUrl, themeColor, filled, onClick }: GridCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative aspect-square w-full overflow-hidden rounded-cell bg-surface-high"
      aria-label={filled ? `칸 ${index + 1} 사진 보기` : `칸 ${index + 1} 사진 추가`}
    >
      {imageUrl ? (
        <>
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          {filled ? (
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/90 text-[10px] text-white">
              ✓
            </span>
          ) : null}
        </>
      ) : (
        <div
          className="h-full w-full border-2 border-dashed"
          style={{ borderColor: themeColor }}
        />
      )}
    </button>
  )
}
