import { SHEET_TEXT_MAX_LENGTH } from '../../config/textLimits'

interface SheetTitleInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  valid?: boolean
}

export function SheetTitleInput({ value, onChange, error, valid }: SheetTitleInputProps) {
  const borderClass = error
    ? 'border-red-500'
    : valid
      ? 'border-green-500'
      : 'border-outline-variant'

  return (
    <div className="px-page">
      <label htmlFor="sheet-title" className="mb-2 block text-sm font-medium">
        컬러워크 제목
      </label>
      <div className="relative">
        <input
          id="sheet-title"
          type="text"
          maxLength={SHEET_TEXT_MAX_LENGTH}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 갯벌 산책"
          className={`w-full rounded-xl border bg-surface px-4 py-3 pr-10 text-on-surface outline-none focus:ring-1 focus:ring-outline ${borderClass}`}
        />
        {valid ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" aria-hidden>
            ✓
          </span>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
      <p className="mt-1 text-xs text-on-surface-variant">
        {value.length}/{SHEET_TEXT_MAX_LENGTH}
      </p>
    </div>
  )
}
