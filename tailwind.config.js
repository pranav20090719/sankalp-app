/** @type {import('tailwindcss').Config} */
export default {
  // Specify files where Tailwind should look for classes
  content: [
    "./index.html", // Your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All JS/TS/JSX/TSX files in src folder
  ],
  theme: {
    extend: {
      // Custom font family for Inter
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [], // No custom plugins for now
}
