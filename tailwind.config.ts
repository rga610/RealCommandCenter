import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#012122',
          medium: '#013032',
          light: '#0f5461',
        },
        accent: {
          gold: '#cfb25f',
          'gold-light': '#d7c16e',
        },
        background: '#fcfcfc',
        focusRing: '#cfb25f',
      },
      fontFamily: {
        serif: ['Noto Serif Display', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'display-lg': '3.5rem', // Large Title (Cover Page)
        'display-md': '2.5rem', // Section Titles
        'body-lg': '1.25rem', // Large Body Text
        'body-md': '1rem', // Normal Text
      },
      spacing: {
        'section-padding': '4rem', // Consistent spacing
      },
      borderRadius: {
        'xl': '20px', // For Gold Callout Boxes
      },
    },
  },
  plugins: [],
}

export default config
