import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BDO Brand Palette
        brand: {
          50:  "#fff1f3",
          100: "#ffe4e8",
          200: "#fecdd6",
          300: "#fda4b5",
          400: "#fb7093",
          500: "#f43f6e", // Primary pink-red (main CTA)
          600: "#e11d55",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Gold accent (candle flame)
          600: "#d97706",
          700: "#b45309",
        },
        cream: "#FFF8F0",  // Warm off-white background
      },
      fontFamily: {
        sans: ["var(--font-noto-tc)", "system-ui", "sans-serif"],
        display: ["var(--font-noto-tc)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
