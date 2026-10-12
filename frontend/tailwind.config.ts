import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F17",
        elevated: "#1B2331",
        surface: "#141B26",
        border: "#283548",
        primaryText: "#F1F3F7",
        mutedText: "#94A3B8",
        accent: {
          DEFAULT: "#6665E8",
          hover: "#5756D1",
        },
        verdict: {
          verified: "#35AA9E",
          false: "#E56D68",
          outdated: "#DEA44C",
          partial: "#E28B57",
          inconclusive: "#64748B",
        },
        bait: {
          DEFAULT: "#9670D7",
          glow: "rgba(150, 112, 215, 0.2)",
        },
        noir: {
          dark: "#0B0E14",
          cork: "#18130E",
          corkBorder: "#342318",
          wood: "#261A12",
          paper: "#1A202C",
          yarn: "#EF4444",
          yarnDark: "#DC2626",
          polaroid: "#1E2532",
          brass: "#D97706",
          lampGlow: "rgba(245, 158, 11, 0.15)",
        },
      },
      boxShadow: {
        pin: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        evidence: "0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
        lamp: "0 0 50px 10px rgba(245, 158, 11, 0.08)",
        stamp: "0 0 0 2px currentColor, inset 0 0 0 1px currentColor",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
