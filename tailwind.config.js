/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1cb89b",
          50: "#e8faf6",
          100: "#d2f5ee",
          200: "#a5ebdd",
          300: "#78e1cc",
          400: "#4bd7bb",
          500: "#1cb89b",
          600: "#16957e",
          700: "#117262",
          800: "#0b4f45",
          900: "#062c28",
        },
        secondary: {
          DEFAULT: "#4ac6e5",
          50: "#effbff",
          100: "#dff6fe",
          200: "#bfeefd",
          300: "#9fe6fb",
          400: "#7fdef9",
          500: "#4ac6e5",
          600: "#36a8c6",
          700: "#2a839b",
          800: "#1f5e70",
          900: "#133944",
        },
      },
    },
  },
  plugins: [],
};
