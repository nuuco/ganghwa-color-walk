import type { ReactNode } from 'react'

interface CompleteViewProps {
  children: ReactNode
}

export function CompleteView({ children }: CompleteViewProps) {
  return (
    <div className="flex flex-col gap-5 pb-10">{children}</div>
  )
}
