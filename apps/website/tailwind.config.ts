import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      black: "#000000",
      white: "#ffffff",
      blue: {
        DEFAULT: "#14213D",
        50: "#466EC2",
        100: "#3C63B8",
        200: "#325399",
        300: "#28427A",
        400: "#1E325C",
        500: "#14213D",
        600: "#060A13",
        700: "#000000",
        800: "#000000",
        900: "#000000",
        950: "#000000",
      },
      gold: {
        DEFAULT: "#FCA311",
        50: "#FEE9C6",
        100: "#FEE1B2",
        200: "#FED28A",
        300: "#FDC262",
        400: "#FDB339",
        500: "#FCA311",
        600: "#D28403",
        700: "#9B6102",
        800: "#633E01",
        900: "#2C1C01",
        950: "#100A00",
      },
      silver: "#e5e5e5",
    },
  },
  plugins: [],
};
export default config;
