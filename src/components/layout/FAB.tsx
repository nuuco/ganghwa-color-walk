interface FABProps {
  onClick: () => void
  label?: string
}

export function FAB({ onClick, label = '새 컬러워크' }: FABProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-30 w-full max-w-app -translate-x-1/2 px-page">
      <div className="pointer-events-auto flex justify-end">
        <button
          type="button"
          onClick={onClick}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-normal text-on-primary shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
          aria-label={label}
        >
          +
        </button>
      </div>
    </div>
  )
}
