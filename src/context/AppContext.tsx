import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_CELL_COUNT, DEFAULT_COLS, DEFAULT_ROWS } from '../config/grid'
import { validateImageFile } from '../lib/imageValidation'
import { createSheetId } from '../lib/sheetId'
import {
  clearCellFromStorage,
  createSheetMeta,
  deleteSheetFromStorage,
  hydrateSheet,
  loadAllSheets,
  persistSheetPatch,
  setCellFromBlob,
} from '../lib/storage'
import type {
  AppStep,
  ColorWalkSheet,
  DeleteTarget,
  SheetCell,
  StoredSheetMeta,
  ThemeDraft,
} from '../types/sheet'

function createEmptyCells(count = DEFAULT_CELL_COUNT): SheetCell[] {
  return Array.from({ length: count }, (_, index) => ({ index }))
}

const defaultThemeDraft: ThemeDraft = {
  sheetTitle: '',
  themeId: 'custom',
  themeLabel: '',
  themeColor: '#A882E0',
}

function applyMetaToSheet(sheet: ColorWalkSheet, meta: StoredSheetMeta): ColorWalkSheet {
  return {
    ...sheet,
    sheetTitle: meta.sheetTitle,
    themeId: meta.themeId,
    themeLabel: meta.themeLabel,
    themeColor: meta.themeColor,
    status: meta.status,
    filledCount: meta.filledCount,
    noteStart: meta.noteStart ?? '',
    noteReflection: meta.noteReflection ?? '',
    walkOrdinal: meta.walkOrdinal,
    postcardHeadline: meta.postcardHeadline ?? meta.themeLabel,
    completedAt: meta.completedAt,
    updatedAt: meta.updatedAt,
    createdAt: meta.createdAt,
  }
}

