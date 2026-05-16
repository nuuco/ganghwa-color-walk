import { useMemo, useState } from 'react'
import { AppBar } from '../components/layout/AppBar'
import { ThemeStickyBar } from '../components/layout/ThemeStickyBar'
import { ColorRandomButton } from '../components/theme/ColorRandomButton'
import { CustomColorPicker } from '../components/theme/CustomColorPicker'
import { SheetTitleInput } from '../components/theme/SheetTitleInput'
import { ThemePresetPicker } from '../components/theme/ThemePresetPicker'
import { useApp } from '../context/AppContext'
import type { ThemePreset } from '../data/themes'

export function ThemePage() {
  const { themeDraft, setThemeDraft, setStep, createSheetFromDraft } = useApp()
  const [isRandomSpinning, setIsRandomSpinning] = useState(false)

  const titleTrim = themeDraft.sheetTitle.trim()
  const labelTrim = themeDraft.themeLabel.trim()

  const titleValid = titleTrim.length >= 1 && titleTrim.length <= 20
  const labelValid = labelTrim.length >= 1

  const titleError = useMemo(() => {
    if (themeDraft.sheetTitle.length === 0) return undefined
    if (titleTrim.length === 0) return '제목을 입력해 주세요'
    if (titleTrim.length > 20) return '제목은 20자 이하로 입력해 주세요'
    return undefined
  }, [themeDraft.sheetTitle, titleTrim])

  const labelError = useMemo(() => {
    if (themeDraft.themeLabel.length === 0) return undefined
    if (labelTrim.length === 0) return '컬러명을 입력해 주세요'
    return undefined
  }, [themeDraft.themeLabel, labelTrim])

  const ctaDisabled = !titleValid || !labelValid || isRandomSpinning

  const applyPreset = (preset: ThemePreset) => {
    setThemeDraft({
      themeId: preset.id,
      themeLabel: preset.themeLabel,
      themeColor: preset.themeColor,
    })
    document.documentElement.style.setProperty('--theme-color', preset.themeColor)
  }

  const handleColorChange = (color: string) => {
    setThemeDraft({ themeId: 'custom', themeColor: color })
    document.documentElement.style.setProperty('--theme-color', color)
  }

  const handleCta = () => {
    const id = createSheetFromDraft()
    if (id) document.documentElement.style.setProperty('--theme-color', themeDraft.themeColor)
  }

  return (
    <div className="flex min-h-dvh flex-col pb-40" style={{ ['--theme-color' as string]: themeDraft.themeColor }}>
      <AppBar title="새 컬러워크" showBack onBack={() => setStep('archive')} />
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
        ctaLabel="이 색으로 산책하기"
        disabled={ctaDisabled}
        onCta={handleCta}
      />
    </div>
  )
}
