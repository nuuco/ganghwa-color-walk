interface CenterColorSlotChipProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function CenterColorSlotChip({ enabled, onChange }: CenterColorSlotChipProps) {
  return (
    <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-outline-variant/40 bg-surface py-1 pl-2.5 pr-1.5">
      <span className="text-xs font-medium text-on-surface">가운데 색</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="가운데 칸에 테마색 표시"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-on-surface' : 'bg-outline-variant/80'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-sm transition-[transform,background-color] duration-200 ${
            enabled ? 'translate-x-4 bg-background' : 'translate-x-0 bg-white'
          }`}
          aria-hidden
        />
      </button>
    </div>
  )
}
