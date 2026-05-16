import { useEffect, useRef, useState } from 'react'
import { THEME_PRESETS, type ThemePreset } from '../../data/themes'

interface ColorRandomButtonProps {
  onSelect: (preset: ThemePreset) => void
  onSpinningChange?: (spinning: boolean) => void
}

const SPIN_INTERVAL_MS = 80
const SPIN_DURATION_MS = 1200

export function ColorRandomButton({ onSelect, onSpinningChange }: ColorRandomButtonProps) {
  const [spinning, setSpinning] = useState(false)
  const [preview, setPreview] = useState<ThemePreset | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    onSpinningChange?.(spinning)
  }, [onSpinningChange, spinning])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleRandom = () => {
    if (spinning) return
    setSpinning(true)
    let ticks = 0
    const maxTicks = Math.floor(SPIN_DURATION_MS / SPIN_INTERVAL_MS)

    timerRef.current = setInterval(() => {
      const preset = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)]
      setPreview(preset)
      ticks += 1
      if (ticks >= maxTicks) {
        if (timerRef.current) clearInterval(timerRef.current)
        const finalPreset = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)]
        setPreview(finalPreset)
        onSelect(finalPreset)
        setSpinning(false)
      }
    }, SPIN_INTERVAL_MS)
  }

  return (
    <section className="mx-page mt-4 rounded-2xl bg-surface-high p-5">
      <button
        type="button"
        onClick={handleRandom}
        disabled={spinning}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-outline-variant/50 bg-surface px-4 py-4 disabled:opacity-60"
      >
        <span className="text-sm font-medium">랜덤 선택</span>
        {preview ? (
          <span className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: preview.themeColor }}
              aria-hidden
            />
            {preview.themeLabel}
          </span>
        ) : (
          <span className="text-xs text-on-surface-variant">탭하여 색 뽑기</span>
        )}
      </button>
    </section>
  )
}
