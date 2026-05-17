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
    <div className="grid-cell-center grid aspect-square w-full grid-cols-1 grid-rows-1 overflow-hidden rounded-none bg-surface-high">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="col-start-1 row-start-1 h-full w-full min-h-0 min-w-0 object-cover"
          crossOrigin={imageCrossOrigin}
        />
      ) : showEmptyPlaceholder ? (
        <div
          className="col-start-1 row-start-1 h-full w-full min-h-0 min-w-0 border-2 border-dashed"
          style={{ borderColor: themeColor }}
        />
      ) : null}
      <ColorSlotCell themeColor={themeColor} overlay />
    </div>
  )
}
