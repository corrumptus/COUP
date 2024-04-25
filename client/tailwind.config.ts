import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        "shrink": "shrink 3s linear"
      },
      keyframes: {
        "shrink": {
          "0%": { height: "100%" },
          "100%": { height: "0%" }
        }
      }
    }
  },
  plugins: [],
};
export default config;
