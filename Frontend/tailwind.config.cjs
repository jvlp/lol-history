/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '2xm': '320px',
        'xm': '374px',
      },
      colors: {
        win: '#28344E',
        lose: '#59343B',
      },
    },
  },
  plugins: [],
};
