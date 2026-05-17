import { useCallback, useEffect, useRef, useState } from 'react'
import { THEME_PRESETS, type ThemePreset } from '../data/themes'

const SPIN_INTERVAL_MS = 80
const SPIN_DURATION_MS = 1200

interface UseThemeRandomSpinOptions {
  onSelect: (preset: ThemePreset) => void
  onSpinningChange?: (spinning: boolean) => void
}

export function useThemeRandomSpin({ onSelect, onSpinningChange }: UseThemeRandomSpinOptions) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [preview, setPreview] = useState<ThemePreset | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    onSpinningChange?.(isSpinning)
  }, [isSpinning, onSpinningChange])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startSpin = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
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
        setIsSpinning(false)
      }
    }, SPIN_INTERVAL_MS)
  }, [isSpinning, onSelect])

  return { isSpinning, preview, startSpin }
}
