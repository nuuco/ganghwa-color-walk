import confetti from 'canvas-confetti'

const ACCENT = '#f7941e'
const DEFAULT_THEME = '#a882e0'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function buildPalette(themeColor?: string): string[] {
  const theme = themeColor?.trim() || DEFAULT_THEME
  return [theme, ACCENT, '#ffffff', '#ff82b8', '#82e0ff', '#c8f06e']
}

/** 완성 직후 축하 컨페티. `prefers-reduced-motion`이면 생략. 정리 함수 반환. */
export function fireCompletionCelebration(themeColor?: string): () => void {
  if (prefersReducedMotion()) return () => {}

  const colors = buildPalette(themeColor)
  let rafId = 0
  let cancelled = false

  const shoot = (options: confetti.Options) => {
    if (cancelled) return
    void confetti({
      colors,
      disableForReducedMotion: true,
      zIndex: 9999,
      ...options,
    })
  }

  shoot({
    particleCount: 90,
    spread: 110,
    startVelocity: 48,
    origin: { x: 0.5, y: 0.52 },
    scalar: 1.05,
  })

  shoot({
    particleCount: 40,
    spread: 160,
    startVelocity: 32,
    origin: { x: 0.2, y: 0.62 },
    shapes: ['circle', 'square'],
  })

  shoot({
    particleCount: 40,
    spread: 160,
    startVelocity: 32,
    origin: { x: 0.8, y: 0.62 },
    shapes: ['circle', 'square'],
  })

  window.setTimeout(() => {
    if (cancelled) return
    shoot({
      particleCount: 55,
      spread: 90,
      startVelocity: 38,
      origin: { x: 0.5, y: 0.38 },
      shapes: ['star', 'circle'],
      scalar: 0.95,
    })
  }, 280)

  const end = Date.now() + 2800

  const frame = () => {
    if (cancelled || Date.now() >= end) return

    shoot({
      particleCount: 2,
      angle: 58,
      spread: 62,
      origin: { x: 0, y: 0.68 },
      startVelocity: 28,
    })
    shoot({
      particleCount: 2,
      angle: 122,
      spread: 62,
      origin: { x: 1, y: 0.68 },
      startVelocity: 28,
    })

    rafId = window.requestAnimationFrame(frame)
  }

  rafId = window.requestAnimationFrame(frame)

  return () => {
    cancelled = true
    window.cancelAnimationFrame(rafId)
    confetti.reset()
  }
}
