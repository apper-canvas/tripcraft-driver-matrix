/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C5F2D',
          50: '#E8F5E8',
          100: '#D1EBD2',
          200: '#A3D7A5',
          300: '#75C378',
          400: '#47AF4B',
          500: '#2C5F2D',
          600: '#234F24',
          700: '#1A3F1B',
          800: '#112F12',
          900: '#081F09'
        },
        secondary: {
          DEFAULT: '#97BC62',
          50: '#F4F8EC',
          100: '#E9F1D9',
          200: '#D3E3B3',
          300: '#BDD58D',
          400: '#A7C767',
          500: '#97BC62',
          600: '#789650',
          700: '#59703E',
          800: '#3A4A2C',
          900: '#1B241A'
        },
        accent: {
          DEFAULT: '#FF6B35',
          50: '#FFE8DE',
          100: '#FFD1BD',
          200: '#FFB99C',
          300: '#FFA27B',
          400: '#FF8A5A',
          500: '#FF6B35',
          600: '#E5522A',
          700: '#CC4920',
          800: '#B33015',
          900: '#99270B'
        },
        surface: {
          DEFAULT: '#F5F5F0',
          50: '#F8F8F4',
          100: '#F5F5F0',
          200: '#E9E9E1',
          300: '#DCDCD2',
          400: '#D0D0C3',
          500: '#C3C3B4',
          600: '#B6B6A5',
          700: '#9A9A87',
          800: '#7D7D6A',
          900: '#60604D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        DEFAULT: '8px',
        'lg': '12px'
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'lift': '0 8px 16px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}