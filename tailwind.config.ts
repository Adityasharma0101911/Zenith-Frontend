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
      // material design 3 color tokens
      colors: {
        // primary tonal palette
        "m3-primary": "#006B5E",
        "m3-on-primary": "#FFFFFF",
        "m3-primary-container": "#74F8DD",
        "m3-on-primary-container": "#00201B",

        // secondary tonal palette
        "m3-secondary": "#4A635D",
        "m3-on-secondary": "#FFFFFF",
        "m3-secondary-container": "#CCE8DF",
        "m3-on-secondary-container": "#06201A",

        // tertiary tonal palette
        "m3-tertiary": "#426278",
        "m3-on-tertiary": "#FFFFFF",
        "m3-tertiary-container": "#C7E7FF",
        "m3-on-tertiary-container": "#001E2E",

        // error palette
        "m3-error": "#BA1A1A",
        "m3-on-error": "#FFFFFF",
        "m3-error-container": "#FFDAD6",
        "m3-on-error-container": "#410002",

        // surface and background
        "m3-surface": "#F8FAF8",
        "m3-surface-dim": "#D8DBD8",
        "m3-surface-bright": "#F8FAF8",
        "m3-surface-container-lowest": "#FFFFFF",
        "m3-surface-container-low": "#F2F5F2",
        "m3-surface-container": "#ECF0EC",
        "m3-surface-container-high": "#E7EAE7",
        "m3-surface-container-highest": "#E1E3E1",
        "m3-on-surface": "#191C1B",
        "m3-on-surface-variant": "#3F4946",
        "m3-outline": "#6F7975",
        "m3-outline-variant": "#BFC9C4",

        // keep legacy alias working
        "zenith-teal": "#006B5E",
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
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,107,94,0.2)" },
          "50%": { boxShadow: "0 0 24px rgba(0,107,94,0.4)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
