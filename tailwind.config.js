/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary, #4F46E5)",
          // Add opacity variants
          '10': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.1)',
          '20': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.2)',
          '30': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.3)',
          '40': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.4)',
          '50': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.5)',
          '60': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.6)',
          '70': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.7)',
          '80': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.8)',
          '90': 'rgba(var(--color-primary-rgb, 79, 70, 229), 0.9)',
        },
        secondary: {
          DEFAULT: "var(--color-secondary, #6366F1)",
          // Add opacity variants
          '10': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.1)',
          '20': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.2)',
          '30': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.3)',
          '40': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.4)',
          '50': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.5)',
          '60': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.6)',
          '70': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.7)',
          '80': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.8)',
          '90': 'rgba(var(--color-secondary-rgb, 99, 102, 241), 0.9)',
        },
        accent: {
          DEFAULT: "var(--color-accent, #F59E0B)",
          // Add opacity variants
          '10': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.1)',
          '20': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.2)',
          '30': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.3)',
          '40': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.4)',
          '50': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.5)',
          '60': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.6)',
          '70': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.7)',
          '80': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.8)',
          '90': 'rgba(var(--color-accent-rgb, 245, 158, 11), 0.9)',
        },
        background: "var(--color-background, #FFFFFF)",
        foreground: "var(--color-foreground, #1F2937)",
        card: "var(--color-card, #FFFFFF)",
        border: "var(--color-border, #E5E7EB)",
        "gray-50": "#F9FAFB",
        "gray-100": "#F3F4F6",
        "gray-200": "#E5E7EB",
        "gray-300": "#D1D5DB",
        "gray-400": "#9CA3AF",
        "gray-500": "#6B7280",
        "gray-600": "#4B5563",
        "gray-700": "#374151",
        "gray-800": "#1F2937",
        "gray-900": "#111827",
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
        'hover': 'var(--hover-shadow)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    // Try to load @tailwindcss/forms, but continue if it's not available
    (function() {
      try {
        return require('@tailwindcss/forms');
      } catch (e) {
        console.warn('Warning: @tailwindcss/forms not found, form styling disabled');
        return {};
      }
    })(),
  ],
};
