const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sunflower: ["var(--font-sunflower)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
