import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  isStandaloneDisplay,
  resolveInstallScenario,
  type InstallScenario,
} from '../lib/pwaInstall'

const INSTALL_DISMISS_KEY = 'color-walk-install-banner-dismissed'
const AUTO_OPEN_DELAY_MS = 450

function isInstallDismissed(): boolean {
  try {
    return sessionStorage.getItem(INSTALL_DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export function usePwaInstall() {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)
  const [open, setOpen] = useState(false)
  const [canNativeInstall, setCanNativeInstall] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      deferredRef.current = event
      setCanNativeInstall(true)
    }

    const onAppInstalled = () => {
      deferredRef.current = null
      setCanNativeInstall(false)
      setOpen(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const scenario: InstallScenario = useMemo(
    () => resolveInstallScenario(canNativeInstall),
    [canNativeInstall],
  )

  const isStandalone = isStandaloneDisplay()

  const openInstallPrompt = useCallback(() => {
    setOpen(true)
  }, [])

  const closeInstallPrompt = useCallback(() => {
    setOpen(false)
  }, [])

  const dismissInstallPrompt = useCallback(() => {
    try {
      sessionStorage.setItem(INSTALL_DISMISS_KEY, '1')
    } catch {
      // sessionStorage unavailable
    }
    setOpen(false)
  }, [])

  const tryAutoOpenInstallPrompt = useCallback(() => {
    if (isStandaloneDisplay()) return
    if (isInstallDismissed()) return

    const timer = window.setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const runNativeInstall = useCallback(async (): Promise<boolean> => {
    const prompt = deferredRef.current
    if (!prompt) return false

    setIsInstalling(true)
    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        deferredRef.current = null
        setCanNativeInstall(false)
        setOpen(false)
        return true
      }
      return false
    } finally {
      setIsInstalling(false)
    }
  }, [])

  return {
    open,
    scenario,
    isStandalone,
    canNativeInstall,
    isInstalling,
    openInstallPrompt,
    closeInstallPrompt,
    dismissInstallPrompt,
    tryAutoOpenInstallPrompt,
    runNativeInstall,
  }
}

export type PwaInstallState = ReturnType<typeof usePwaInstall>
