export interface ThemePreset {
  id: string
  themeLabel: string
  themeColor: string
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'sunmu-purple', themeLabel: '순무 보라', themeColor: '#A882E0' },
  { id: 'sweet-potato-yellow', themeLabel: '고구마 노랑', themeColor: '#D4A83A' },
  { id: 'mugwort-green', themeLabel: '약쑥 초록', themeColor: '#7A9E7E' },
  { id: 'tidal-flat-green', themeLabel: '갯벌 회록', themeColor: '#6B8F7A' },
  { id: 'mud-flat-brown', themeLabel: '갯벌 흙빛', themeColor: '#8B7355' },
  { id: 'reed-silver', themeLabel: '갈대 은빛', themeColor: '#B8B5A8' },
  { id: 'sunset-coral', themeLabel: '노을 산호', themeColor: '#D4847A' },
  { id: 'sea-mist-blue', themeLabel: '해무 청회', themeColor: '#6B8FA8' },
]
