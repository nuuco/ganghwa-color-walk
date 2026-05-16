export function cellDndId(index: number): string {
  return `cell-${index}`
}

export function parseCellDndId(id: string | number): number | null {
  if (typeof id !== 'string' || !id.startsWith('cell-')) return null
  const index = Number.parseInt(id.slice(5), 10)
  return Number.isNaN(index) ? null : index
}
