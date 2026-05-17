import { useCallback, useEffect, useRef, useState } from 'react'
import { isStandaloneDisplay } from '../lib/pwaInstall'

const GUARD_STATE = { pwaExitGuard: true as const }

function hasExitGuard(state: unknown): boolean {
  return (
    typeof state === 'object' &&
    state !== null &&
    'pwaExitGuard' in state &&
    (state as { pwaExitGuard?: boolean }).pwaExitGuard === true
  )
}

interface UsePwaExitGuardOptions {
  enabled: boolean
}

export function usePwaExitGuard({ enabled }: UsePwaExitGuardOptions) {
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const allowExitRef = useRef(false)
  const guardActiveRef = useRef(false)

  const shouldGuard = enabled && isStandaloneDisplay()

  useEffect(() => {
    if (!shouldGuard) {
      setExitConfirmOpen(false)
      return
    }

    allowExitRef.current = false
    window.history.pushState(GUARD_STATE, '')
    guardActiveRef.current = true

    const onPopState = () => {
      if (allowExitRef.current) {
        guardActiveRef.current = false
        window.history.back()
        return
      }

      setExitConfirmOpen(true)
      window.history.pushState(GUARD_STATE, '')
      guardActiveRef.current = true
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      setExitConfirmOpen(false)
      allowExitRef.current = false
      if (guardActiveRef.current && hasExitGuard(window.history.state)) {
        guardActiveRef.current = false
        window.history.back()
      } else {
        guardActiveRef.current = false
      }
    }
  }, [shouldGuard])

  const confirmExit = useCallback(() => {
    allowExitRef.current = true
    setExitConfirmOpen(false)
    window.history.back()
  }, [])

  const cancelExit = useCallback(() => {
    setExitConfirmOpen(false)
  }, [])

  return { exitConfirmOpen, confirmExit, cancelExit }
}
