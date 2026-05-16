import { usePwaInstallContext } from '../../context/PwaInstallContext'

export function InstallAppButton() {
  const { openInstallPrompt } = usePwaInstallContext()

  return (
    <button
      type="button"
      onClick={openInstallPrompt}
      className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface px-3 text-xs font-medium text-on-surface"
      aria-label="앱 설치 안내 열기"
    >
      <span aria-hidden className="text-base leading-none">
        ⊕
      </span>
      설치
    </button>
  )
}
