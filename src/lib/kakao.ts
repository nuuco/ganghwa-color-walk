interface KakaoShareApi {
  sendDefault: (options: {
    objectType: 'feed'
    content: {
      title: string
      description: string
      imageUrl: string
      link: {
        mobileWebUrl: string
        webUrl: string
      }
    }
    buttons?: Array<{
      title: string
      link: {
        mobileWebUrl: string
        webUrl: string
      }
    }>
  }) => void
}

interface KakaoSdk {
  init: (key: string) => void
  isInitialized: () => boolean
  Share: KakaoShareApi
}

declare global {
  interface Window {
    Kakao?: KakaoSdk
  }
}

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'

let sdkLoadPromise: Promise<void> | null = null

function getKakaoJsKey(): string {
  const key = import.meta.env.VITE_KAKAO_JS_KEY?.trim()
  if (!key) {
    throw new Error(
      '카카오 공유를 사용하려면 VITE_KAKAO_JS_KEY 환경 변수를 설정해 주세요.',
    )
  }
  return key
}

export function loadKakaoSdk(): Promise<void> {
  if (window.Kakao) return Promise.resolve()
  if (sdkLoadPromise) return sdkLoadPromise

  sdkLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${KAKAO_SDK_URL}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('카카오 SDK를 불러오지 못했습니다.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('카카오 SDK를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })

  return sdkLoadPromise
}

export async function initKakao(): Promise<KakaoSdk> {
  const key = getKakaoJsKey()
  await loadKakaoSdk()

  const kakao = window.Kakao
  if (!kakao) {
    throw new Error('카카오 SDK를 초기화할 수 없습니다.')
  }

  if (!kakao.isInitialized()) {
    kakao.init(key)
  }

  return kakao
}

export interface KakaoFeedShareInput {
  title: string
  description: string
  url: string
  imageUrl?: string
}

export async function shareKakaoFeed({
  title,
  description,
  url,
  imageUrl,
}: KakaoFeedShareInput): Promise<void> {
  const kakao = await initKakao()
  const shareUrl = url.trim()
  if (!shareUrl) {
    throw new Error('공유할 링크 URL이 없습니다. VITE_APP_URL을 설정해 주세요.')
  }

  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl:
        imageUrl?.trim() ||
        `${shareUrl.replace(/\/$/, '')}/vite.svg`,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: '컬러워크 보기',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  })
}

export function isKakaoConfigured(): boolean {
  return Boolean(import.meta.env.VITE_KAKAO_JS_KEY?.trim())
}
