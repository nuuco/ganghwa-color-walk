import { CaptureSourceSheet } from './components/overlays/CaptureSourceSheet'
import { CellDetailModal } from './components/overlays/CellDetailModal'
import { ConfirmDeleteDialog } from './components/overlays/ConfirmDeleteDialog'
import { AppProvider, useApp } from './context/AppContext'
import { ArchivePage } from './pages/ArchivePage'
import { ThemePage } from './pages/ThemePage'
import { ViewPage } from './pages/ViewPage'
import { WalkPage } from './pages/WalkPage'

function AppShell() {
  const {
    step,
    captureSheetOpen,
    cellDetailOpen,
    confirmDeleteOpen,
    deleteTarget,
    getActiveSheet,
    activeCellIndex,
    closeCaptureSheet,
    closeCellDetail,
    closeConfirmDelete,
    confirmDelete,
    openCaptureSheet,
    openConfirmDelete,
  } = useApp()

  const sheet = getActiveSheet()
  const activeCell =
    sheet && activeCellIndex !== null ? sheet.cells[activeCellIndex] : undefined

  return (
    <div className="mx-auto min-h-dvh w-full max-w-app bg-background">
      {step === 'archive' && <ArchivePage />}
      {step === 'theme' && <ThemePage />}
      {step === 'walk' && <WalkPage />}
      {step === 'view' && <ViewPage />}

      <CaptureSourceSheet open={captureSheetOpen} onClose={closeCaptureSheet} />
      <CellDetailModal
        open={cellDetailOpen}
        imageUrl={activeCell?.imageUrl}
        onClose={closeCellDetail}
        onRetake={() => {
          closeCellDetail()
          if (activeCellIndex !== null) openCaptureSheet(activeCellIndex)
        }}
        onDelete={() => {
          if (sheet && activeCellIndex !== null) {
            openConfirmDelete({ type: 'cell', sheetId: sheet.id, cellIndex: activeCellIndex })
          }
          closeCellDetail()
        }}
      />
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        target={deleteTarget}
        onClose={closeConfirmDelete}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
