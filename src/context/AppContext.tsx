import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_CELL_COUNT, DEFAULT_COLS, DEFAULT_ROWS } from '../config/grid'
import type { AppStep, ColorWalkSheet, DeleteTarget, SheetCell, ThemeDraft } from '../types/sheet'

function createEmptyCells(count = DEFAULT_CELL_COUNT): SheetCell[] {
  return Array.from({ length: count }, (_, index) => ({ index }))
}

function nowIso(): string {
  return new Date().toISOString()
}

function createMockSheets(): ColorWalkSheet[] {
  const draftCells = createEmptyCells()
  draftCells[0] = { index: 0, imageUrl: 'https://picsum.photos/seed/cw1/80' }
  draftCells[1] = { index: 1, imageUrl: 'https://picsum.photos/seed/cw2/80' }

  const completedCells = createEmptyCells()
  completedCells.forEach((cell, i) => {
    cell.imageUrl = `https://picsum.photos/seed/cw-done-${i}/80`
  })

  return [
    {
      id: 'sheet-draft-1',
      sheetTitle: '갯벌 산책 메모',
      themeId: 'tidal-flat-green',
      themeLabel: '갯벌 회록',
      themeColor: '#6B8F7A',
      status: 'in_progress',
      cells: draftCells,
      filledCount: 2,
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
      noteStart: '오늘은 바람이 선선했다.',
      noteReflection: '',
      postcardHeadline: '갯벌 회록',
      updatedAt: '2026-05-15T14:30:00.000Z',
      createdAt: '2026-05-14T10:00:00.000Z',
    },
    {
      id: 'sheet-done-1',
      sheetTitle: '순무 밭길',
      themeId: 'sunmu-purple',
      themeLabel: '순무 보라',
      themeColor: '#A882E0',
      status: 'completed',
      cells: completedCells,
      filledCount: 9,
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
      noteStart: '보라빛 잎이 반짝였다.',
      noteReflection: '다음에도 이 길로 오고 싶다.',
      walkOrdinal: 1,
      postcardHeadline: '순무 보라 산책',
      completedAt: '2026-05-10T18:00:00.000Z',
      updatedAt: '2026-05-10T18:00:00.000Z',
      createdAt: '2026-05-10T09:00:00.000Z',
    },
  ]
}

const defaultThemeDraft: ThemeDraft = {
  sheetTitle: '',
  themeId: 'custom',
  themeLabel: '',
  themeColor: '#A882E0',
}

