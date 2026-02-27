/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Category colors
        'cat-electrical': { DEFAULT: '#3b82f6', light: '#dbeafe' },
        'cat-mechanical': { DEFAULT: '#f59e0b', light: '#fef3c7' },
        'cat-carpentry': { DEFAULT: '#8b5cf6', light: '#ede9fe' },
        'cat-paint': { DEFAULT: '#ec4899', light: '#fce7f3' },
        'cat-fiberglass': { DEFAULT: '#10b981', light: '#d1fae5' },
        'cat-canvas': { DEFAULT: '#f97316', light: '#ffedd5' },
        // Crew colors
        'crew-jack': { DEFAULT: '#10b981', light: '#d1fae5' },
        'crew-charlie': { DEFAULT: '#8b5cf6', light: '#ede9fe' },
        'crew-perry': { DEFAULT: '#3b82f6', light: '#dbeafe' },
        // Priority colors
        'priority-high': '#ef4444',
        'priority-medium': '#f59e0b',
        'priority-low': '#22c55e',
        // Brand
        navy: { DEFAULT: '#1e3a5f', light: '#2d5a8e', dark: '#0f1f33' },
      },
    },
  },
  plugins: [],
};
