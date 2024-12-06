import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/*.{js,ts,jsx,tsx,mdx}",
    "./appPages/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      "phone/2": "475px",
      "pc": "600px",
      "pc-2": "950px"
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "shrink": "shrink 3s linear",
        "green-to-red": "green-to-red 3s linear",
        "toast": "toast 3s linear"
      },
      keyframes: {
        "shrink": {
          "0%": { width: "100%" },
          "100%": { width: "0%" }
        },
        "green-to-red": {
          "0%": { backgroundColor: "green" },
          "33%": { backgroundColor: "orange" },
          "66%": { backgroundColor: "red" }
        },
        "toast": {
          "0%": {
            width: "100%",
            backgroundColor: "green"
          },
          "25%": {
            backgroundColor: "green"
          },
          "33%": {
            backgroundColor: "orange"
          },
          "66%": {
            backgroundColor: "orange"
          },
          "75%": {
            backgroundColor: "red"
          },
          "100%": {
            width: "0%",
            backgroundColor: "red"
          }
        }
      }
    }
  },
  plugins: [],
};
export default config;
