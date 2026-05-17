import { useId } from 'react'
import { clampWalkMemo, WALK_MEMO_MAX_LENGTH } from '../../config/textLimits'

interface WalkMemoProps {
  value: string
  placeholder: string
  label?: string
  onChange: (value: string) => void
}

export function WalkMemo({
  value,
  placeholder,
  label = '산책 노트',
  onChange,
}: WalkMemoProps) {
  const textareaId = useId()

  return (
    <div className="px-page pb-2 pt-3">
      <label
        htmlFor={textareaId}
        className="mb-2 block text-xs font-medium tracking-wide text-on-surface-variant/90"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        value={value}
        maxLength={WALK_MEMO_MAX_LENGTH}
        onChange={(e) => onChange(clampWalkMemo(e.target.value))}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-3 py-2.5 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-outline-variant"
      />
      <p className="mt-1 text-right text-xs text-on-surface-variant" aria-live="polite">
        {value.length}/{WALK_MEMO_MAX_LENGTH}
      </p>
    </div>
  )
}
