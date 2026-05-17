interface ChevronDownIconProps {
  className?: string
  size?: number
  expanded?: boolean
}

export function ChevronDownIcon({
  className = '',
  size = 16,
  expanded = false,
}: ChevronDownIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={[
        'shrink-0 text-on-surface-variant transition-transform duration-200',
        expanded ? 'rotate-180' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <path d="M4 6 8 10 12 6" />
    </svg>
  )
}
