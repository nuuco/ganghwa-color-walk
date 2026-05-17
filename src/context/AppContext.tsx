import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_CELL_COUNT,
  DEFAULT_COLS,
  DEFAULT_ROWS,
  getFilledIndicesForTargeting,
  isCenterColorSlot,
} from '../config/grid'
import { isValidSheetTitle, isValidThemeLabel } from '../config/textLimits'
import { validateImageFile } from '../lib/imageValidation'
import { resolveCellTargets } from '../lib/resolveCellTargets'
import { createSheetId } from '../lib/sheetId'
import {
  clearCellFromStorage,
  createSheetMeta,
  deleteSheetFromStorage,
  hydrateSheet,
  loadAllSheets,
  persistSheetPatch,
  setCellsFromBlobs,
  completeSheetInStorage,
  moveOrSwapCells,
  setCenterColorSlotInStorage,
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
    centerColorSlot: meta.centerColorSlot ?? false,
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
  isImporting: boolean
  fileError: string | null
  importNotice: string | null
  themeDraft: ThemeDraft
  themeEditSheetId: string | null
  captureSheetOpen: boolean
  cellDetailOpen: boolean
  confirmDeleteOpen: boolean
  deleteTarget: DeleteTarget | null
  activeCellIndex: number | null
  setStep: (step: AppStep) => void
  setActiveSheetId: (id: string | null) => void
  setThemeDraft: (draft: Partial<ThemeDraft>) => void
  resetThemeDraft: () => void
  openThemeEdit: (sheetId: string) => void
  clearFileError: () => void
  clearImportNotice: () => void
  openCaptureSheet: (cellIndex?: number) => void
  closeCaptureSheet: () => void
  openCellDetail: (cellIndex: number) => void
  closeCellDetail: () => void
  openConfirmDelete: (target: DeleteTarget) => void
  closeConfirmDelete: () => void
  confirmDelete: () => Promise<void>
  submitThemeDraft: () => Promise<string | null>
  setCellsFromFiles: (files: File[]) => Promise<void>
  deleteSheet: (sheetId: string) => Promise<void>
  updateSheet: (sheetId: string, patch: Partial<ColorWalkSheet>) => Promise<void>
  setCenterColorSlot: (sheetId: string, enabled: boolean) => Promise<void>
  swapCells: (fromIndex: number, toIndex: number) => Promise<void>
  completeSheet: (sheetId: string) => Promise<boolean>
  getActiveSheet: () => ColorWalkSheet | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<AppStep>('archive')
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null)
  const [sheets, setSheets] = useState<ColorWalkSheet[]>([])
  const [isHydrating, setIsHydrating] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [importNotice, setImportNotice] = useState<string | null>(null)
  const [themeDraft, setThemeDraftState] = useState<ThemeDraft>(defaultThemeDraft)
  const [themeEditSheetId, setThemeEditSheetId] = useState<string | null>(null)
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
    setThemeEditSheetId(null)
  }, [])

  const openThemeEdit = useCallback(
    (sheetId: string) => {
      const sheet = sheets.find((s) => s.id === sheetId)
      if (!sheet) return
      setThemeDraftState({
        sheetTitle: sheet.sheetTitle,
        themeId: sheet.themeId,
        themeLabel: sheet.themeLabel,
        themeColor: sheet.themeColor,
      })
      setThemeEditSheetId(sheetId)
      setActiveSheetId(sheetId)
    },
    [sheets],
  )

  const clearFileError = useCallback(() => {
    setFileError(null)
  }, [])

  const clearImportNotice = useCallback(() => {
    setImportNotice(null)
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
    if (patch.centerColorSlot !== undefined) metaPatch.centerColorSlot = patch.centerColorSlot

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

  const submitThemeDraft = useCallback(async () => {
    const title = themeDraft.sheetTitle.trim()
    const label = themeDraft.themeLabel.trim()
    if (!isValidSheetTitle(title) || !isValidThemeLabel(label)) return null

    if (themeEditSheetId) {
      await updateSheet(themeEditSheetId, {
        sheetTitle: title,
        themeId: themeDraft.themeId,
        themeLabel: label,
        themeColor: themeDraft.themeColor,
        postcardHeadline: label,
      })
      setThemeEditSheetId(null)
      setStep('archive')
      return themeEditSheetId
    }

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
      centerColorSlot: false,
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
  }, [themeDraft, themeEditSheetId, updateSheet])

  const setCellsFromFiles = useCallback(
    async (files: File[]) => {
      if (activeSheetId === null || activeCellIndex === null || files.length === 0) return

      const sheet = sheets.find((s) => s.id === activeSheetId)
      if (!sheet) return

      const validFiles: File[] = []
      let invalidCount = 0
      for (const file of files) {
        const validation = validateImageFile(file)
        if (validation.ok) {
          validFiles.push(file)
        } else {
          invalidCount += 1
        }
      }

      if (validFiles.length === 0) {
        setImportNotice(null)
        setFileError(
          invalidCount === 1
            ? '이미지 파일만 선택할 수 있습니다. 8MB 이하인지 확인해 주세요.'
            : `${invalidCount}장은 형식 또는 용량(8MB 이하) 때문에 넣지 못했어요`,
        )
        return
      }

      const totalCells = sheet.rows * sheet.cols
      const targets = resolveCellTargets({
        totalCells,
        filledIndices: getFilledIndicesForTargeting(sheet),
        startIndex: activeCellIndex,
        fileCount: validFiles.length,
      })

      const assignCount = Math.min(validFiles.length, targets.length)
      const overflowCount = validFiles.length - assignCount

      const assignments = targets.slice(0, assignCount).map((cellIndex, i) => ({
        cellIndex,
        blob: validFiles[i].slice(0, validFiles[i].size, validFiles[i].type),
      }))

      setFileError(null)
      setImportNotice(null)
      setIsImporting(true)

      try {
        const { meta } = await setCellsFromBlobs(activeSheetId, assignments)
        const hydrated = await hydrateSheet(meta)
        setSheets((prev) => prev.map((s) => (s.id === activeSheetId ? hydrated : s)))

        if (invalidCount > 0) {
          setFileError(
            invalidCount === 1
              ? '1장은 형식 또는 용량(8MB 이하) 때문에 넣지 못했어요'
              : `${invalidCount}장은 형식 또는 용량(8MB 이하) 때문에 넣지 못했어요`,
          )
        }

        if (overflowCount > 0) {
          setImportNotice(
            overflowCount === 1
              ? '1장은 빈 칸이 없어 넣지 못했어요'
              : `${overflowCount}장은 빈 칸이 없어 넣지 못했어요`,
          )
        }

      } finally {
        setIsImporting(false)
      }
    },
    [activeCellIndex, activeSheetId, sheets],
  )

  const setCenterColorSlot = useCallback(async (sheetId: string, enabled: boolean) => {
    const meta = await setCenterColorSlotInStorage(sheetId, enabled)
    if (!meta) return

    const hydrated = await hydrateSheet(meta)
    setSheets((prev) => prev.map((s) => (s.id === sheetId ? hydrated : s)))
  }, [])

  const swapCells = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (activeSheetId === null || isImporting) return
      if (fromIndex === toIndex) return

      const sheet = sheets.find((s) => s.id === activeSheetId)
      if (!sheet) return
      if (isCenterColorSlot(sheet, fromIndex) || isCenterColorSlot(sheet, toIndex)) return

      setSheets((prev) =>
        prev.map((s) => {
          if (s.id !== activeSheetId) return s
          const cells = s.cells.map((cell) => ({ ...cell }))
          const fromUrl = cells[fromIndex].imageUrl
          const toUrl = cells[toIndex].imageUrl
          cells[fromIndex] = { ...cells[fromIndex], imageUrl: toUrl }
          cells[toIndex] = { ...cells[toIndex], imageUrl: fromUrl }
          return { ...s, cells }
        }),
      )

      const meta = await moveOrSwapCells(activeSheetId, fromIndex, toIndex)
      if (!meta) return

      setSheets((prev) =>
        prev.map((s) => (s.id === activeSheetId ? applyMetaToSheet(s, meta) : s)),
      )
    },
    [activeSheetId, isImporting, sheets],
  )

  const completeSheet = useCallback(async (sheetId: string) => {
    const meta = await completeSheetInStorage(sheetId)
    if (!meta) return false

    const hydrated = await hydrateSheet(meta)
    setSheets((prev) => prev.map((s) => (s.id === sheetId ? hydrated : s)))
    setActiveSheetId(sheetId)
    setStep('view')
    return true
  }, [])

  const openCaptureSheet = useCallback(
    (cellIndex?: number) => {
      if (cellIndex !== undefined) {
        const sheet = sheets.find((s) => s.id === activeSheetId)
        if (sheet && isCenterColorSlot(sheet, cellIndex)) return
        setActiveCellIndex(cellIndex)
      }
      setCaptureSheetOpen(true)
    },
    [activeSheetId, sheets],
  )

  const closeCaptureSheet = useCallback(() => {
    setCaptureSheetOpen(false)
  }, [])

  const openCellDetail = useCallback(
    (cellIndex: number) => {
      const sheet = sheets.find((s) => s.id === activeSheetId)
      if (sheet && isCenterColorSlot(sheet, cellIndex)) return
      setActiveCellIndex(cellIndex)
      setCellDetailOpen(true)
    },
    [activeSheetId, sheets],
  )

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
      const sheet = sheets.find((s) => s.id === deleteTarget.sheetId)
      if (sheet && isCenterColorSlot(sheet, deleteTarget.cellIndex)) {
        closeConfirmDelete()
        return
      }
      const meta = await clearCellFromStorage(deleteTarget.sheetId, deleteTarget.cellIndex)
      if (meta) {
        const hydrated = await hydrateSheet(meta)
        setSheets((prev) =>
          prev.map((s) => (s.id === deleteTarget.sheetId ? hydrated : s)),
        )
      }
    }

    closeConfirmDelete()
  }, [closeConfirmDelete, deleteSheet, deleteTarget, sheets])

  const value = useMemo<AppContextValue>(
    () => ({
      step,
      activeSheetId,
      sheets,
      isHydrating,
      isImporting,
      fileError,
      importNotice,
      themeDraft,
      themeEditSheetId,
      captureSheetOpen,
      cellDetailOpen,
      confirmDeleteOpen,
      deleteTarget,
      activeCellIndex,
      setStep,
      setActiveSheetId,
      setThemeDraft,
      resetThemeDraft,
      openThemeEdit,
      clearFileError,
      clearImportNotice,
      openCaptureSheet,
      closeCaptureSheet,
      openCellDetail,
      closeCellDetail,
      openConfirmDelete,
      closeConfirmDelete,
      confirmDelete,
      submitThemeDraft,
      setCellsFromFiles,
      deleteSheet,
      updateSheet,
      setCenterColorSlot,
      swapCells,
      completeSheet,
      getActiveSheet,
    }),
    [
      step,
      activeSheetId,
      sheets,
      isHydrating,
      isImporting,
      fileError,
      importNotice,
      themeDraft,
      themeEditSheetId,
      captureSheetOpen,
      cellDetailOpen,
      confirmDeleteOpen,
      deleteTarget,
      activeCellIndex,
      setThemeDraft,
      resetThemeDraft,
      openThemeEdit,
      clearFileError,
      clearImportNotice,
      openCaptureSheet,
      closeCaptureSheet,
      openCellDetail,
      closeCellDetail,
      openConfirmDelete,
      closeConfirmDelete,
      confirmDelete,
      submitThemeDraft,
      setCellsFromFiles,
      deleteSheet,
      updateSheet,
      setCenterColorSlot,
      swapCells,
      completeSheet,
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
