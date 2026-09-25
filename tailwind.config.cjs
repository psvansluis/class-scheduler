/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#0A3D62",
        "brand-primary-foreground": "#F5F5F5",
        "brand-accent": "#FFB400",
        "brand-accent-foreground": "#1A1A1A",
        "brand-border": "#1E5A8A",
        "brand-background": "#FFFFFF",
        "brand-text": "#1A1A1A",
        "brand-success": "#056764",
        "brand-error": "#B60554",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
