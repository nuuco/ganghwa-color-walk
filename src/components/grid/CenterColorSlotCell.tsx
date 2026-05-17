import { ColorSlotCell } from './ColorSlotCell'

interface CenterColorSlotCellProps {
  themeColor: string
  imageUrl?: string
  showEmptyPlaceholder?: boolean
  imageCrossOrigin?: 'anonymous'
}

/** 컬러 레이어는 위에, 아래 사진(blob)은 토글 OFF 시 다시 보임 */
export function CenterColorSlotCell({
  themeColor,
  imageUrl,
  showEmptyPlaceholder = false,
  imageCrossOrigin,
}: CenterColorSlotCellProps) {
  return (
    <div className="grid-cell-center relative aspect-square w-full overflow-hidden rounded-cell bg-surface-high">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          crossOrigin={imageCrossOrigin}
        />
      ) : showEmptyPlaceholder ? (
        <div
          className="h-full w-full border-2 border-dashed"
          style={{ borderColor: themeColor }}
        />
      ) : null}
      <ColorSlotCell themeColor={themeColor} overlay />
    </div>
  )
}
