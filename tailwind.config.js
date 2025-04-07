/**
 * @type {import('tailwindcss').Config}
 * 
 * !!! IMPORTANT !!!
 * This application uses a strictly grayscale palette.
 * Any changes to colors should be made in src/utils/colors.ts
 * DO NOT add colored values to this file.
 */

// Import grayscale color definitions
const colors = require('./src/utils/colors');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors are locked to grayscale only - refer to src/utils/colors.ts for definitions
      colors: colors.colors,
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: [
          'Source Sans Pro',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
    },
  },
  plugins: [
    // Try to load @tailwindcss/forms, but continue if it's not available
    (function () {
      try {
        return require('@tailwindcss/forms');
      } catch (e) {
        console.warn('Warning: @tailwindcss/forms not found, form styling disabled');
        return {};
      }
    })(),
  ],
};
