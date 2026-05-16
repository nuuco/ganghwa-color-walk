interface WalkJournalProps {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function WalkJournal({ label, value, placeholder, onChange }: WalkJournalProps) {
  return (
    <div className="px-page py-2">
      <label className="mb-1 block text-xs font-medium text-on-surface-variant">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-3 py-2 text-sm outline-none focus:border-outline"
      />
    </div>
  )
}
