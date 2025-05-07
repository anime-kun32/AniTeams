/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Extend the theme to include custom scrollbar styles
      scrollbar: {
        thin: {
          'scrollbar-width': 'thin', // For Firefox
          '::-webkit-scrollbar': {
            width: '8px', // Width of the scrollbar
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#4b5563', // Tailwind gray-600
            borderRadius: '9999px', // Fully rounded
          },
          '::-webkit-scrollbar-track': {
            background: '#1f2937', // Tailwind gray-800
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'), 
    require('tailwind-scrollbar-hide'),
  ],
};
