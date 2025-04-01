/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensures that Tailwind scans your JS/TS files for classes
  ],
  theme: {
    extend: {
      animation: {
        'slide-right': 'slideRight 1.5s ease-out',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100%)' }, // Start off-screen to the left
          '100%': { transform: 'translateX(0)' }, // End at normal position
        },
      },
    },
  },
  plugins: [],
}
