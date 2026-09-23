/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        noc: {
          bg: '#020617',
          card: '#0f172a',
          accent: '#3b82f6',
        },
      },
    },
  },

  plugins: [],
};