interface WalkMemoProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function WalkMemo({ value, placeholder, onChange }: WalkMemoProps) {
  return (
    <div className="px-page py-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-3 py-2.5 text-sm outline-none focus:border-outline"
        aria-label="메모"
      />
    </div>
  )
}
