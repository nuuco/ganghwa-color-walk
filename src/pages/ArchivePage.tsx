import { useEffect } from 'react'
import { ArchiveViewToggle } from '../components/archive/ArchiveViewToggle'
import { EmptyArchive } from '../components/archive/EmptyArchive'
import { SheetList } from '../components/archive/SheetList'
import { FAB } from '../components/layout/FAB'
import { PageHeader } from '../components/layout/PageHeader'
import { InstallPromptBanner } from '../components/overlays/InstallPromptBanner'
import { useApp } from '../context/AppContext'
import { usePwaInstallContext } from '../context/PwaInstallContext'
import { useArchiveViewMode } from '../hooks/useArchiveViewMode'
import type { ColorWalkSheet } from '../types/sheet'

function ArchiveStickyHeader({
  showToggle,
  viewMode,
  onViewModeChange,
}: {
  showToggle: boolean
  viewMode: ReturnType<typeof useArchiveViewMode>['viewMode']
  onViewModeChange: ReturnType<typeof useArchiveViewMode>['setViewMode']
}) {
  return (
    <div className="sticky top-0 z-20 shrink-0 border-b border-outline-variant/20 bg-background/95 backdrop-blur-sm">
      <PageHeader
        title="나의 강화도 색 수집"
        action={
          showToggle ? (
            <ArchiveViewToggle value={viewMode} onChange={onViewModeChange} />
          ) : undefined
        }
      />
    </div>
  )
}

export function ArchivePage() {
  const { sheets, isHydrating, setStep, setActiveSheetId, resetThemeDraft, openConfirmDelete } =
    useApp()
  const { viewMode, setViewMode } = useArchiveViewMode()
  const {
    open: installOpen,
    scenario,
    isStandalone,
    canNativeInstall,
    isInstalling,
    dismissInstallPrompt,
    runNativeInstall,
    tryAutoOpenInstallPrompt,
  } = usePwaInstallContext()

  useEffect(() => {
    return tryAutoOpenInstallPrompt()
  }, [tryAutoOpenInstallPrompt])

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
  const showInstallBanner = installOpen && !isStandalone
  const showViewToggle = !isEmpty

  if (isHydrating) {
    return (
      <div className="flex min-h-dvh flex-col">
        {showInstallBanner ? (
          <InstallPromptBanner
            open={installOpen}
            scenario={scenario}
            canNativeInstall={canNativeInstall}
            isInstalling={isInstalling}
            onDismiss={dismissInstallPrompt}
            onNativeInstall={runNativeInstall}
          />
        ) : null}
        <ArchiveStickyHeader
          showToggle={false}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-on-surface-variant">불러오는 중…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {showInstallBanner ? (
        <InstallPromptBanner
          open={installOpen}
          scenario={scenario}
          canNativeInstall={canNativeInstall}
          isInstalling={isInstalling}
          onDismiss={dismissInstallPrompt}
          onNativeInstall={runNativeInstall}
        />
      ) : null}
      <ArchiveStickyHeader
        showToggle={showViewToggle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyArchive />
        ) : (
          <SheetList
            sheets={sheets}
            viewMode={viewMode}
            onOpenSheet={handleOpenSheet}
            onDeleteSheet={(id) => openConfirmDelete({ type: 'sheet', sheetId: id })}
          />
        )}
      </div>
      <FAB onClick={handleFab} />
    </div>
  )
}
