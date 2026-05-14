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
          bg: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          border: "var(--border-subtle)",
          text: "var(--text-primary)",
          muted: "var(--text-secondary)",
          gold: "var(--accent-gold)",
          blue: "var(--accent-blue)",
          red: "var(--danger)",
          green: "var(--safe)"
        }
      },
      boxShadow: {
        astro: "0 1px 12px rgba(0, 0, 0, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
