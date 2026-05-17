import { SHEET_TEXT_MAX_LENGTH } from '../../config/textLimits'
import type { ThemePreset } from '../../data/themes'
import { useThemeRandomSpin } from '../../hooks/useThemeRandomSpin'
import { hexDisplayColor, inputTintStyle } from '../../lib/themeColorTint'
import { primaryButtonClassName } from '../ui/primaryButton'

interface CustomColorPickerProps {
  themeColor: string
  themeLabel: string
  onColorChange: (color: string) => void
  onLabelChange: (label: string) => void
  labelError?: string
  labelValid?: boolean
  onRandomPreset?: (preset: ThemePreset) => void
  onSpinningChange?: (spinning: boolean) => void
  /** 모달 등 내부 임베드 시 바깥 여백 생략 */
  embedded?: boolean
}

export function CustomColorPicker({
  themeColor,
  themeLabel,
  onColorChange,
  onLabelChange,
  labelError,
  labelValid,
  onRandomPreset,
  onSpinningChange,
  embedded = false,
}: CustomColorPickerProps) {
  const showRandom = Boolean(onRandomPreset)
  const { isSpinning, preview, startSpin } = useThemeRandomSpin({
    onSelect: onRandomPreset ?? (() => {}),
    onSpinningChange: showRandom ? onSpinningChange : undefined,
  })

  const displayColor = isSpinning && preview ? preview.themeColor : themeColor
  const displayLabel = isSpinning && preview ? preview.themeLabel : themeLabel
  const hexColorStyle = { color: hexDisplayColor(displayColor) }
  const spinInputStyle = isSpinning ? inputTintStyle(displayColor) : undefined

  const borderClass = isSpinning
    ? ''
    : labelError
      ? 'border-red-500'
      : labelValid
        ? 'border-green-500'
        : 'border-outline-variant'

  const sectionTitle = embedded ? '색상' : '직접 선택'

  return (
    <section
      className={
        embedded ? 'rounded-2xl bg-surface-high p-4' : 'mx-page rounded-2xl bg-surface-high p-5'
      }
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-on-surface-variant">{sectionTitle}</h3>
        {showRandom ? (
          <button
            type="button"
            onClick={startSpin}
            disabled={isSpinning}
            className="shrink-0 rounded-lg border border-outline-variant/50 bg-surface px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent/40 disabled:opacity-60"
            aria-label="랜덤 선택"
          >
            랜덤
          </button>
        ) : null}
      </div>
      <div className="flex flex-col items-center gap-5">
        <label
          className={`group relative block h-[7.5rem] w-[7.5rem] ${isSpinning ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span
            className="pointer-events-none absolute -inset-2 rounded-full bg-white/10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            aria-hidden
          />
          <span
            className="block h-full w-full overflow-hidden rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-[3px] ring-white/25 ring-offset-4 ring-offset-surface-high transition-colors duration-75"
            style={{ backgroundColor: displayColor }}
            aria-hidden
          />
          <span
            className={`pointer-events-none absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-md ${primaryButtonClassName}`}
            aria-hidden
          >
            +
          </span>
          <input
            type="color"
            value={displayColor}
            onChange={(e) => onColorChange(e.target.value)}
            disabled={isSpinning}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
            aria-label="색상 선택"
          />
        </label>

        <p
          className="font-mono text-sm font-semibold tracking-wide transition-colors duration-75"
          style={hexColorStyle}
        >
          {displayColor.toUpperCase()}
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
              value={displayLabel}
              onChange={(e) => onLabelChange(e.target.value)}
              readOnly={isSpinning}
              placeholder="예: 순무 보라"
              style={spinInputStyle}
              className={`w-full rounded-xl border px-4 py-3 pr-10 outline-none transition-colors duration-75 focus:border-accent/60 focus:ring-2 focus:ring-accent/25 ${
                isSpinning ? '' : 'bg-surface'
              } ${borderClass}`}
            />
            {labelValid && !isSpinning ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" aria-hidden>
                ✓
              </span>
            ) : null}
          </div>
          {labelError ? <p className="mt-1 text-xs text-red-400">{labelError}</p> : null}
          <p className="mt-1 text-xs text-on-surface-variant">
            {displayLabel.length}/{SHEET_TEXT_MAX_LENGTH}
          </p>
        </div>
      </div>
    </section>
  )
}
