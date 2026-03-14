/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quantum-primary': '#1e40af',
        'quantum-secondary': '#7c3aed',
        'quantum-accent': '#06b6d4',
        'quantum-dark': '#0f172a',
        'quantum-emerald': '#34d399',
        'quantum-surface': '#0d1321',
        'quantum-surface-light': '#141b2d',
        'quantum-border': '#1e293b',
      },
      fontFamily: {
        'display': ['"Instrument Serif"', 'Georgia', 'serif'],
        'mono': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        'body': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'lattice-shift': 'lattice-shift 20s linear infinite',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'lattice-shift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}