import { SHEET_TEXT_MAX_LENGTH } from '../../config/textLimits'

interface CustomColorPickerProps {
  themeColor: string
  themeLabel: string
  onColorChange: (color: string) => void
  onLabelChange: (label: string) => void
  labelError?: string
  labelValid?: boolean
  /** 모달 등 내부 임베드 시 바깥 여백·섹션 타이틀 생략 */
  embedded?: boolean
}

export function CustomColorPicker({
  themeColor,
  themeLabel,
  onColorChange,
  onLabelChange,
  labelError,
  labelValid,
  embedded = false,
}: CustomColorPickerProps) {
  const borderClass = labelError
    ? 'border-red-500'
    : labelValid
      ? 'border-green-500'
      : 'border-outline-variant'

  return (
    <section
      className={
        embedded ? 'rounded-2xl bg-surface-high p-4' : 'mx-page rounded-2xl bg-surface-high p-5'
      }
    >
      {embedded ? null : (
        <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">직접 선택</h3>
      )}
      <div className="flex flex-col items-center gap-4">
        <label className="relative block h-28 w-28 cursor-pointer overflow-hidden rounded-full border-2 border-outline-variant/50">
          <span
            className="absolute inset-0"
            style={{ backgroundColor: themeColor }}
            aria-hidden
          />
          <input
            type="color"
            value={themeColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="색상 선택"
          />
        </label>
        <p className="font-mono text-xs text-on-surface-variant">{themeColor.toUpperCase()}</p>
        <div className="w-full">
          <label htmlFor="theme-label" className="mb-2 block text-sm">
            컬러명
          </label>
          <div className="relative">
            <input
              id="theme-label"
              type="text"
              maxLength={SHEET_TEXT_MAX_LENGTH}
              value={themeLabel}
              onChange={(e) => onLabelChange(e.target.value)}
              placeholder="예: 순무 보라"
              className={`w-full rounded-xl border bg-surface px-4 py-3 pr-10 outline-none focus:ring-1 focus:ring-outline ${borderClass}`}
            />
            {labelValid ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" aria-hidden>
                ✓
              </span>
            ) : null}
          </div>
          {labelError ? <p className="mt-1 text-xs text-red-400">{labelError}</p> : null}
          <p className="mt-1 text-xs text-on-surface-variant">
            {themeLabel.length}/{SHEET_TEXT_MAX_LENGTH}
          </p>
        </div>
      </div>
    </section>
  )
}
