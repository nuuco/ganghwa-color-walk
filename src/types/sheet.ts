export type AppStep = 'archive' | 'theme' | 'walk' | 'view'

export type SheetStatus = 'draft' | 'in_progress' | 'completed'

export interface SheetCell {
  index: number
  imageUrl?: string
}

export interface ColorWalkSheet {
  id: string
  sheetTitle: string
  themeId: string
  themeLabel: string
  themeColor: string
  status: SheetStatus
  cells: SheetCell[]
  filledCount: number
  rows: number
  cols: number
  noteStart: string
  noteReflection: string
  walkOrdinal?: number
  postcardHeadline: string
  completedAt?: string
  updatedAt: string
  createdAt: string
}

export interface ThemeDraft {
  sheetTitle: string
  themeId: string
  themeLabel: string
  themeColor: string
}

export type DeleteTarget =
  | { type: 'sheet'; sheetId: string }
  | { type: 'cell'; sheetId: string; cellIndex: number }
