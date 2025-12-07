/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a', // Slate 900
        'dark-card': '#1e293b', // Slate 800
        'neon-purple': '#8b5cf6', // Violet 500
        'neon-pink': '#ec4899', // Pink 500
        'neon-blue': '#06b6d4', // Cyan 500
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
      }
    },
  },
  plugins: [],
};
