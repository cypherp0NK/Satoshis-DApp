/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js, jsx}", "./components/**/*.{js, jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#212121",
        cardBlack: "#121212",
        subtleGray: "#757373",
        shadedGray: "#3a39399a",
        fadedGray: "#49484867",
        customWidth: "12.5%",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
