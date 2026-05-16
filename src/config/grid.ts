import type { ColorWalkSheet } from '../types/sheet'

export const DEFAULT_ROWS = 3
export const DEFAULT_COLS = 3
export const DEFAULT_CELL_COUNT = DEFAULT_ROWS * DEFAULT_COLS

/** 3×3 기준 중앙 셀은 row=1, col=1 (0-indexed) */
export function getCenterCellIndex(rows: number, cols: number): number {
  const centerRow = Math.floor((rows - 1) / 2)
  const centerCol = Math.floor((cols - 1) / 2)
  return centerRow * cols + centerCol
}

export function isCenterColorSlot(
  sheet: Pick<ColorWalkSheet, 'centerColorSlot' | 'rows' | 'cols'>,
  index: number,
): boolean {
  return sheet.centerColorSlot && index === getCenterCellIndex(sheet.rows, sheet.cols)
}

export function computeEffectiveFilledCount(params: {
  filledCount: number
  centerColorSlot: boolean
  centerHasPhoto: boolean
}): number {
  const { filledCount, centerColorSlot, centerHasPhoto } = params
  if (!centerColorSlot) return filledCount
  return filledCount - (centerHasPhoto ? 1 : 0) + 1
}

export function getEffectiveFilledCount(
  sheet: Pick<ColorWalkSheet, 'filledCount' | 'centerColorSlot' | 'rows' | 'cols' | 'cells'>,
): number {
  const centerIndex = getCenterCellIndex(sheet.rows, sheet.cols)
  const centerHasPhoto = Boolean(sheet.cells[centerIndex]?.imageUrl)
  return computeEffectiveFilledCount({
    filledCount: sheet.filledCount,
    centerColorSlot: sheet.centerColorSlot,
    centerHasPhoto,
  })
}

/** 갤러리·빈 칸 탐색: 이미 채워진 칸(사진·컬러 슬롯) */
export function getFilledIndicesForTargeting(
  sheet: Pick<ColorWalkSheet, 'cells' | 'rows' | 'cols' | 'centerColorSlot'>,
): Set<number> {
  const filled = new Set<number>()
  for (const cell of sheet.cells) {
    if (cell.imageUrl) filled.add(cell.index)
  }
  if (sheet.centerColorSlot) {
    filled.add(getCenterCellIndex(sheet.rows, sheet.cols))
  }
  return filled
}

export function normalizeThemeHex(hex: string): string {
  return hex.trim().toUpperCase()
}
