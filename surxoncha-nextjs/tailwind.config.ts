import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        breaking: "rgb(var(--color-breaking) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "h1-mobile": ["32px", { lineHeight: "1.15", fontWeight: "800" }],
        "h1-desktop": ["56px", { lineHeight: "1.1", fontWeight: "800" }],
        "h2-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2-desktop": ["36px", { lineHeight: "1.2", fontWeight: "700" }],
        "h3-mobile": ["19px", { lineHeight: "1.3", fontWeight: "700" }],
        "h3-desktop": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "article-body": ["18px", { lineHeight: "1.7" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
      },
      maxWidth: {
        article: "760px",
      },
    },
  },
  plugins: [],
};

export default config;
