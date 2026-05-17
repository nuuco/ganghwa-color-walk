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
      <div className="flex flex-col items-center gap-5">
        <label className="group relative block h-[7.5rem] w-[7.5rem] cursor-pointer">
          <span
            className="pointer-events-none absolute -inset-2 rounded-full bg-accent/15 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            aria-hidden
          />
          <span
            className="block h-full w-full overflow-hidden rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-[3px] ring-accent ring-offset-4 ring-offset-surface-high"
            style={{ backgroundColor: themeColor }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent shadow-md"
            aria-hidden
          >
            +
          </span>
          <input
            type="color"
            value={themeColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="색상 선택"
          />
        </label>

        <p className="rounded-full bg-accent px-4 py-1.5 font-mono text-sm font-semibold tracking-wide text-on-accent shadow-sm">
          {themeColor.toUpperCase()}
        </p>

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
              className={`w-full rounded-xl border bg-surface px-4 py-3 pr-10 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/25 ${borderClass}`}
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
