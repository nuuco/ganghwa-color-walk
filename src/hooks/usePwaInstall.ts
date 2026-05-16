import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  isStandaloneDisplay,
  resolveInstallScenario,
  type InstallScenario,
} from '../lib/pwaInstall'

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

  const runNativeInstall = useCallback(async () => {
    const prompt = deferredRef.current
    if (!prompt) return

    setIsInstalling(true)
    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        deferredRef.current = null
        setCanNativeInstall(false)
        setOpen(false)
      }
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
    runNativeInstall,
  }
}

export type PwaInstallState = ReturnType<typeof usePwaInstall>
