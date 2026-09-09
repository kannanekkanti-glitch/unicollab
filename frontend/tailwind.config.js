/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        espresso: {
          950: '#0c0a09',
          900: '#140e0a',
          850: '#1c140f',
          800: '#261c16',
          750: '#33251e',
        },
        brown: {
          50: '#faf6f2',
          100: '#f4ece4',
          200: '#e8d8c9',
          300: '#d7bfa8',
          400: '#bf9c7e',
          500: '#a77c57',
          600: '#8f623e',
          700: '#734d31',
          800: '#5e3e29',
          900: '#3e271a',
          950: '#23140b',
        },
        obsidian: {
          950: '#0c0a09',
          900: '#140e0a',
          850: '#1c140f',
          800: '#261c16',
          750: '#33251e',
        },
        brand: {
          50: '#fdfbf7',
          100: '#f9f3e5',
          200: '#f2e5c8',
          300: '#e8d2a1',
          400: '#dbb972',
          500: '#ca9e43',
          600: '#b08031',
          700: '#8d6126',
          800: '#734e23',
          900: '#604120',
          950: '#38230e',
        },
        gold: {
          100: '#fef9e2',
          200: '#fcf0be',
          300: '#fae290',
          400: '#f5ce5a',
          500: '#eab32a',
          600: '#d1951b',
          700: '#a66f17',
          800: '#865719',
          900: '#704719',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(234, 179, 42, 0.12)',
        'glow-brand': '0 0 25px -5px rgba(202, 158, 67, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-gold': '0 0 25px -5px rgba(234, 179, 42, 0.45)',
        'glow-brown': '0 0 25px -5px rgba(143, 98, 62, 0.35)',
        'glow-violet': '0 0 25px -5px rgba(202, 158, 67, 0.35)',
        'luxury': '0 20px 40px -15px rgba(62, 39, 26, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        'luxury-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(234, 179, 42, 0.12) inset',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [],
}
