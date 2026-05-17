import { useState } from 'react'
import { THEME_PRESETS, type ThemePreset } from '../../data/themes'
import { ChevronDownIcon } from '../ui/ChevronDownIcon'

interface ThemePresetPickerProps {
  selectedId: string
  onSelect: (preset: ThemePreset) => void
}

export function ThemePresetPicker({ selectedId, onSelect }: ThemePresetPickerProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mx-page mt-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium text-on-surface"
        aria-expanded={expanded}
      >
        <span>색 이름으로 골라보기</span>
        <ChevronDownIcon expanded={expanded} />
      </button>
      {expanded ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset)}
              className={`rounded-xl border p-3 text-left transition ${
                selectedId === preset.id
                  ? 'border-accent bg-accent/10 ring-1 ring-accent/50'
                  : 'border-outline-variant/40 bg-surface hover:border-accent/30'
              }`}
            >
              <span
                className="mb-2 block h-10 w-10 rounded-full"
                style={{ backgroundColor: preset.themeColor }}
                aria-hidden
              />
              <span className="block text-sm font-medium">{preset.themeLabel}</span>
              <span className="font-mono text-[10px] text-on-surface-variant">
                {preset.themeColor}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
