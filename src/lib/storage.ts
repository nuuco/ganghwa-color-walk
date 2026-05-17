import localforage from 'localforage'
import {
  computeEffectiveFilledCount,
  DEFAULT_CELL_COUNT,
  DEFAULT_COLS,
  DEFAULT_ROWS,
  getCenterCellIndex,
} from '../config/grid'
import type { ColorWalkSheet, SheetCell, SheetsIndex, StoredSheetMeta } from '../types/sheet'
import { getOrCreateObjectUrl, revokeObjectUrl, swapObjectUrlKeys } from './blobUrls'
import {
  cellBlobKey,
  indexToRowCol,
  parseRowColKey,
  rowColKey,
  rowColToIndex,
} from './cellCoords'

const INDEX_KEY = 'color-walk-sheets-index-v1'

function sheetMetaKey(sheetId: string): string {
  return `sheet-${sheetId}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function createEmptyCells(count = DEFAULT_CELL_COUNT): SheetCell[] {
  return Array.from({ length: count }, (_, index) => ({ index }))
}

function centerHasPhotoInCells(
  meta: Pick<StoredSheetMeta, 'rows' | 'cols'>,
  cells: Record<string, { blobKey: string }>,
): boolean {
  const centerIndex = getCenterCellIndex(meta.rows, meta.cols)
  const { row, col } = indexToRowCol(centerIndex, meta.cols)
  return Boolean(cells[rowColKey(row, col)])
}

export function didBecomeCompleted(
  before: Pick<StoredSheetMeta, 'status'>,
  after: Pick<StoredSheetMeta, 'status'>,
): boolean {
  return before.status !== 'completed' && after.status === 'completed'
}

async function applyCompletionFields(
  meta: StoredSheetMeta,
  cells: Record<string, { blobKey: string }>,
  centerColorSlot: boolean,
): Promise<{
  status: StoredSheetMeta['status']
  walkOrdinal?: number
  completedAt?: string
}> {
  const required = meta.rows * meta.cols
  const filledCount = Object.keys(cells).length
  const effective = computeEffectiveFilledCount({
    filledCount,
    centerColorSlot,
    centerHasPhoto: centerHasPhotoInCells(meta, cells),
  })
  let status = meta.status
  let walkOrdinal = meta.walkOrdinal
  let completedAt = meta.completedAt

  if (status === 'completed' && effective < required) {
    status = 'in_progress'
  }

  return { status, walkOrdinal, completedAt }
}

export async function completeSheetInStorage(
  sheetId: string,
): Promise<StoredSheetMeta | null> {
  const meta = await getSheetMeta(sheetId)
  if (!meta || meta.status === 'completed') return meta

  const required = meta.rows * meta.cols
  const filledCount = Object.keys(meta.cells).length
  const effective = computeEffectiveFilledCount({
    filledCount,
    centerColorSlot: meta.centerColorSlot ?? false,
    centerHasPhoto: centerHasPhotoInCells(meta, meta.cells),
  })
  if (effective < required) return null

  const next: StoredSheetMeta = {
    ...meta,
    status: 'completed',
    walkOrdinal: meta.walkOrdinal ?? (await countCompletedSheets()) + 1,
    completedAt: meta.completedAt ?? nowIso(),
    updatedAt: nowIso(),
  }
  await saveSheetMeta(next)
  const index = await getIndex()
  await saveIndex(await sortIndexByUpdatedAt(index))
  return next
}

export async function getIndex(): Promise<SheetsIndex> {
  const index = await localforage.getItem<SheetsIndex>(INDEX_KEY)
  return index ?? { version: 1, sheetIds: [] }
}

async function saveIndex(index: SheetsIndex): Promise<void> {
  await localforage.setItem(INDEX_KEY, index)
}

export async function getSheetMeta(sheetId: string): Promise<StoredSheetMeta | null> {
  return localforage.getItem<StoredSheetMeta>(sheetMetaKey(sheetId))
}

export async function saveSheetMeta(meta: StoredSheetMeta): Promise<void> {
  await localforage.setItem(sheetMetaKey(meta.id), meta)
}

export async function getCellBlob(sheetId: string, row: number, col: number): Promise<Blob | null> {
  return localforage.getItem<Blob>(cellBlobKey(sheetId, row, col))
}

export async function saveCellBlob(
  sheetId: string,
  row: number,
  col: number,
  blob: Blob,
): Promise<void> {
  await localforage.setItem(cellBlobKey(sheetId, row, col), blob)
}

export async function removeCellBlob(sheetId: string, row: number, col: number): Promise<void> {
  await localforage.removeItem(cellBlobKey(sheetId, row, col))
}

async function sortIndexByUpdatedAt(index: SheetsIndex): Promise<SheetsIndex> {
  const metas: StoredSheetMeta[] = []
  for (const id of index.sheetIds) {
    const meta = await getSheetMeta(id)
    if (meta) metas.push(meta)
  }
  metas.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  return { version: 1, sheetIds: metas.map((m) => m.id) }
}

export async function countCompletedSheets(): Promise<number> {
  const index = await getIndex()
  let count = 0
  for (const id of index.sheetIds) {
    const meta = await getSheetMeta(id)
    if (meta?.status === 'completed') count += 1
  }
  return count
}

export async function hydrateSheet(meta: StoredSheetMeta): Promise<ColorWalkSheet> {
  const cells = createEmptyCells(meta.rows * meta.cols)
  for (const [rc, ref] of Object.entries(meta.cells)) {
    const { row, col } = parseRowColKey(rc)
    const blob = await localforage.getItem<Blob>(ref.blobKey)
    if (!blob) continue
    const index = rowColToIndex(row, col, meta.cols)
    cells[index] = {
      index,
      imageUrl: getOrCreateObjectUrl(blob, ref.blobKey),
    }
  }

  return {
    id: meta.id,
    sheetTitle: meta.sheetTitle,
    themeId: meta.themeId,
    themeLabel: meta.themeLabel,
    themeColor: meta.themeColor,
    status: meta.status,
    cells,
    filledCount: meta.filledCount,
    centerColorSlot: meta.centerColorSlot ?? false,
    rows: meta.rows,
    cols: meta.cols,
    noteStart: meta.noteStart ?? '',
    noteReflection: meta.noteReflection ?? '',
    walkOrdinal: meta.walkOrdinal,
    postcardHeadline: meta.postcardHeadline ?? meta.themeLabel,
    completedAt: meta.completedAt,
    updatedAt: meta.updatedAt,
    createdAt: meta.createdAt,
  }
}

export async function loadAllSheets(): Promise<ColorWalkSheet[]> {
  const index = await sortIndexByUpdatedAt(await getIndex())
  const sheets: ColorWalkSheet[] = []
  for (const id of index.sheetIds) {
    const meta = await getSheetMeta(id)
    if (meta) sheets.push(await hydrateSheet(meta))
  }
  return sheets
}

export async function createSheetMeta(
  input: Pick<
    StoredSheetMeta,
    'id' | 'sheetTitle' | 'themeId' | 'themeLabel' | 'themeColor' | 'postcardHeadline'
  >,
): Promise<StoredSheetMeta> {
  const ts = nowIso()
  const meta: StoredSheetMeta = {
    version: 1,
    id: input.id,
    sheetTitle: input.sheetTitle,
    themeId: input.themeId,
    themeLabel: input.themeLabel,
    themeColor: input.themeColor,
    postcardHeadline: input.postcardHeadline,
    rows: DEFAULT_ROWS,
    cols: DEFAULT_COLS,
    status: 'in_progress',
    filledCount: 0,
    centerColorSlot: false,
    cells: {},
    createdAt: ts,
    updatedAt: ts,
  }

  await saveSheetMeta(meta)
  const index = await getIndex()
  const sheetIds = [meta.id, ...index.sheetIds.filter((id) => id !== meta.id)]
  await saveIndex(await sortIndexByUpdatedAt({ version: 1, sheetIds }))
  return meta
}

export async function deleteSheetFromStorage(sheetId: string): Promise<void> {
  const meta = await getSheetMeta(sheetId)
  if (meta) {
    for (const ref of Object.values(meta.cells)) {
      revokeObjectUrl(ref.blobKey)
      await localforage.removeItem(ref.blobKey)
    }
  }
  await localforage.removeItem(sheetMetaKey(sheetId))
  const index = await getIndex()
  await saveIndex({
    version: 1,
    sheetIds: index.sheetIds.filter((id) => id !== sheetId),
  })
}

export async function persistSheetPatch(
  sheetId: string,
  patch: Partial<StoredSheetMeta>,
): Promise<StoredSheetMeta | null> {
  const meta = await getSheetMeta(sheetId)
  if (!meta) return null
  const next: StoredSheetMeta = { ...meta, ...patch, updatedAt: nowIso() }
  await saveSheetMeta(next)
  const index = await getIndex()
  if (index.sheetIds.includes(sheetId)) {
    await saveIndex(await sortIndexByUpdatedAt(index))
  }
  return next
}

export async function setCellsFromBlobs(
  sheetId: string,
  assignments: { cellIndex: number; blob: Blob }[],
): Promise<{ meta: StoredSheetMeta; completed: boolean }> {
  const meta = await getSheetMeta(sheetId)
  if (!meta) throw new Error('Sheet not found')

  if (assignments.length === 0) {
    return { meta, completed: false }
  }

  let cells = { ...meta.cells }

  const centerIndex = getCenterCellIndex(meta.rows, meta.cols)

  for (const { cellIndex, blob } of assignments) {
    if (meta.centerColorSlot && cellIndex === centerIndex) continue

    const { row, col } = indexToRowCol(cellIndex, meta.cols)
    const rc = rowColKey(row, col)
    const blobKey = cellBlobKey(sheetId, row, col)

    if (cells[rc]) {
      revokeObjectUrl(blobKey)
    }

    await saveCellBlob(sheetId, row, col, blob)
    cells = { ...cells, [rc]: { blobKey } }
  }

  const filledCount = Object.keys(cells).length
  const { status, walkOrdinal, completedAt } = await applyCompletionFields(
    meta,
    cells,
    meta.centerColorSlot ?? false,
  )

  const next: StoredSheetMeta = {
    ...meta,
    cells,
    filledCount,
    status,
    walkOrdinal,
    completedAt,
    updatedAt: nowIso(),
  }
  await saveSheetMeta(next)
  const index = await getIndex()
  await saveIndex(await sortIndexByUpdatedAt(index))

  return { meta: next, completed: didBecomeCompleted(meta, next) }
}

export async function setCellFromBlob(
  sheetId: string,
  cellIndex: number,
  blob: Blob,
): Promise<{ meta: StoredSheetMeta; completed: boolean }> {
  return setCellsFromBlobs(sheetId, [{ cellIndex, blob }])
}

export async function clearCellFromStorage(
  sheetId: string,
  cellIndex: number,
): Promise<StoredSheetMeta | null> {
  const meta = await getSheetMeta(sheetId)
  if (!meta) return null

  const { row, col } = indexToRowCol(cellIndex, meta.cols)
  const rc = rowColKey(row, col)
  const ref = meta.cells[rc]
  if (!ref) return meta

  revokeObjectUrl(ref.blobKey)
  await removeCellBlob(sheetId, row, col)

  const cells = { ...meta.cells }
  delete cells[rc]
  const filledCount = Object.keys(cells).length
  const { status } = await applyCompletionFields(meta, cells, meta.centerColorSlot ?? false)

  const next: StoredSheetMeta = {
    ...meta,
    cells,
    filledCount,
    status,
    updatedAt: nowIso(),
  }
  await saveSheetMeta(next)
  const index = await getIndex()
  await saveIndex(await sortIndexByUpdatedAt(index))
  return next
}

export async function moveOrSwapCells(
  sheetId: string,
  fromIndex: number,
  toIndex: number,
): Promise<StoredSheetMeta | null> {
  if (fromIndex === toIndex) {
    return getSheetMeta(sheetId)
  }

  const meta = await getSheetMeta(sheetId)
  if (!meta) return null

  const centerIndex = getCenterCellIndex(meta.rows, meta.cols)
  if (meta.centerColorSlot && (fromIndex === centerIndex || toIndex === centerIndex)) {
    return meta
  }

  const fromPos = indexToRowCol(fromIndex, meta.cols)
  const toPos = indexToRowCol(toIndex, meta.cols)
  const fromRc = rowColKey(fromPos.row, fromPos.col)
  const toRc = rowColKey(toPos.row, toPos.col)

  const fromRef = meta.cells[fromRc]
  if (!fromRef) return meta

  const fromBlob = await getCellBlob(sheetId, fromPos.row, fromPos.col)
  if (!fromBlob) return meta

  const fromBlobKey = cellBlobKey(sheetId, fromPos.row, fromPos.col)
  const toBlobKey = cellBlobKey(sheetId, toPos.row, toPos.col)

  const toRef = meta.cells[toRc]
  let cells = { ...meta.cells }

  if (toRef) {
    const toBlob = await getCellBlob(sheetId, toPos.row, toPos.col)
    if (!toBlob) return meta

    await saveCellBlob(sheetId, fromPos.row, fromPos.col, toBlob)
    await saveCellBlob(sheetId, toPos.row, toPos.col, fromBlob)
    cells[fromRc] = { blobKey: fromBlobKey }
    cells[toRc] = { blobKey: toBlobKey }
    swapObjectUrlKeys(fromBlobKey, toBlobKey)
  } else {
    await saveCellBlob(sheetId, toPos.row, toPos.col, fromBlob)
    await removeCellBlob(sheetId, fromPos.row, fromPos.col)
    delete cells[fromRc]
    cells[toRc] = { blobKey: toBlobKey }
    swapObjectUrlKeys(fromBlobKey, toBlobKey)
  }

  const filledCount = Object.keys(cells).length
  const { status, walkOrdinal, completedAt } = await applyCompletionFields(
    meta,
    cells,
    meta.centerColorSlot ?? false,
  )

  const next: StoredSheetMeta = {
    ...meta,
    cells,
    filledCount,
    status,
    walkOrdinal,
    completedAt,
    updatedAt: nowIso(),
  }
  await saveSheetMeta(next)
  const index = await getIndex()
  await saveIndex(await sortIndexByUpdatedAt(index))
  return next
}

export async function setCenterColorSlotInStorage(
  sheetId: string,
  enabled: boolean,
): Promise<StoredSheetMeta | null> {
  const meta = await getSheetMeta(sheetId)
  if (!meta) return null

  const cells = { ...meta.cells }
  const filledCount = Object.keys(cells).length
  const { status, walkOrdinal, completedAt } = await applyCompletionFields(meta, cells, enabled)

  const next: StoredSheetMeta = {
    ...meta,
    centerColorSlot: enabled,
    cells,
    filledCount,
    status,
    walkOrdinal,
    completedAt,
    updatedAt: nowIso(),
  }
  await saveSheetMeta(next)
  const index = await getIndex()
  await saveIndex(await sortIndexByUpdatedAt(index))
  return next
}

