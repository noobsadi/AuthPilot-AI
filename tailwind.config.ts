import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bcd0ff",
          300: "#8eb1ff",
          400: "#5d8bff",
          500: "#3b6bf3",
          600: "#2a52d8",
          700: "#2241ad",
          800: "#1f3889",
          900: "#1d326f",
        },
        teal: {
          50: "#ecfdf6",
          100: "#d2f7e6",
          200: "#a9eed0",
          300: "#73dfb3",
          400: "#3ec991",
          500: "#16b27a",
          600: "#0d8f5f",
          700: "#0b704c",
        },
        sky: {
          50: "#f0f8ff",
          100: "#e0efff",
          200: "#bbe2ff",
          300: "#7cc7ff",
          400: "#36a8ff",
          500: "#0d8cef",
          600: "#0570c4",
          700: "#075a9a",
        },
        indigo: {
          50: "#eef0fb",
          100: "#dde2f7",
          200: "#c0c8f0",
          300: "#9aa5e4",
          400: "#7782d6",
          500: "#5862c4",
          600: "#444eac",
        },
      },
      backgroundImage: {
        "health-gradient":
          "linear-gradient(135deg, #eef4ff 0%, #ecfdf6 50%, #f3edff 100%)",
        "brand-gradient":
          "linear-gradient(135deg, #3b6bf3 0%, #16b27a 50%, #8b5cf6 100%)",
        "soft-gradient":
          "linear-gradient(135deg, rgba(59,107,243,0.08) 0%, rgba(22,178,122,0.06) 50%, rgba(139,92,246,0.08) 100%)",
        "mesh-1":
          "radial-gradient(at 12% 18%, rgba(59,107,243,0.18) 0px, transparent 50%), radial-gradient(at 85% 0%, rgba(22,178,122,0.16) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(139,92,246,0.14) 0px, transparent 50%)",
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(31, 56, 137, 0.12), 0 2px 6px -2px rgba(15, 23, 42, 0.05)",
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px -6px rgba(15, 23, 42, 0.08)",
        elevated:
          "0 10px 30px -10px rgba(31, 56, 137, 0.20), 0 4px 10px -4px rgba(15, 23, 42, 0.08)",
        ring: "0 0 0 4px rgba(59,107,243,0.12)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        "fade-in": "fade-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
