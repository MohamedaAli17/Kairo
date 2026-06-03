import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f4f5",
        ink: "#18181b",
        muted: "#71717a",
        brand: {
          DEFAULT: "#7c5cfc",
          dark: "#6d4bf0",
        },
        accent: {
          DEFAULT: "#f4582a",
          dark: "#e64d20",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(24,24,27,0.12)",
        card: "0 18px 50px -20px rgba(24,24,27,0.18)",
        pill: "0 8px 24px -10px rgba(24,24,27,0.18)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
