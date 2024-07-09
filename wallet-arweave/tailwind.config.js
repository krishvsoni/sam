/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Roboto, "Inter var", sans-serif', 
          {
            fontFeatureSettings: '"cv11", "ss01"',
            fontVariationSettings: '"opsz" 32'
          },
        ],
      },
    },
  },
  plugins: [
    daisyui,
  ],
};
