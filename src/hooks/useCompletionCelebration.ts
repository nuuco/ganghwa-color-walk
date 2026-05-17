import { useEffect, useState } from 'react'
import { fireCompletionCelebration } from '../lib/celebrationConfetti'

interface Options {
  sheetId: string
  shouldCelebrate: boolean
  onCelebrated: () => void
}

/** 완성 화면 진입 시 1회 축하 연출(컨페티·배너 애니메이션). */
export function useCompletionCelebration({
  sheetId,
  shouldCelebrate,
  onCelebrated,
}: Options) {
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    if (!shouldCelebrate) return

    setCelebrating(true)
    const stopSpawning = fireCompletionCelebration()

    const markTimer = window.setTimeout(() => {
      onCelebrated()
    }, 100)

    const bannerTimer = window.setTimeout(() => setCelebrating(false), 900)

    return () => {
      window.clearTimeout(markTimer)
      window.clearTimeout(bannerTimer)
      stopSpawning()
    }
  }, [shouldCelebrate, sheetId, onCelebrated])

  return { celebrating }
}
