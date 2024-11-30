/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",  // Include all files in the app folder
    "./(createpost)/**/*.{js,jsx,ts,tsx}",  // Include files in the createpost folder
    "./(tabs)/**/*.{js,jsx,ts,tsx}",  // Include files in the tabs folder
    "./components/**/*.{js,jsx,ts,tsx}",  // Include files in the components folder
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FAF7F2',
        customYellow: '#FAF7F2',
      },
    },
  },
  plugins: [],
}
