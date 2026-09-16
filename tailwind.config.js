/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0f1115',
          surface: '#171a21',
          border: '#262b36',
        },
        accent: {
          DEFAULT: '#ff8a3d',
          dim: '#5c3a22',
        },
        flame: {
          from: '#ffb020',
          to: '#ff4d4d',
        },
      },
    },
  },
  plugins: [],
};
