/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Темная тема включится ТОЛЬКО если есть класс 'dark' на <html>
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