interface AppContextValue {
  step: AppStep
  activeSheetId: string | null
  sheets: ColorWalkSheet[]
  isHydrating: boolean
  fileError: string | null
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
  clearFileError: () => void
  openCaptureSheet: (cellIndex?: number) => void
  closeCaptureSheet: () => void
  openCellDetail: (cellIndex: number) => void
  closeCellDetail: () => void
  openConfirmDelete: (target: DeleteTarget) => void
  closeConfirmDelete: () => void
  confirmDelete: () => Promise<void>
  createSheetFromDraft: () => Promise<string | null>
  setCellFromFile: (file: File) => Promise<void>
  deleteSheet: (sheetId: string) => Promise<void>
  updateSheet: (sheetId: string, patch: Partial<ColorWalkSheet>) => Promise<void>
  getActiveSheet: () => ColorWalkSheet | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<AppStep>('archive')
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null)
  const [sheets, setSheets] = useState<ColorWalkSheet[]>([])
  const [isHydrating, setIsHydrating] = useState(true)
  const [fileError, setFileError] = useState<string | null>(null)
  const [themeDraft, setThemeDraftState] = useState<ThemeDraft>(defaultThemeDraft)
  const [captureSheetOpen, setCaptureSheetOpen] = useState(false)
  const [cellDetailOpen, setCellDetailOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [activeCellIndex, setActiveCellIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const loaded = await loadAllSheets()
        if (!cancelled) setSheets(loaded)
      } finally {
        if (!cancelled) setIsHydrating(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const setThemeDraft = useCallback((draft: Partial<ThemeDraft>) => {
    setThemeDraftState((prev) => ({ ...prev, ...draft }))
  }, [])

  const resetThemeDraft = useCallback(() => {
    setThemeDraftState(defaultThemeDraft)
  }, [])

  const clearFileError = useCallback(() => {
    setFileError(null)
  }, [])

  const getActiveSheet = useCallback(() => {
    if (!activeSheetId) return undefined
    return sheets.find((s) => s.id === activeSheetId)
  }, [activeSheetId, sheets])

  const updateSheet = useCallback(async (sheetId: string, patch: Partial<ColorWalkSheet>) => {
    const metaPatch: Partial<StoredSheetMeta> = {}
    if (patch.sheetTitle !== undefined) metaPatch.sheetTitle = patch.sheetTitle
    if (patch.themeId !== undefined) metaPatch.themeId = patch.themeId
    if (patch.themeLabel !== undefined) metaPatch.themeLabel = patch.themeLabel
    if (patch.themeColor !== undefined) metaPatch.themeColor = patch.themeColor
    if (patch.noteStart !== undefined) metaPatch.noteStart = patch.noteStart
    if (patch.noteReflection !== undefined) metaPatch.noteReflection = patch.noteReflection
    if (patch.postcardHeadline !== undefined) metaPatch.postcardHeadline = patch.postcardHeadline
    if (patch.status !== undefined) metaPatch.status = patch.status
    if (patch.filledCount !== undefined) metaPatch.filledCount = patch.filledCount
    if (patch.walkOrdinal !== undefined) metaPatch.walkOrdinal = patch.walkOrdinal
    if (patch.completedAt !== undefined) metaPatch.completedAt = patch.completedAt

    const meta = await persistSheetPatch(sheetId, metaPatch)
    if (!meta) return

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === sheetId ? applyMetaToSheet(sheet, meta) : sheet,
      ),
    )
  }, [])

  const deleteSheet = useCallback(async (sheetId: string) => {
    await deleteSheetFromStorage(sheetId)
    setSheets((prev) => prev.filter((s) => s.id !== sheetId))
    setActiveSheetId((current) => (current === sheetId ? null : current))
  }, [])

  const createSheetFromDraft = useCallback(async () => {
    const title = themeDraft.sheetTitle.trim()
    const label = themeDraft.themeLabel.trim()
    if (title.length < 1 || title.length > 20 || !label) return null

    const id = createSheetId()
    const meta = await createSheetMeta({
      id,
      sheetTitle: title,
      themeId: themeDraft.themeId,
      themeLabel: label,
      themeColor: themeDraft.themeColor,
      postcardHeadline: label,
    })

    const newSheet: ColorWalkSheet = {
      id: meta.id,
      sheetTitle: meta.sheetTitle,
      themeId: meta.themeId,
      themeLabel: meta.themeLabel,
      themeColor: meta.themeColor,
      status: meta.status,
      cells: createEmptyCells(),
      filledCount: 0,
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
      noteStart: '',
      noteReflection: '',
      postcardHeadline: meta.postcardHeadline ?? label,
      updatedAt: meta.updatedAt,
      createdAt: meta.createdAt,
    }

    setSheets((prev) => [newSheet, ...prev])
    setActiveSheetId(id)
    setStep('walk')
    return id
  }, [themeDraft])

  const setCellFromFile = useCallback(
    async (file: File) => {
      if (activeSheetId === null || activeCellIndex === null) return

      const validation = validateImageFile(file)
      if (!validation.ok) {
        setFileError(validation.message)
        return
      }

      setFileError(null)
      const blob = file.slice(0, file.size, file.type)
      const { meta, completed } = await setCellFromBlob(activeSheetId, activeCellIndex, blob)
      const hydrated = await hydrateSheet(meta)

      setSheets((prev) => prev.map((s) => (s.id === activeSheetId ? hydrated : s)))

      if (completed) {
        setStep('view')
      }
    },
    [activeCellIndex, activeSheetId],
  )

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

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return

    if (deleteTarget.type === 'sheet') {
      await deleteSheet(deleteTarget.sheetId)
      setStep('archive')
    } else {
      const meta = await clearCellFromStorage(deleteTarget.sheetId, deleteTarget.cellIndex)
      if (meta) {
        const hydrated = await hydrateSheet(meta)
        setSheets((prev) =>
          prev.map((s) => (s.id === deleteTarget.sheetId ? hydrated : s)),
        )
      }
    }

    closeConfirmDelete()
  }, [closeConfirmDelete, deleteSheet, deleteTarget])

  const value = useMemo<AppContextValue>(
    () => ({
      step,
      activeSheetId,
      sheets,
      isHydrating,
      fileError,
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
      clearFileError,
      openCaptureSheet,
      closeCaptureSheet,
      openCellDetail,
      closeCellDetail,
      openConfirmDelete,
      closeConfirmDelete,
      confirmDelete,
      createSheetFromDraft,
      setCellFromFile,
      deleteSheet,
      updateSheet,
      getActiveSheet,
    }),
    [
      step,
      activeSheetId,
      sheets,
      isHydrating,
      fileError,
      themeDraft,
      captureSheetOpen,
      cellDetailOpen,
      confirmDeleteOpen,
      deleteTarget,
      activeCellIndex,
      setThemeDraft,
      resetThemeDraft,
      clearFileError,
      openCaptureSheet,
      closeCaptureSheet,
      openCellDetail,
      closeCellDetail,
      openConfirmDelete,
      closeConfirmDelete,
      confirmDelete,
      createSheetFromDraft,
      setCellFromFile,
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
