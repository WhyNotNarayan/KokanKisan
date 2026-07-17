/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7e6',
          100: '#dcefc8',
          200: '#b9df8f',
          300: '#8dca4e',
          400: '#6ab524',
          500: '#3B6D11',
          600: '#346210',
          700: '#2a4f0e',
          800: '#233f0f',
          900: '#1e3510',
        },
        soil: {
          50: '#faf5ed',
          100: '#f2e6d1',
          200: '#e4caa1',
          300: '#d4a96b',
          400: '#c78d44',
          500: '#854F0B',
          600: '#7a470d',
          700: '#65390e',
          800: '#543012',
          900: '#472913',
        },
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F0',
          200: '#FAF3E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
