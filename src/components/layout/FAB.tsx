interface FABProps {
  onClick: () => void
  label?: string
}

export function FAB({ onClick, label = '새 컬러워크' }: FABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-light text-on-primary shadow-lg"
      aria-label={label}
    >
      +
    </button>
  )
}
