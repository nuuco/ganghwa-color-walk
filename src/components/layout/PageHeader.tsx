interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="px-page pb-4 pt-2">
      <h2 className="text-2xl font-bold leading-tight tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
      ) : null}
    </div>
  )
}
