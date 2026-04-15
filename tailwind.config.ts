import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      colors: {
        // Brand primaries
        primary: {
          DEFAULT: "#4F46E5",
          50: "#EDEEFF",
          100: "#DDD9FF",
          200: "#BFB8FF",
          300: "#A197FF",
          400: "#8375FF",
          500: "#6558F5",
          600: "#4F46E5",
          700: "#3D34C7",
          800: "#2C25A0",
          900: "#1C187A",
          950: "#0F0D4F",
          foreground: "#FFFFFF",
        },
        teal: {
          DEFAULT: "#14B8A6",
          50: "#EDFAF8",
          100: "#D5F5F1",
          200: "#AAEDE5",
          300: "#7FE5D9",
          400: "#2ECFC0",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0B7A71",
          800: "#085F57",
          900: "#054540",
          950: "#022927",
          foreground: "#FFFFFF",
        },
        gold: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
          foreground: "#1C1917",
        },
        // CSS variable-based semantic colors (for shadcn/ui compatibility)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Extended slate palette for shelf UI
        shelf: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        // Chart colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)",
        "card-hover":
          "0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)",
        "card-lg":
          "0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)",
        spotlight:
          "0 0 0 1px rgba(79,70,229,0.15), 0 4px 16px 0 rgba(79,70,229,0.12)",
        featured:
          "0 0 0 1px rgba(20,184,166,0.20), 0 4px 16px 0 rgba(20,184,166,0.10)",
        glow: "0 0 20px 0 rgba(79,70,229,0.25)",
        "glow-teal": "0 0 20px 0 rgba(20,184,166,0.25)",
        "glow-gold": "0 0 20px 0 rgba(245,158,11,0.30)",
      },
      backgroundImage: {
        "shelf-gradient":
          "linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)",
        "shelf-gradient-subtle":
          "linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(20,184,166,0.08) 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
        "dark-mesh":
          "radial-gradient(at 40% 20%, rgba(79,70,229,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(20,184,166,0.10) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(79,70,229,0.08) 0px, transparent 50%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(79,70,229,0.4)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 8px rgba(79,70,229,0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(79,70,229,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        float: "float 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "shelf-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [animate, typography],
};

export default config;