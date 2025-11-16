export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- CRITICAL: Scans all components for classes
  ],
  theme: {
    extend: {
      fontFamily: {
        'gilroy': ['Gilroy', 'sans-serif'], // Add the custom font name
      }
    },
  },
  plugins: [],
}
