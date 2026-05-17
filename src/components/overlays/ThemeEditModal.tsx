import { useEffect, useMemo, useState } from 'react'
import { SHEET_TEXT_MAX_LENGTH } from '../../config/textLimits'
import { CustomColorPicker } from '../theme/CustomColorPicker'

interface ThemeEditModalProps {
  open: boolean
  themeLabel: string
  themeColor: string
  onClose: () => void
  onSave: (patch: { themeLabel: string; themeColor: string }) => void
}

export function ThemeEditModal({
  open,
  themeLabel,
  themeColor,
  onClose,
  onSave,
}: ThemeEditModalProps) {
  const [draftLabel, setDraftLabel] = useState(themeLabel)
  const [draftColor, setDraftColor] = useState(themeColor)

  useEffect(() => {
    if (!open) return
    setDraftLabel(themeLabel)
    setDraftColor(themeColor)
  }, [open, themeLabel, themeColor])

  const labelTrim = draftLabel.trim()
  const labelValid =
    labelTrim.length >= 1 && labelTrim.length <= SHEET_TEXT_MAX_LENGTH
  const labelError = useMemo(() => {
    if (draftLabel.length === 0) return undefined
    if (labelTrim.length === 0) return '컬러명을 입력해 주세요'
    if (labelTrim.length > SHEET_TEXT_MAX_LENGTH) {
      return `컬러명은 ${SHEET_TEXT_MAX_LENGTH}자 이하로 입력해 주세요`
    }
    return undefined
  }, [draftLabel, labelTrim])

  if (!open) return null

  const handleSave = () => {
    if (!labelValid) return
    onSave({ themeLabel: labelTrim, themeColor: draftColor })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60" role="presentation">
      <button type="button" className="flex-1" onClick={onClose} aria-label="닫기" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-edit-title"
        className="max-h-[85dvh] overflow-y-auto rounded-t-3xl border border-outline-variant/30 bg-surface px-page pb-8 pt-3"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-outline-variant" aria-hidden />
        <h2 id="theme-edit-title" className="mb-4 text-center text-base font-semibold">
          색상 편집
        </h2>
        <CustomColorPicker
          embedded
          themeColor={draftColor}
          themeLabel={draftLabel}
          onColorChange={setDraftColor}
          onLabelChange={setDraftLabel}
          labelError={labelError}
          labelValid={labelValid && draftLabel.length > 0}
        />
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-surface-high text-sm font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!labelValid}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-on-accent shadow-[0_4px_14px_rgba(247,148,30,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
