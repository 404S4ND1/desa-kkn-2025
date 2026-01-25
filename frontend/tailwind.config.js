/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#40513B',   // Hijau Tua (Main Brand/Text)
        secondary: '#628141', // Hijau Daun (Hover/Accents)
        neutral: '#E5D9B6',   // Krem/Beige (Backgrounds/Soft Highlights)
        accent: '#E67E22',    // Oranye (Call to Action/Buttons)
        surface: '#FAF9F6',   // Putih Tulang (Background bersih)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}