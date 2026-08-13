import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1e40af',
        'brand-primary-dark': '#1e3a8a',
        'brand-accent': '#0d9488',
        'brand-accent-dark': '#0f766e',
        surface: '#ffffff',
        'surface-muted': '#f7f9fc',
        'surface-inverse': '#0f172a',
        'text-default': '#0f172a',
        'text-muted': '#475569',
        'text-subtle': '#64748b',
        'text-on-brand': '#ffffff',
        'border-default': '#e2e8f0',
        'border-strong': '#cbd5e1',
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '80rem',
      },
      height: {
        hero: '26.25rem',
      },
      minHeight: {
        placeholder: '40vh',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.08)',
        'card-hover': '0 10px 25px -5px rgb(15 23 42 / 0.12), 0 8px 10px -6px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
