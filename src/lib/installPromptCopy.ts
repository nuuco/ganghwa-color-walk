import type { InstallScenario } from './pwaInstall'

export function getInstallTitle(scenario: InstallScenario): string {
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

export function getInstallBody(scenario: InstallScenario): string {
  switch (scenario) {
    case 'standalone':
      return '강화 컬러워크가 홈 화면 앱으로 실행 중입니다. 오프라인에서도 촬영·저장을 이용할 수 있어요.'
    case 'kakao':
      return '카카오톡 안에서는 설치가 제한됩니다. 링크를 복사한 뒤 Safari나 Chrome에서 열어 주세요.'
    case 'ios':
      return 'Safari 공유(□↑) → 「홈 화면에 추가」로 앱처럼 사용할 수 있어요.'
    case 'android-installable':
      return '홈 화면에 추가하면 오프라인에서도 촬영·저장이 가능해요.'
    case 'android-manual':
      return 'Chrome 메뉴(⋮)에서 「앱 설치」 또는 「홈 화면에 추가」를 선택해 주세요.'
    default:
      return '모바일 Safari·Chrome에서 열면 홈 화면에 추가할 수 있어요.'
  }
}

export function getInstallSteps(scenario: InstallScenario): string[] | null {
  switch (scenario) {
    case 'ios':
      return ['하단 공유(□↑) 탭', '「홈 화면에 추가」 선택', '오른쪽 상단 「추가」 탭']
    case 'android-manual':
      return ['Chrome 오른쪽 상단 메뉴(⋮) 탭', '「앱 설치」 또는 「홈 화면에 추가」 선택']
    case 'other':
      return ['모바일 Safari·Chrome에서 이 페이지를 연 뒤', '브라우저 메뉴에서 홈 화면에 추가']
    default:
      return null
  }
}
