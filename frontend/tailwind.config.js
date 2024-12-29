/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      color: {
        primary: '#000',
        secondary: '#fff'
      }
    },
  },
  plugins: [],
}