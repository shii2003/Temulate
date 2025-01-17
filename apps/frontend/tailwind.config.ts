import type { Config } from "tailwindcss";

export default {
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
        neonPurple: '#A020F0',
        darkPurple: '#8a2be2',
      },
      boxShadow: {
        neon: '0 0 20px #a020f0',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #a020f0 0%, #8a2be2 100%)',
        'grid-pattern': 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
} satisfies Config;
