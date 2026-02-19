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
    },
  },
  plugins: [],
};
export default config;
