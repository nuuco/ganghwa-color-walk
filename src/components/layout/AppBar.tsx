import type { ReactNode } from 'react'

interface AppBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightSlot?: ReactNode
}

export function AppBar({ title, showBack = false, onBack, rightSlot }: AppBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-background/95 pl-2 pr-page backdrop-blur-sm">
      <div className="flex min-w-[44px] items-center">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-0.5 flex h-11 w-11 items-center justify-center rounded-full text-on-surface"
            aria-label="뒤로 가기"
          >
            ←
          </button>
        ) : (
          <span className="h-11 w-11" aria-hidden />
        )}
      </div>
      {title ? (
        <h1 className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate text-base font-semibold">
          {title}
        </h1>
      ) : null}
      <div className="flex min-w-[44px] justify-end">{rightSlot}</div>
    </header>
  )
}
