/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ayurveda: {
          primary: '#8B5A3C',     // Rich brown
          secondary: '#D4A574',   // Golden
          accent: '#F4E4BC',      // Light cream
          dark: '#5D4037',        // Dark brown
          light: '#FFF8E1',       // Warm white
          cream: '#FDF6E8',       // Warm cream background
          gold: '#FFD700',        // Traditional gold
          copper: '#B87333',      // Copper tones
          earth: '#8B4513',       // Earth brown
          sand: '#F4E4A6',        // Sandy beige
          turmeric: '#E6AC00',    // Turmeric yellow
          sacred: '#FF6B35',      // Sacred saffron
          lotus: '#FFB6C1',       // Lotus pink
          sage: '#9CAF88',        // Sage green
          frost: '#EAF2FB'        // Soft winter frost (pale blue)
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}