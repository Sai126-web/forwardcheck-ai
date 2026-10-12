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
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
