import { EmptyArchive } from '../components/archive/EmptyArchive'
import { SheetList } from '../components/archive/SheetList'
import { FAB } from '../components/layout/FAB'
import { PageHeader } from '../components/layout/PageHeader'
import { useApp } from '../context/AppContext'
import type { ColorWalkSheet } from '../types/sheet'

export function ArchivePage() {
  const { sheets, isHydrating, setStep, setActiveSheetId, resetThemeDraft, openConfirmDelete } =
    useApp()

  const handleFab = () => {
    resetThemeDraft()
    setActiveSheetId(null)
    setStep('theme')
  }

  const handleOpenSheet = (sheet: ColorWalkSheet) => {
    setActiveSheetId(sheet.id)
    if (sheet.status === 'completed') {
      setStep('view')
    } else {
      setStep('walk')
    }
  }

  const isEmpty = sheets.length === 0

  if (isHydrating) {
    return (
      <div className="flex min-h-dvh flex-col">
        <PageHeader title="나의 강화도 색 수집" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-on-surface-variant">불러오는 중…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="나의 강화도 색 수집" />
      {isEmpty ? (
        <EmptyArchive />
      ) : (
        <SheetList
          sheets={sheets}
          onOpenSheet={handleOpenSheet}
          onDeleteSheet={(id) => openConfirmDelete({ type: 'sheet', sheetId: id })}
        />
      )}
      <FAB onClick={handleFab} />
    </div>
  )
}

