import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#2563eb',
        'surface-muted': '#f3f4f6',
      },
    },
  },
  plugins: [],
} satisfies Config
