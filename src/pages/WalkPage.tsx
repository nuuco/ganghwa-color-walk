import { useEffect, useState } from 'react'
import { AppBar } from '../components/layout/AppBar'
import { DynamicGrid } from '../components/grid/DynamicGrid'
import { WalkHeader } from '../components/walk/WalkHeader'
import { ThemeHintBar } from '../components/walk/ThemeHintBar'
import { WalkJournal } from '../components/walk/WalkJournal'
import { WalkProgressFooter } from '../components/walk/WalkProgressFooter'
import { useApp } from '../context/AppContext'
import { DEFAULT_CELL_COUNT } from '../config/grid'
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
  } = useApp()

  const sheet = getActiveSheet()
  const [noteStart, setNoteStart] = useState('')
  const [noteReflection, setNoteReflection] = useState('')

  useEffect(() => {
    if (sheet) {
      setNoteStart(sheet.noteStart)
      setNoteReflection(sheet.noteReflection)
      document.documentElement.style.setProperty('--theme-color', sheet.themeColor)
    }
  }, [sheet?.id, sheet?.noteStart, sheet?.noteReflection, sheet?.themeColor])

  const debouncedPersistNotes = useDebouncedCallback(
    (patch: { noteStart?: string; noteReflection?: string }) => {
      if (!sheet) return
      void updateSheet(sheet.id, patch)
    },
    300,
  )

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

  const handleCellClick = (index: number, filled: boolean) => {
    if (isImporting) return
    if (filled) {
      openCellDetail(index)
    } else {
      openCaptureSheet(index)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col" style={{ ['--theme-color' as string]: sheet.themeColor }}>
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
      <AppBar title="산책" showBack onBack={() => setStep('archive')} />
      <WalkHeader
        sheetTitle={sheet.sheetTitle}
        themeLabel={sheet.themeLabel}
        filledCount={sheet.filledCount}
        total={total}
      />
      <ThemeHintBar themeLabel={sheet.themeLabel} />
      <WalkJournal
        label="산책 시작"
        value={noteStart}
        placeholder="오늘 산책을 시작하며..."
        onChange={(v) => {
          setNoteStart(v)
          debouncedPersistNotes({ noteStart: v })
        }}
      />
      <DynamicGrid cells={sheet.cells} themeColor={sheet.themeColor} onCellClick={handleCellClick} />
      <WalkJournal
        label="돌아보며"
        value={noteReflection}
        placeholder="산책을 마치며..."
        onChange={(v) => {
          setNoteReflection(v)
          debouncedPersistNotes({ noteReflection: v })
        }}
      />
      <WalkProgressFooter
        filledCount={sheet.filledCount}
        total={total || DEFAULT_CELL_COUNT}
        themeColor={sheet.themeColor}
      />
    </div>
  )
}
