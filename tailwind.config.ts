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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "greptile-green": {
          DEFAULT: "var(--greptile-green)",
          light: "var(--greptile-green-light)",
          dark: "var(--greptile-green-dark)",
        },
        "greptile-accent": "var(--greptile-accent)",
        green: {
          50: "var(--color-green-50)",
          100: "var(--color-green-100)",
          200: "var(--color-green-200)",
          300: "var(--color-green-300)",
          400: "var(--color-green-400)",
          500: "var(--color-green-500)",
          600: "var(--color-green-600)",
          700: "var(--color-green-700)",
          800: "var(--color-green-800)",
          900: "var(--color-green-900)",
        },
        gray: {
          50: "var(--color-gray-50)",
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
          700: "var(--color-gray-700)",
          800: "var(--color-gray-800)",
          900: "var(--color-gray-900)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "Cascadia Code", "ui-monospace"],
      },
      animation: {
        "pulse-green": "pulse-green 2s infinite",
        "fade-in": "fade-in 0.8s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-green": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 0 10px rgba(16, 185, 129, 0)",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.2)",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      backgroundImage: {
        "dot-pattern":
          "radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.1) 1px, transparent 0)",
      },
      backgroundSize: {
        "dot-20": "20px 20px",
      },
    },
  },
  plugins: [],
};

export default config;

