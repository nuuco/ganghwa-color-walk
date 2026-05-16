export type InstallScenario =
  | 'standalone'
  | 'kakao'
  | 'ios'
  | 'android-installable'
  | 'android-manual'
  | 'other'

export function isStandaloneDisplay(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function isKakaoInAppBrowser(): boolean {
  return /KAKAOTALK/i.test(navigator.userAgent)
}

export function isIosDevice(): boolean {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return true
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

export function isAndroidDevice(): boolean {
  return /Android/i.test(navigator.userAgent)
}

export function resolveInstallScenario(canNativeInstall: boolean): InstallScenario {
  if (isStandaloneDisplay()) return 'standalone'
  if (isKakaoInAppBrowser()) return 'kakao'
  if (isIosDevice()) return 'ios'
  if (isAndroidDevice()) {
    return canNativeInstall ? 'android-installable' : 'android-manual'
  }
  return 'other'
}
