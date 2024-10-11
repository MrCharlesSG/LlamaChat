const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/[object Object].js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        background_primary: "var(--background)",
        background_secondary: "#1E1E2D",
        background_third: "#353551",
        exalt: {
          DEFAULT:"#fbb03b",
          light:"#fce8d0"
        },
        exalt_second: {
          DEFAULT:"#5B99C2",
          light:"#B4D6CD"
        },
        danger_color: "#FF0060"
      },
    },
  },
  plugins: [nextui()],
};
