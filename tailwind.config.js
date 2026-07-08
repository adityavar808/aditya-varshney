/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Satoshi', 'sans-serif'],
      },
      colors: {
        customDark: '#0C0C0C',
        customLight: '#D7E2EA',
      },
    },
  },
  plugins: [],
}
