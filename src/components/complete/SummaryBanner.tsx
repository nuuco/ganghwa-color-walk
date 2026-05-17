interface SummaryBannerProps {
  celebrating?: boolean
}

export function SummaryBanner({ celebrating = false }: SummaryBannerProps) {
  return (
    <p
      className={`px-page text-center text-base font-medium leading-relaxed text-on-surface${
        celebrating ? ' animate-celebrate-pop' : ''
      }`}
    >
      오늘의 컬러워크를 완성했어요!
      <span
        className={`ml-1.5 inline-block${celebrating ? ' motion-safe:animate-bounce' : ''}`}
        aria-hidden
      >
        🎉
      </span>
    </p>
  )
}
