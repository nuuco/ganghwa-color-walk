import { useEffect, useState } from 'react'
import { fireCompletionCelebration } from '../lib/celebrationConfetti'

interface Options {
  sheetId: string
  themeColor?: string
  shouldCelebrate: boolean
  onCelebrated: (sheetId: string) => void
}

/** 완성 화면 진입 시 1회 축하 연출(컨페티·배너 애니메이션). */
export function useCompletionCelebration({
  sheetId,
  themeColor,
  shouldCelebrate,
  onCelebrated,
}: Options) {
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    if (!shouldCelebrate) return

    onCelebrated(sheetId)
    setCelebrating(true)
    const stopConfetti = fireCompletionCelebration(themeColor)

    const timer = window.setTimeout(() => setCelebrating(false), 900)

    return () => {
      stopConfetti()
      window.clearTimeout(timer)
    }
  }, [shouldCelebrate, themeColor, sheetId, onCelebrated])

  return { celebrating }
}
