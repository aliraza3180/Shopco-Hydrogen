import type {Config} from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
        colors: {
            'primary': '#FF3333',
            'secondary': '#FF33331A',
        },
        fontFamily: {
            'sans': ['Poppins', 'sans-serif'],
            'heading': ['Integral CF', 'sans-serif'],
        },
    },
  },
  plugins: [],
} satisfies Config;