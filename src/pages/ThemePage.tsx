import { useMemo, useState } from 'react'
import { SHEET_TEXT_MAX_LENGTH } from '../config/textLimits'
import { AppBar } from '../components/layout/AppBar'
import { ThemeStickyBar } from '../components/layout/ThemeStickyBar'
import { ColorRandomButton } from '../components/theme/ColorRandomButton'
import { CustomColorPicker } from '../components/theme/CustomColorPicker'
import { SheetTitleInput } from '../components/theme/SheetTitleInput'
import { ThemePresetPicker } from '../components/theme/ThemePresetPicker'
import { useApp } from '../context/AppContext'
import type { ThemePreset } from '../data/themes'

export function ThemePage() {
  const {
    themeDraft,
    themeEditSheetId,
    setThemeDraft,
    resetThemeDraft,
    setStep,
    submitThemeDraft,
  } = useApp()
  const [isRandomSpinning, setIsRandomSpinning] = useState(false)
  const isEditing = themeEditSheetId !== null

  const titleTrim = themeDraft.sheetTitle.trim()
  const labelTrim = themeDraft.themeLabel.trim()

  const titleValid =
    titleTrim.length >= 1 && titleTrim.length <= SHEET_TEXT_MAX_LENGTH
  const labelValid =
    labelTrim.length >= 1 && labelTrim.length <= SHEET_TEXT_MAX_LENGTH

  const titleError = useMemo(() => {
    if (themeDraft.sheetTitle.length === 0) return undefined
    if (titleTrim.length === 0) return '제목을 입력해 주세요'
    if (titleTrim.length > SHEET_TEXT_MAX_LENGTH) {
      return `제목은 ${SHEET_TEXT_MAX_LENGTH}자 이하로 입력해 주세요`
    }
    return undefined
  }, [themeDraft.sheetTitle, titleTrim])

  const labelError = useMemo(() => {
    if (themeDraft.themeLabel.length === 0) return undefined
    if (labelTrim.length === 0) return '컬러명을 입력해 주세요'
    if (labelTrim.length > SHEET_TEXT_MAX_LENGTH) {
      return `컬러명은 ${SHEET_TEXT_MAX_LENGTH}자 이하로 입력해 주세요`
    }
    return undefined
  }, [themeDraft.themeLabel, labelTrim])

  const ctaDisabled = !titleValid || !labelValid || isRandomSpinning

  const applyPreset = (preset: ThemePreset) => {
    setThemeDraft({
      themeId: preset.id,
      themeLabel: preset.themeLabel,
      themeColor: preset.themeColor,
    })
  }

  const handleColorChange = (color: string) => {
    setThemeDraft({ themeId: 'custom', themeColor: color })
  }

  const handleBack = () => {
    resetThemeDraft()
    setStep('archive')
  }

  const handleCta = async () => {
    await submitThemeDraft()
  }

  return (
    <div className="flex min-h-dvh flex-col pb-40">
      <AppBar
        title={isEditing ? '컬러워크 수정' : '새 컬러워크'}
        showBack
        onBack={handleBack}
      />
      <div className="flex flex-col gap-5 py-4">
        <SheetTitleInput
          value={themeDraft.sheetTitle}
          onChange={(v) => setThemeDraft({ sheetTitle: v })}
          error={titleError}
          valid={titleValid && themeDraft.sheetTitle.length > 0}
        />
        <CustomColorPicker
          themeColor={themeDraft.themeColor}
          themeLabel={themeDraft.themeLabel}
          onColorChange={handleColorChange}
          onLabelChange={(v) => setThemeDraft({ themeId: 'custom', themeLabel: v })}
          labelError={labelError}
          labelValid={labelValid && themeDraft.themeLabel.length > 0}
        />
        <ColorRandomButton onSelect={applyPreset} onSpinningChange={setIsRandomSpinning} />
        <ThemePresetPicker selectedId={themeDraft.themeId} onSelect={applyPreset} />
      </div>
      <ThemeStickyBar
        themeColor={themeDraft.themeColor}
        themeLabel={themeDraft.themeLabel}
        ctaLabel={isEditing ? '수정하기' : '이 색으로 산책하기'}
        disabled={ctaDisabled}
        onCta={handleCta}
      />
    </div>
  )
}
