import type { ArchiveViewMode } from '../../hooks/useArchiveViewMode'

interface ArchiveViewToggleProps {
  value: ArchiveViewMode
  onChange: (mode: ArchiveViewMode) => void
}

function BentoIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden
      className={active ? 'opacity-100' : 'opacity-55'}
    >
      <rect x="1" y="1" width="4.5" height="4.5" rx="0.75" />
      <rect x="6.75" y="1" width="4.5" height="4.5" rx="0.75" />
      <rect x="12.5" y="1" width="4.5" height="4.5" rx="0.75" />
      <rect x="1" y="6.75" width="4.5" height="4.5" rx="0.75" />
      <rect x="6.75" y="6.75" width="4.5" height="4.5" rx="0.75" />
      <rect x="12.5" y="6.75" width="4.5" height="4.5" rx="0.75" />
      <rect x="1" y="12.5" width="4.5" height="4.5" rx="0.75" />
      <rect x="6.75" y="12.5" width="4.5" height="4.5" rx="0.75" />
      <rect x="12.5" y="12.5" width="4.5" height="4.5" rx="0.75" />
    </svg>
  )
}

function CompactIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className={active ? 'opacity-100' : 'opacity-55'}
    >
      <rect x="2" y="3" width="14" height="5" rx="1" />
      <line x1="4" y1="11.5" x2="10" y2="11.5" />
      <line x1="4" y1="14" x2="8" y2="14" />
    </svg>
  )
}

export function ArchiveViewToggle({ value, onChange }: ArchiveViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="목록 보기 방식"
      className="flex shrink-0 rounded-xl bg-surface-high p-0.5"
    >
      <button
        type="button"
        onClick={() => onChange('compact')}
        aria-pressed={value === 'compact'}
        aria-label="간략 보기"
        className={[
          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
          value === 'compact'
            ? 'bg-background text-on-surface shadow-sm'
            : 'text-on-surface-variant',
        ].join(' ')}
      >
        <CompactIcon active={value === 'compact'} />
      </button>
      <button
        type="button"
        onClick={() => onChange('bento')}
        aria-pressed={value === 'bento'}
        aria-label="벤토 보기"
        className={[
          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
          value === 'bento'
            ? 'bg-background text-on-surface shadow-sm'
            : 'text-on-surface-variant',
        ].join(' ')}
      >
        <BentoIcon active={value === 'bento'} />
      </button>
    </div>
  )
}
