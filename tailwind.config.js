/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#050608',
        surface: '#0b0d12',
        card: '#111419',
        border: '#1e2330',
        'border-bright': '#2e3650',
        amber: {
          DEFAULT: '#f5a623',
          dim: '#c4841a',
          glow: 'rgba(245,166,35,0.12)',
        },
        red: { DEFAULT: '#e8474c' },
        cyan: { DEFAULT: '#3be8c0' },
        muted: '#6b7591',
        muted2: '#3d4560',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'fade-up': 'fadeSlideUp 0.6s ease forwards',
        'blink': 'blink 1.2s step-end infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.8)' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
