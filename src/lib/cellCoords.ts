export function indexToRowCol(index: number, cols: number): { row: number; col: number } {
  return { row: Math.floor(index / cols), col: index % cols }
}

export function rowColToIndex(row: number, col: number, cols: number): number {
  return row * cols + col
}

export function rowColKey(row: number, col: number): string {
  return `${row}-${col}`
}

export function parseRowColKey(key: string): { row: number; col: number } {
  const [row, col] = key.split('-').map(Number)
  return { row, col }
}

export function cellBlobKey(sheetId: string, row: number, col: number): string {
  return `cell-${sheetId}-${row}-${col}`
}

export function thumbBlobKey(sheetId: string): string {
  return `thumb-${sheetId}`
}
