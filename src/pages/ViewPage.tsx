import { useEffect, useState } from 'react'
import { AppBar } from '../components/layout/AppBar'
import { CompleteView } from '../components/complete/CompleteView'
import { PostcardPreview } from '../components/complete/PostcardPreview'
import { SummaryBanner } from '../components/complete/SummaryBanner'
import { ExportActions } from '../components/export/ExportActions'
import { useApp } from '../context/AppContext'

function isoToDateInput(iso?: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10)
  return iso.slice(0, 10)
}

function dateInputToIso(date: string): string {
  return new Date(`${date}T12:00:00`).toISOString()
}

export function ViewPage() {
  const { getActiveSheet, setStep, updateSheet, setActiveSheetId } = useApp()
  const sheet = getActiveSheet()
  const [headline, setHeadline] = useState(sheet?.postcardHeadline ?? '')

  useEffect(() => {
    if (sheet) {
      setHeadline(sheet.postcardHeadline)
      document.documentElement.style.setProperty('--theme-color', sheet.themeColor)
    }
  }, [sheet])

  if (!sheet) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <button type="button" onClick={() => setStep('archive')} className="underline">
          목록으로
        </button>
      </div>
    )
  }

  const dateValue = isoToDateInput(sheet.completedAt ?? sheet.updatedAt)

  return (
    <div className="flex min-h-dvh flex-col pb-8">
      <AppBar title="완성" showBack onBack={() => setStep('archive')} />
      <CompleteView>
        <SummaryBanner
          sheetTitle={sheet.sheetTitle}
          themeLabel={sheet.themeLabel}
          dateValue={dateValue}
          onDateChange={(d) => updateSheet(sheet.id, { completedAt: dateInputToIso(d) })}
        />
        <PostcardPreview
          sheet={sheet}
          headline={headline}
        />
        <div className="px-page">
          <label className="mb-1 block text-xs text-on-surface-variant">엽서 헤드라인</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value)
              updateSheet(sheet.id, { postcardHeadline: e.target.value })
            }}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3"
          />
        </div>
        <ExportActions
          onEdit={() => {
            setActiveSheetId(sheet.id)
            setStep('walk')
          }}
        />
      </CompleteView>
    </div>
  )
}
