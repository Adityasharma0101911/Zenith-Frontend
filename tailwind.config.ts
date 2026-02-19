// material design 3 token system for zenith
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // m3 color tokens — powered by css variables for theming
      colors: {
        "m3-primary": "rgb(var(--m3-primary) / <alpha-value>)",
        "m3-on-primary": "rgb(var(--m3-on-primary) / <alpha-value>)",
        "m3-primary-container": "rgb(var(--m3-primary-container) / <alpha-value>)",
        "m3-on-primary-container": "rgb(var(--m3-on-primary-container) / <alpha-value>)",
        "m3-secondary": "rgb(var(--m3-secondary) / <alpha-value>)",
        "m3-on-secondary": "rgb(var(--m3-on-secondary) / <alpha-value>)",
        "m3-secondary-container": "rgb(var(--m3-secondary-container) / <alpha-value>)",
        "m3-on-secondary-container": "rgb(var(--m3-on-secondary-container) / <alpha-value>)",
        "m3-tertiary": "rgb(var(--m3-tertiary) / <alpha-value>)",
        "m3-on-tertiary": "rgb(var(--m3-on-tertiary) / <alpha-value>)",
        "m3-tertiary-container": "rgb(var(--m3-tertiary-container) / <alpha-value>)",
        "m3-on-tertiary-container": "rgb(var(--m3-on-tertiary-container) / <alpha-value>)",
        "m3-error": "rgb(var(--m3-error) / <alpha-value>)",
        "m3-on-error": "rgb(var(--m3-on-error) / <alpha-value>)",
        "m3-error-container": "rgb(var(--m3-error-container) / <alpha-value>)",
        "m3-on-error-container": "rgb(var(--m3-on-error-container) / <alpha-value>)",
        "m3-surface": "rgb(var(--m3-surface) / <alpha-value>)",
        "m3-surface-dim": "rgb(var(--m3-surface-dim) / <alpha-value>)",
        "m3-surface-bright": "rgb(var(--m3-surface-bright) / <alpha-value>)",
        "m3-surface-container-lowest": "rgb(var(--m3-surface-container-lowest) / <alpha-value>)",
        "m3-surface-container-low": "rgb(var(--m3-surface-container-low) / <alpha-value>)",
        "m3-surface-container": "rgb(var(--m3-surface-container) / <alpha-value>)",
        "m3-surface-container-high": "rgb(var(--m3-surface-container-high) / <alpha-value>)",
        "m3-surface-container-highest": "rgb(var(--m3-surface-container-highest) / <alpha-value>)",
        "m3-on-surface": "rgb(var(--m3-on-surface) / <alpha-value>)",
        "m3-on-surface-variant": "rgb(var(--m3-on-surface-variant) / <alpha-value>)",
        "m3-outline": "rgb(var(--m3-outline) / <alpha-value>)",
        "m3-outline-variant": "rgb(var(--m3-outline-variant) / <alpha-value>)",
        "m3-inverse-surface": "rgb(var(--m3-inverse-surface) / <alpha-value>)",
        "m3-inverse-on-surface": "rgb(var(--m3-inverse-on-surface) / <alpha-value>)",
        "zenith-teal": "rgb(var(--m3-primary) / <alpha-value>)",
      },
      // material design 3 rounded corners
      borderRadius: {
        "m3-xs": "4px",
        "m3-sm": "8px",
        "m3-md": "12px",
        "m3-lg": "16px",
        "m3-xl": "28px",
        "m3-full": "9999px",
      },
      // material design 3 elevation shadows
      boxShadow: {
        "m3-1": "0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)",
        "m3-2": "0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)",
        "m3-3": "0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)",
        "m3-4": "0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)",
        "m3-5": "0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.3)",
      },
      // rich android-style animations
      animation: {
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "ripple": "ripple 0.6s ease-out forwards",
        "slide-up": "slide-up 0.4s cubic-bezier(0.2,0,0,1) forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.2,0,0,1) forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "typewriter": "typewriter 0.05s steps(1) forwards",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.08)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "0.4" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgb(var(--m3-primary) / 0.2)" },
          "50%": { boxShadow: "0 0 24px rgb(var(--m3-primary) / 0.4)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
