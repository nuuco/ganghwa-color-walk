interface PencilIconProps {
  className?: string
  size?: number
}

export function PencilIcon({ className = '', size = 16 }: PencilIconProps) {
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
      className={['shrink-0', className].filter(Boolean).join(' ')}
    >
      <path d="M11.333 2.667 13.333 4.667 5.333 12.667H3.333V10.667L11.333 2.667Z" />
    </svg>
  )
}
