import { useEffect, useState } from 'react'
import type { InstallScenario } from '../../lib/pwaInstall'

interface InstallPromptModalProps {
  open: boolean
  scenario: InstallScenario
  isInstalling: boolean
  onClose: () => void
  onNativeInstall: () => void
}

function getTitle(scenario: InstallScenario): string {
  switch (scenario) {
    case 'standalone':
      return '이미 앱으로 실행 중이에요'
    case 'kakao':
      return '브라우저에서 열어 주세요'
    case 'ios':
      return '홈 화면에 추가'
    case 'android-installable':
      return '앱 설치'
    case 'android-manual':
      return '홈 화면에 추가'
    default:
      return '앱 설치 안내'
  }
}

function getBody(scenario: InstallScenario): string {
  switch (scenario) {
    case 'standalone':
      return '강화 컬러워크가 홈 화면 앱으로 실행 중입니다. 오프라인에서도 촬영·저장을 이용할 수 있어요.'
    case 'kakao':
      return '카카오톡 안에서는 설치가 제한됩니다. 아래 링크를 복사한 뒤 Safari나 Chrome에서 열어 주세요.'
    case 'ios':
      return 'Safari 하단의 공유 버튼(□↑)을 누른 다음 「홈 화면에 추가」를 선택하면 앱처럼 사용할 수 있어요.'
    case 'android-installable':
      return '홈 화면에 추가하면 앱처럼 빠르게 열 수 있어요. 오프라인에서도 촬영·저장이 가능합니다.'
    case 'android-manual':
      return 'Chrome 오른쪽 상단 메뉴(⋮)에서 「앱 설치」 또는 「홈 화면에 추가」를 선택해 주세요.'
    default:
      return '모바일 Safari·Chrome에서 열면 홈 화면에 추가할 수 있어요.'
  }
}

export function InstallPromptModal({
  open,
  scenario,
  isInstalling,
  onClose,
  onNativeInstall,
}: InstallPromptModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  if (!open) return null

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const showNativeInstall = scenario === 'android-installable'

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-page sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-prompt-title"
        className="w-full max-w-sm rounded-2xl bg-surface-high p-6"
      >
        <h2 id="install-prompt-title" className="text-lg font-semibold text-on-surface">
          {getTitle(scenario)}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{getBody(scenario)}</p>

        {scenario === 'ios' ? (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-on-surface-variant">
            <li>하단 공유(□↑) 탭</li>
            <li>「홈 화면에 추가」 선택</li>
            <li>오른쪽 상단 「추가」 탭</li>
          </ol>
        ) : null}

        <div className="mt-6 flex flex-col gap-2">
          {showNativeInstall ? (
            <button
              type="button"
              onClick={onNativeInstall}
              disabled={isInstalling}
              className="flex h-11 items-center justify-center rounded-xl bg-primary font-medium text-on-primary disabled:opacity-60"
            >
              {isInstalling ? '설치 중…' : '지금 설치'}
            </button>
          ) : null}

          {scenario === 'kakao' ? (
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex h-11 items-center justify-center rounded-xl bg-primary font-medium text-on-primary"
            >
              {copied ? '링크를 복사했어요' : '주소 복사'}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-xl bg-surface text-sm text-on-surface"
          >
            {scenario === 'standalone' ? '확인' : '닫기'}
          </button>
        </div>
      </div>
    </div>
  )
}
