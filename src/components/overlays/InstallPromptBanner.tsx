import { useEffect, useState } from 'react'
import { getInstallBody, getInstallSteps, getInstallTitle } from '../../lib/installPromptCopy'
import type { InstallScenario } from '../../lib/pwaInstall'

interface InstallPromptBannerProps {
  open: boolean
  scenario: InstallScenario
  canNativeInstall: boolean
  isInstalling: boolean
  onDismiss: () => void
  onNativeInstall: () => boolean | Promise<boolean>
}

export function InstallPromptBanner({
  open,
  scenario,
  canNativeInstall,
  isInstalling,
  onDismiss,
  onNativeInstall,
}: InstallPromptBannerProps) {
  const [copied, setCopied] = useState(false)
  const [entered, setEntered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!open) {
      setEntered(false)
      setCopied(false)
      setExpanded(false)
      return
    }

    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [open])

  if (!open) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const usesNativeInstall =
    scenario === 'android-installable' || (scenario === 'android-manual' && canNativeInstall)

  const steps = getInstallSteps(scenario)
  const showSteps = expanded && steps !== null

  const handleInstall = async () => {
    if (usesNativeInstall || scenario === 'android-manual') {
      const installed = await onNativeInstall()
      if (installed) return
      if (scenario === 'android-manual' || scenario === 'android-installable') {
        setExpanded(true)
        return
      }
    }

    if (scenario === 'kakao') {
      await handleCopyLink()
      return
    }

    setExpanded(true)
  }

  const installLabel = (() => {
    if (isInstalling) return '설치 중…'
    if (scenario === 'kakao' && copied) return '복사됨'
    return '설치'
  })()

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-page pt-[max(0.5rem,env(safe-area-inset-top))]"
      role="region"
      aria-live="polite"
      aria-label="앱 설치 안내"
    >
      <div
        className={`pointer-events-auto w-full max-w-app transform transition-transform duration-300 ease-out ${
          entered ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div
          role="dialog"
          aria-labelledby="install-prompt-title"
          className="rounded-2xl border border-outline-variant/50 bg-surface-high p-4 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg text-primary" aria-hidden>
              ⊕
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="install-prompt-title" className="text-sm font-semibold text-on-surface">
                {getInstallTitle(scenario)}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                {getInstallBody(scenario)}
              </p>

              {showSteps ? (
                <ol className="mt-2 list-decimal space-y-0.5 pl-4 text-xs text-on-surface-variant">
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant"
              aria-label="설치 안내 닫기"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-medium text-on-primary disabled:opacity-60"
            >
              {installLabel}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-xl bg-surface text-sm text-on-surface"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
