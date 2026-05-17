export interface ThemePreset {
  id: string
  themeLabel: string
  themeColor: string
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'sunmu-purple', themeLabel: '순무 보라', themeColor: '#9D6EEB' },
  { id: 'sweet-potato-yellow', themeLabel: '고구마 노랑', themeColor: '#F0B82E' },
  { id: 'goryesan-azalea-pink', themeLabel: '진달래 분홍', themeColor: '#FF82B8' },
  { id: 'mugwort-green', themeLabel: '약쑥 초록', themeColor: '#42C078' },
  { id: 'sochang-white', themeLabel: '소창 하양', themeColor: '#FAFCFA' },
  { id: 'ginseng-berry-red', themeLabel: '인삼 열매 빨강', themeColor: '#E02538' },
  { id: 'tidal-flat-gray', themeLabel: '갯벌 회색', themeColor: '#72A898' },
  { id: 'dolmen-stone', themeLabel: '고인돌 바위색', themeColor: '#A09088' },
]
