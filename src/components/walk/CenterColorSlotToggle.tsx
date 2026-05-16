interface CenterColorSlotToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function CenterColorSlotToggle({ enabled, onChange }: CenterColorSlotToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-page pb-2">
      <span className="text-sm text-on-surface-variant">중앙 컬러 칸</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="중앙 컬러 칸 사용"
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-[var(--theme-color,#a882e0)]' : 'bg-outline-variant/80'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
          aria-hidden
        />
      </button>
    </div>
  )
}
