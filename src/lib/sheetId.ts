export function createSheetId(): string {
  return `sheet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
