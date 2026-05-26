import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        brand: {
          50: "#e6fffa",
          100: "#ccfff5",
          200: "#99ffeb",
          300: "#66ffe0",
          400: "#33ffd6",
          500: "#00ffcc",
          600: "#00ccaa",
          700: "#009980",
        },
        surface: {
          0: "#000000",
          50: "#050505",
          100: "#0a0a0a",
          200: "#111111",
          300: "#1a1a1a",
        },
        ink: {
          900: "#ffffff",
          700: "#e5e5e5",
          500: "#a3a3a3",
          400: "#737373",
          300: "#525252",
        },
        gain: {
          50: "#001a11",
          100: "#003322",
          500: "#00ffaa",
          600: "#00cc88",
          700: "#009966",
        },
        loss: {
          50: "#1a0005",
          100: "#33000a",
          500: "#ff3366",
          600: "#cc2952",
          700: "#991f3d",
        },
      },
      boxShadow: {
        card: "0 0 0 1px rgb(255 255 255 / 0.05), 0 4px 20px rgb(0 0 0 / 0.5)",
        "card-hover": "0 0 0 1px rgb(0 255 204 / 0.2), 0 8px 30px rgb(0 0 0 / 0.8)",
        modal: "0 0 0 1px rgb(255 255 255 / 0.1), 0 20px 60px rgb(0 0 0 / 0.8)",
        "button-glow": "0 0 20px rgba(0, 255, 204, 0.4)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "skeleton-pulse": "skeletonPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        skeletonPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
