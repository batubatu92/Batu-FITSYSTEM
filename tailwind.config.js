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
          DEFAULT: '#7cf25c',
          dim: '#3f6b32',
        },
      },
    },
  },
  plugins: [],
};
