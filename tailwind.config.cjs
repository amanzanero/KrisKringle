/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // daisyUI config (optional)
  daisyui: {
    themes: ["lemonade", "dark", "cmyk"],
  },
};
