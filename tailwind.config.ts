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
          bg: "rgb(var(--bg-base-rgb) / <alpha-value>)",
          surface: "rgb(var(--bg-surface-rgb) / <alpha-value>)",
          elevated: "rgb(var(--bg-elevated-rgb) / <alpha-value>)",
          border: "rgb(var(--border-subtle-rgb) / <alpha-value>)",
          text: "rgb(var(--text-primary-rgb) / <alpha-value>)",
          muted: "rgb(var(--text-secondary-rgb) / <alpha-value>)",
          gold: "rgb(var(--accent-gold-rgb) / <alpha-value>)",
          blue: "rgb(var(--accent-blue-rgb) / <alpha-value>)",
          violet: "rgb(var(--accent-violet-rgb) / <alpha-value>)",
          red: "rgb(var(--danger-rgb) / <alpha-value>)",
          green: "rgb(var(--safe-rgb) / <alpha-value>)"
        }
      },
      boxShadow: {
        astro: "0 16px 42px rgba(0, 0, 0, 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
