// this sets up the animation libraries and custom tailwind pulses
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // custom colors for the material theme
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "zenith-teal": "#0F766E",
        "zenith-bg": "#F8FAFC",
      },
      // custom animation for a slow breathing pulse effect
      animation: {
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
      },
      // keyframes for the slow pulse
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
