export interface ThemePreset {
  id: string
  themeLabel: string
  themeColor: string
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'sunmu-purple', themeLabel: '순무 보라', themeColor: '#7B61A8' },
  { id: 'sweet-potato-yellow', themeLabel: '고구마 노랑', themeColor: '#E8B84A' },
  { id: 'goryesan-azalea-pink', themeLabel: '고려산 진달래 분홍', themeColor: '#E85D75' },
  { id: 'mugwort-green', themeLabel: '약쑥 초록', themeColor: '#6B8F7A' },
  { id: 'sochang-white', themeLabel: '소창 하양', themeColor: '#F4F6F6' },
  { id: 'ginseng-berry-red', themeLabel: '인삼 열매 빨강', themeColor: '#C1272D' },
  { id: 'tidal-flat-gray', themeLabel: '갯벌 회색', themeColor: '#8A9A92' },
  { id: 'dolmen-stone', themeLabel: '고인돌 바위색', themeColor: '#8D8D8D' },
]
