/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        category: {
          'networking-equipment': '#1e40af',
          'networking-supplies': '#60a5fa',
          'cameras': '#fbbf24',
          'access-control': '#9333ea',
          'field-supplies': '#4b5563',
          'wire': '#e5e7eb',
          'tools': '#dc2626',
          'office-supplies': '#16a34a',
        }
      }
    },
  },
  plugins: [],
}