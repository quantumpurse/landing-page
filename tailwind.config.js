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
      }
    },
  },
  plugins: [],
}