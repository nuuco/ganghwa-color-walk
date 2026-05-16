import { useState } from 'react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  const [expanded, setExpanded] = useState(false)

  if (isOnline) return null

  return (
    <div
      className="sticky top-0 z-50 border-b border-outline-variant/40 bg-surface-high/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mx-auto flex w-full max-w-app items-start gap-2 px-page py-2.5 text-left"
        aria-expanded={expanded}
      >
        <span className="mt-0.5 text-primary" aria-hidden>
          ●
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium text-on-surface">
            인터넷 없이도 촬영·저장할 수 있어요
          </span>
          {expanded ? (
            <span className="text-xs text-on-surface-variant">공유는 연결 시</span>
          ) : null}
        </span>
        <span className="text-xs text-on-surface-variant" aria-hidden>
          {expanded ? '▲' : '▼'}
        </span>
      </button>
    </div>
  )
}
