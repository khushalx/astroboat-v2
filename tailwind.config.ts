import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        astro: {
          bg: "#070B14",
          surface: "#101827",
          elevated: "#131C2E",
          border: "#1E293B",
          text: "#E5E7EB",
          muted: "#94A3B8",
          gold: "#D6A84F",
          blue: "#7DD3FC",
          red: "#F87171",
          green: "#86EFAC"
        }
      },
      boxShadow: {
        astro: "0 18px 70px rgba(0, 0, 0, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
