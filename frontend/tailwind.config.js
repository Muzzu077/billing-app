/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'havells-red': '#E31837',
        'havells-blue': '#1E40AF',
        'havells-yellow': '#FCD34D',
      }
    },
  },
  plugins: [],
} 