import { useState } from 'react'
import { THEME_PRESETS, type ThemePreset } from '../../data/themes'

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
        className="flex w-full items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm font-medium"
        aria-expanded={expanded}
      >
        프리셋에서 고르기
        <span aria-hidden>{expanded ? '▲' : '▼'}</span>
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
                  ? 'border-on-surface bg-surface-high'
                  : 'border-outline-variant/40 bg-surface'
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
