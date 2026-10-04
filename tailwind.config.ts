import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: "#fdfbf5",
          100: "#f9f4e2",
          200: "#f3e7be",
          300: "#ebd693",
          400: "#e5c56b",
          500: "#d4af37", // Classic Royal Gold
          600: "#c19a27",
          700: "#9e7a17",
          800: "#745812",
          900: "#4d390a",
          shimmer: "#fff3bf",
          glow: "#ffd700",
        },
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          DEFAULT: "#059669",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFE259 0%, #FFA751 100%)",
        "gold-metallic": "linear-gradient(135deg, #FBF5B7 0%, #E6C265 25%, #CBA135 50%, #E6C265 75%, #FBF5B7 100%)",
        "dark-luxury": "radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, rgba(11, 15, 23, 0.98) 70%)",
      },
      animation: {
        "gold-shimmer": "goldShimmer 3s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s infinite",
      },
      keyframes: {
        goldShimmer: {
          "0%, 100%": { filter: "brightness(100%) drop-shadow(0 0 5px rgba(212,175,55,0.4))" },
          "50%": { filter: "brightness(130%) drop-shadow(0 0 15px rgba(255,215,0,0.8))" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 215, 0, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
