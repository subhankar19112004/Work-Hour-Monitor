import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card3d: '8px 8px 20px rgba(0,0,0,0.1), -8px -8px 20px rgba(255,255,255,0.5)',
      },
    },
  },
  plugins: [animate],
}
