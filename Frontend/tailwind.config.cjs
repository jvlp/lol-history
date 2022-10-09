/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xm: '374px',
      },
      colors: {
        win: '#28344E',
        lose: '#59343B',
      },
    },
  },
  plugins: [],
};
