/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#b9090b',
          black: '#050505',
          darkGray: '#0d0d0d',
          lightGray: '#1c1c1e',
          textGray: '#a0a0a5'
        }
      }
    },
  },
  plugins: [],
}
