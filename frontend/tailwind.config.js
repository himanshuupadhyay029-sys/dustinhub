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
          cyan: '#00e5ff',
          cyanGlow: 'rgba(0, 229, 255, 0.35)',
          black: '#050505',
          darkGray: '#09090b',
          lightGray: '#121214',
          textGray: '#9ca3af'
        },
        netflix: {
          red: '#00e5ff', // Mapped to Cinema Cyan for backward compatibility
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
