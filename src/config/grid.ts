export const DEFAULT_ROWS = 3
export const DEFAULT_COLS = 3
export const DEFAULT_CELL_COUNT = DEFAULT_ROWS * DEFAULT_COLS

/** 3×3 기준 중앙 셀은 row=1, col=1 (0-indexed) */
export function getCenterCellIndex(rows: number, cols: number): number {
  const centerRow = Math.floor((rows - 1) / 2)
  const centerCol = Math.floor((cols - 1) / 2)
  return centerRow * cols + centerCol
}
