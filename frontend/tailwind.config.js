/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eec: {
          dark: '#0a1128',
          card: '#101c3d',
          cardLight: '#182752',
          blue: '#1c4ed8',
          blueLight: '#3b82f6',
          gold: '#f59e0b',
          goldLight: '#fbbf24',
          accent: '#06b6d4',
          border: '#1e3a8a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
