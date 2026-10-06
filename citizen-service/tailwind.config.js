/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/components/**/*.{js,ts,jsx,tsx}",
    "../shared/utils/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          light: '#34d399',
          dark: '#047857',
        },
      },
    },
  },
  plugins: [],
}
