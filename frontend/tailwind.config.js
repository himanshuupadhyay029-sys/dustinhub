/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          red: '#e50914',
          redGlow: 'rgba(229, 9, 20, 0.35)',
          black: '#050505',
          darkGray: '#09090b',
          lightGray: '#121214',
          textGray: '#9ca3af'
        },
        netflix: {
          red: '#e50914',
          black: '#050505',
          darkGray: '#09090b',
          lightGray: '#121214',
          textGray: '#9ca3af'
        }
      }
    },
  },
  plugins: [],
}
