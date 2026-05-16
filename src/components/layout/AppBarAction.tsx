import type { ReactNode } from 'react'

interface AppBarActionProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  'aria-label'?: string
}

/** 앱바 우측 보조 액션 — surface-high 칩 (진행 n/N·아카이브 토글과 톤 통일) */
export function AppBarAction({
  children,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
}: AppBarActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-flex h-9 items-center justify-center gap-1 rounded-full bg-surface-high px-3 text-sm font-medium text-on-surface transition-opacity disabled:opacity-50"
    >
      {children}
    </button>
  )
}
