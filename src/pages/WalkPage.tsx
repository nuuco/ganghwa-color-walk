import { useEffect, useState } from 'react'
import { AppBar } from '../components/layout/AppBar'
import { DraggableWalkGrid } from '../components/grid/DraggableWalkGrid'
import { DEFAULT_CELL_COUNT, getEffectiveFilledCount, isCenterColorSlot } from '../config/grid'
import { WalkHeader } from '../components/walk/WalkHeader'
import { ThemeHintBar } from '../components/walk/ThemeHintBar'
import { WalkMemo } from '../components/walk/WalkMemo'
import { WalkProgressFooter } from '../components/walk/WalkProgressFooter'
import { useApp } from '../context/AppContext'
import { clampWalkMemo } from '../config/textLimits'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'

export function WalkPage() {
  const {
    getActiveSheet,
    setStep,
    updateSheet,
    openCaptureSheet,
    openCellDetail,
    isImporting,
    fileError,
    importNotice,
    clearFileError,
    clearImportNotice,
    setCenterColorSlot,
    swapCells,
    completeSheet,
  } = useApp()

  const sheet = getActiveSheet()
  const [memo, setMemo] = useState('')

  useEffect(() => {
    if (sheet) setMemo(clampWalkMemo(sheet.noteReflection))
  }, [sheet?.id, sheet?.noteReflection])

  const debouncedPersistMemo = useDebouncedCallback((noteReflection: string) => {
    if (!sheet) return
    void updateSheet(sheet.id, { noteReflection })
  }, 300)

  useEffect(() => {
    if (!fileError) return
    const timer = setTimeout(() => clearFileError(), 4000)
    return () => clearTimeout(timer)
  }, [fileError, clearFileError])

  useEffect(() => {
    if (!importNotice) return
    const timer = setTimeout(() => clearImportNotice(), 4000)
    return () => clearTimeout(timer)
  }, [importNotice, clearImportNotice])

  if (!sheet) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-page">
        <p className="text-on-surface-variant">시트를 찾을 수 없습니다.</p>
        <button type="button" onClick={() => setStep('archive')} className="ml-2 underline">
          목록으로
        </button>
      </div>
    )
  }


  const total = sheet.rows * sheet.cols
  const effectiveFilled = getEffectiveFilledCount(sheet)
  const canComplete =
    sheet.status !== 'completed' && effectiveFilled >= (total || DEFAULT_CELL_COUNT)

  const handleCellClick = (index: number, filled: boolean) => {
    if (isImporting) return
    if (isCenterColorSlot(sheet, index)) return
    if (filled) {
      openCellDetail(index)
    } else {
      openCaptureSheet(index)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {fileError ? (
        <div
          role="alert"
          className="fixed left-1/2 top-4 z-[60] w-[calc(100%-2.5rem)] max-w-app -translate-x-1/2 rounded-xl bg-red-600/95 px-4 py-3 text-center text-sm text-white shadow-lg"
        >
          {fileError}
        </div>
      ) : null}
      {importNotice ? (
        <div
          role="status"
          className="fixed left-1/2 z-[60] w-[calc(100%-2.5rem)] max-w-app -translate-x-1/2 rounded-xl bg-amber-600/95 px-4 py-3 text-center text-sm text-white shadow-lg"
          style={{ top: fileError ? '4.5rem' : '1rem' }}
        >
          {importNotice}
        </div>
      ) : null}
      <AppBar
        title="산책"
        showBack
        onBack={() => setStep(sheet.status === 'completed' ? 'view' : 'archive')}
      />
      <WalkHeader
        sheetTitle={sheet.sheetTitle}
        themeLabel={sheet.themeLabel}
        themeColor={sheet.themeColor}
        filledCount={effectiveFilled}
        total={total}
        titleEditable
        onTitleChange={(title) => void updateSheet(sheet.id, { sheetTitle: title })}
        themeEditable
        onThemeChange={({ themeLabel, themeColor }) =>
          void updateSheet(sheet.id, { themeLabel, themeColor, themeId: 'custom' })
        }
      />
      <ThemeHintBar
        themeLabel={sheet.themeLabel}
        themeColor={sheet.themeColor}
        centerColorSlot={sheet.centerColorSlot}
        onCenterColorSlotChange={(enabled) => void setCenterColorSlot(sheet.id, enabled)}
      />
      <DraggableWalkGrid
        sheet={sheet}
        reorderDisabled={isImporting}
        onCellClick={handleCellClick}
        onSwapCells={(from, to) => void swapCells(from, to)}
      />
      <WalkMemo
        value={memo}
        placeholder="오늘 산책의 이야기를 남겨보세요..."
        onChange={(v) => {
          const next = clampWalkMemo(v)
          setMemo(next)
          debouncedPersistMemo(next)
        }}
      />
      <WalkProgressFooter
        filledCount={effectiveFilled}
        total={total || DEFAULT_CELL_COUNT}
        themeColor={sheet.themeColor}
        canComplete={canComplete}
        onComplete={() => void completeSheet(sheet.id)}
        showCompleteCta={sheet.status === 'completed'}
        onViewComplete={() => setStep('view')}
      />
    </div>
  )
}
