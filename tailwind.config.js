/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#131313',
        surface: '#201f1f',
        'surface-high': '#2a2a2a',
        'surface-highest': '#353534',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#c8c7be',
        outline: '#929189',
        'outline-variant': '#474741',
        primary: '#ffffff',
        'on-primary': '#31312d',
        accent: '#f7941e',
        'on-accent': '#ffffff',
        kakao: '#FEE500',
      },
      spacing: {
        page: '20px',
        'grid-gap': '6px',
      },
      borderRadius: {
        cell: '4px',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Noto Sans KR',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: {
        app: '28rem',
      },
    },
  },
  plugins: [],
}
