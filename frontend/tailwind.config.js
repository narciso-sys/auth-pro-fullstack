/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo moderno
        primaryDark: '#3730a3',
        accent: '#818cf8',
        bgGlass: 'rgba(255, 255, 255, 0.15)',
        borderGlass: 'rgba(255, 255, 255, 0.2)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}