interface AppContextValue {
  step: AppStep
  activeSheetId: string | null
  sheets: ColorWalkSheet[]
  themeDraft: ThemeDraft
  captureSheetOpen: boolean
  cellDetailOpen: boolean
  confirmDeleteOpen: boolean
  deleteTarget: DeleteTarget | null
  activeCellIndex: number | null
  setStep: (step: AppStep) => void
  setActiveSheetId: (id: string | null) => void
  setThemeDraft: (draft: Partial<ThemeDraft>) => void
  resetThemeDraft: () => void
  openCaptureSheet: (cellIndex?: number) => void
  closeCaptureSheet: () => void
  openCellDetail: (cellIndex: number) => void
  closeCellDetail: () => void
  openConfirmDelete: (target: DeleteTarget) => void
  closeConfirmDelete: () => void
  confirmDelete: () => void
  createSheetFromDraft: () => string | null
  deleteSheet: (sheetId: string) => void
  updateSheet: (sheetId: string, patch: Partial<ColorWalkSheet>) => void
  getActiveSheet: () => ColorWalkSheet | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<AppStep>('archive')
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null)
  const [sheets, setSheets] = useState<ColorWalkSheet[]>(createMockSheets)
  const [themeDraft, setThemeDraftState] = useState<ThemeDraft>(defaultThemeDraft)
  const [captureSheetOpen, setCaptureSheetOpen] = useState(false)
  const [cellDetailOpen, setCellDetailOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [activeCellIndex, setActiveCellIndex] = useState<number | null>(null)

  const setThemeDraft = useCallback((draft: Partial<ThemeDraft>) => {
    setThemeDraftState((prev) => ({ ...prev, ...draft }))
  }, [])

  const resetThemeDraft = useCallback(() => {
    setThemeDraftState(defaultThemeDraft)
  }, [])

  const getActiveSheet = useCallback(() => {
    if (!activeSheetId) return undefined
    return sheets.find((s) => s.id === activeSheetId)
  }, [activeSheetId, sheets])

  const updateSheet = useCallback((sheetId: string, patch: Partial<ColorWalkSheet>) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === sheetId
          ? { ...sheet, ...patch, updatedAt: nowIso() }
          : sheet,
      ),
    )
  }, [])

  const deleteSheet = useCallback((sheetId: string) => {
    setSheets((prev) => prev.filter((s) => s.id !== sheetId))
    setActiveSheetId((current) => (current === sheetId ? null : current))
  }, [])

  const createSheetFromDraft = useCallback(() => {
    const title = themeDraft.sheetTitle.trim()
    const label = themeDraft.themeLabel.trim()
    if (title.length < 1 || title.length > 20 || !label) return null

    const id = `sheet-${Date.now()}`
    const newSheet: ColorWalkSheet = {
      id,
      sheetTitle: title,
      themeId: themeDraft.themeId,
      themeLabel: label,
      themeColor: themeDraft.themeColor,
      status: 'draft',
      cells: createEmptyCells(),
      filledCount: 0,
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
      noteStart: '',
      noteReflection: '',
      postcardHeadline: label,
      updatedAt: nowIso(),
      createdAt: nowIso(),
    }
    setSheets((prev) => [newSheet, ...prev])
    setActiveSheetId(id)
    setStep('walk')
    return id
  }, [themeDraft])

  const openCaptureSheet = useCallback((cellIndex?: number) => {
    if (cellIndex !== undefined) setActiveCellIndex(cellIndex)
    setCaptureSheetOpen(true)
  }, [])

  const closeCaptureSheet = useCallback(() => {
    setCaptureSheetOpen(false)
  }, [])

  const openCellDetail = useCallback((cellIndex: number) => {
    setActiveCellIndex(cellIndex)
    setCellDetailOpen(true)
  }, [])

  const closeCellDetail = useCallback(() => {
    setCellDetailOpen(false)
  }, [])

  const openConfirmDelete = useCallback((target: DeleteTarget) => {
    setDeleteTarget(target)
    setConfirmDeleteOpen(true)
  }, [])

  const closeConfirmDelete = useCallback(() => {
    setConfirmDeleteOpen(false)
    setDeleteTarget(null)
  }, [])

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'sheet') {
      deleteSheet(deleteTarget.sheetId)
      setStep('archive')
    }
    closeConfirmDelete()
  }, [closeConfirmDelete, deleteSheet, deleteTarget])

  const value = useMemo<AppContextValue>(
    () => ({
      step,
      activeSheetId,
      sheets,
      themeDraft,
      captureSheetOpen,
      cellDetailOpen,
      confirmDeleteOpen,
      deleteTarget,
      activeCellIndex,
      setStep,
      setActiveSheetId,
      setThemeDraft,
      resetThemeDraft,
      openCaptureSheet,
      closeCaptureSheet,
      openCellDetail,
      closeCellDetail,
      openConfirmDelete,
      closeConfirmDelete,
      confirmDelete,
      createSheetFromDraft,
      deleteSheet,
      updateSheet,
      getActiveSheet,
    }),
    [
      step,
      activeSheetId,
      sheets,
      themeDraft,
      captureSheetOpen,
      cellDetailOpen,
      confirmDeleteOpen,
      deleteTarget,
      activeCellIndex,
      setThemeDraft,
      resetThemeDraft,
      openCaptureSheet,
      closeCaptureSheet,
      openCellDetail,
      closeCellDetail,
      openConfirmDelete,
      closeConfirmDelete,
      confirmDelete,
      createSheetFromDraft,
      deleteSheet,
      updateSheet,
      getActiveSheet,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
