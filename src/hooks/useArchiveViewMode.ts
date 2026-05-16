import { useCallback, useState } from 'react'

export type ArchiveViewMode = 'bento' | 'compact'

const STORAGE_KEY = 'color-walk-archive-view'

function readStoredMode(): ArchiveViewMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'bento' || raw === 'compact') return raw
  } catch {
    /* ignore */
  }
  return 'compact'
}

export function useArchiveViewMode() {
  const [viewMode, setViewModeState] = useState<ArchiveViewMode>(readStoredMode)

  const setViewMode = useCallback((mode: ArchiveViewMode) => {
    setViewModeState(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
  }, [])

  return { viewMode, setViewMode }
}
