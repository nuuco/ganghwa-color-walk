import confetti from 'canvas-confetti'

/** 테마색 없이 여러 색만 (주황은 앞에 두지 않음 — particleCount 1일 때 colors[0]만 쓰는 라이브러리 동작) */
const CELEBRATION_COLORS = [
  '#ff9ec8',
  '#7ec8ff',
  '#b5e878',
  '#ffe066',
  '#c4a8ff',
  '#ffab91',
  '#ffffff',
  '#f7941e',
]

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 완성 직후 축하 컨페티. `prefers-reduced-motion`이면 생략. 정리 함수 반환. */
export function fireCompletionCelebration(): () => void {
  if (prefersReducedMotion()) return () => {}

  let cancelled = false
  let rafId = 0
  let colorCursor = 0

  const shoot = (options: confetti.Options) => {
    if (cancelled) return
    void confetti({
      colors: CELEBRATION_COLORS,
      disableForReducedMotion: true,
      zIndex: 9999,
      ...options,
    })
  }

  /** particleCount 1이면 colors[0]만 쓰이므로 색을 돌려가며 소량 발사 */
  const shootTinted = (options: Omit<confetti.Options, 'colors'>) => {
    if (cancelled) return
    const color = CELEBRATION_COLORS[colorCursor % CELEBRATION_COLORS.length]
    colorCursor += 1
    void confetti({
      colors: [color],
      particleCount: 2,
      disableForReducedMotion: true,
      zIndex: 9999,
      ...options,
    })
  }

  shoot({
    particleCount: 40,
    spread: 72,
    startVelocity: 42,
    origin: { x: 0.5, y: 0.5 },
    scalar: 0.95,
  })

  window.setTimeout(() => {
    if (cancelled) return
    shoot({
      particleCount: 16,
      spread: 100,
      startVelocity: 28,
      origin: { x: 0.22, y: 0.58 },
      shapes: ['circle'],
    })
    shoot({
      particleCount: 16,
      spread: 100,
      startVelocity: 28,
      origin: { x: 0.78, y: 0.58 },
      shapes: ['square'],
    })
  }, 200)

  const end = Date.now() + 1400

  const frame = () => {
    if (cancelled || Date.now() >= end) return

    shootTinted({
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      startVelocity: 22,
    })
    shootTinted({
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      startVelocity: 22,
    })

    rafId = window.requestAnimationFrame(frame)
  }

  rafId = window.requestAnimationFrame(frame)

  return () => {
    cancelled = true
    window.cancelAnimationFrame(rafId)
  }
}
