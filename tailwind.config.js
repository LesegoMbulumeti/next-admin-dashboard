/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            primary: {
              DEFAULT: '#3b82f6', // Example blue
              foreground: '#ffffff',
            },
            card: {
                DEFAULT: '#1e293b', // Dark slate
                foreground: '#f8fafc',
              },
      },
    },
    plugins: [],
  }
}