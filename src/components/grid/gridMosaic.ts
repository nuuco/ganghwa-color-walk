import { DEFAULT_COLS } from '../../config/grid'

/** 3×3 모자이크 그리드 — gap·가운데 셀 겹침은 `.grid-mosaic` (index.css) */
export const gridMosaicClassName = 'grid-mosaic grid w-full rounded-none'

export const gridMosaicColumnsStyle = {
  gridTemplateColumns: `repeat(${DEFAULT_COLS}, minmax(0, 1fr))`,
} as const
