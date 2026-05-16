import { useEffect } from 'react'
import { AppBar } from '../components/layout/AppBar'
import { DynamicGrid } from '../components/grid/DynamicGrid'
import { WalkHeader } from '../components/walk/WalkHeader'
import { ThemeHintBar } from '../components/walk/ThemeHintBar'
import { WalkJournal } from '../components/walk/WalkJournal'
import { WalkProgressFooter } from '../components/walk/WalkProgressFooter'
import { useApp } from '../context/AppContext'
import { DEFAULT_CELL_COUNT } from '../config/grid'

export function WalkPage() {
  const {
    getActiveSheet,
    setStep,
    updateSheet,
    openCaptureSheet,
    openCellDetail,
  } = useApp()

  const sheet = getActiveSheet()

  useEffect(() => {
    if (sheet) {
      document.documentElement.style.setProperty('--theme-color', sheet.themeColor)
    }
  }, [sheet])

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
    if (filled) {
      openCellDetail(index)
    } else {
      openCaptureSheet(index)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col" style={{ ['--theme-color' as string]: sheet.themeColor }}>
      <AppBar
        title="산책"
        showBack
        onBack={() => setStep('archive')}
      />
      <WalkHeader
        sheetTitle={sheet.sheetTitle}
        themeLabel={sheet.themeLabel}
        filledCount={sheet.filledCount}
        total={total}
      />
      <ThemeHintBar themeLabel={sheet.themeLabel} />
      <WalkJournal
        label="산책 시작"
        value={sheet.noteStart}
        placeholder="오늘 산책을 시작하며..."
        onChange={(v) => updateSheet(sheet.id, { noteStart: v })}
      />
      <DynamicGrid
        cells={sheet.cells}
        themeColor={sheet.themeColor}
        onCellClick={handleCellClick}
      />
      <WalkJournal
        label="돌아보며"
        value={sheet.noteReflection}
        placeholder="산책을 마치며..."
        onChange={(v) => updateSheet(sheet.id, { noteReflection: v })}
      />
      <WalkProgressFooter
        filledCount={sheet.filledCount}
        total={total || DEFAULT_CELL_COUNT}
        themeColor={sheet.themeColor}
      />
    </div>
  )
}
