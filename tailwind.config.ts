import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f3f1ee",
        surface: "#ffffff",
        ink: "#1c1b1a",
        muted: "#8a8780",
        brand: {
          DEFAULT: "#f4582a",
          dark: "#e64d20",
        },
        accent: {
          DEFAULT: "#f4582a",
          dark: "#e64d20",
          soft: "#fdeee8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px -16px rgba(28,27,26,0.18)",
        card: "0 24px 60px -28px rgba(28,27,26,0.20)",
        pill: "0 10px 24px -12px rgba(244,88,42,0.45)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.4rem",
        "3xl": "1.9rem",
      },
    },
  },
  plugins: [],
};

export default config;
