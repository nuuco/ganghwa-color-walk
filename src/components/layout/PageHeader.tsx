import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="px-page py-3">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-tight tracking-tight">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  )
}
