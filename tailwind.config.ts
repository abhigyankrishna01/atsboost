import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ---------- Type ----------
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Instrument Serif'", "Georgia", "serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "500" }],
        h1: ["1.875rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["1.25rem",  { lineHeight: "1.3",  letterSpacing: "-0.01em", fontWeight: "700" }],
        h3: ["1rem",     { lineHeight: "1.4",  fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.55" }],
        small: ["0.8125rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        overline: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "600" }],
      },

      // ---------- Semantic Colors ----------
      colors: {
        primary: {
          soft: "#eef2ff",    // indigo-50
          100: "#e0e7ff",
          500: "#6366f1",     // indigo-500
          DEFAULT: "#4f46e5", // indigo-600
          hover: "#4338ca",   // indigo-700
          ink: "#3730a3",     // indigo-800 (text on soft bg)
        },
        purchase: {
          DEFAULT: "#059669",  // emerald-600
          hover: "#047857",    // emerald-700
          soft: "#ecfdf5",
          ink: "#065f46",
        },
        success: {
          DEFAULT: "#10b981",
          soft: "#ecfdf5",
          ink: "#065f46",
        },
        danger: {
          DEFAULT: "#e11d48",  // rose-600
          soft: "#fff1f2",
          border: "#fecdd3",
          ink: "#9f1239",
        },
        warning: {
          DEFAULT: "#d97706",
          soft: "#fffbeb",
          ink: "#92400e",
        },
        info: {
          DEFAULT: "#4f46e5",
          soft: "#eef2ff",
          border: "#c7d2fe",
          ink: "#3730a3",
        },
        // warm neutral stack (slate instead of gray — slightly warmer)
        ink: {
          DEFAULT: "#0f172a", // slate-900 — headings
          muted: "#475569",   // slate-600 — body
          subtle: "#94a3b8",  // slate-400 — captions
          faint: "#cbd5e1",   // slate-300 — borders
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f8fafc",  // slate-50 — page bg
          muted: "#f1f5f9",   // slate-100 — card bg
        },
      },

      // ---------- Radii ----------
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",       // buttons, inputs, pills
        lg: "12px",      // small cards
        xl: "16px",      // primary cards
        "2xl": "20px",   // hero/panels
        "3xl": "28px",
      },

      // ---------- Shadows (colored) ----------
      boxShadow: {
        xs: "0 1px 2px 0 rgb(15 23 42 / 0.04)",
        sm: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)",
        md: "0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.04)",
        lg: "0 12px 24px -6px rgb(15 23 42 / 0.12), 0 4px 8px -4px rgb(15 23 42 / 0.06)",
        xl: "0 24px 48px -12px rgb(15 23 42 / 0.18)",
        glow: "0 8px 28px -6px rgb(79 70 229 / 0.28)",
        "glow-purchase": "0 8px 28px -6px rgb(5 150 105 / 0.28)",
        ring: "inset 0 0 0 1px rgb(15 23 42 / 0.06)",
      },

      // ---------- Motion ----------
      transitionDuration: {
        DEFAULT: "180ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },

      // ---------- Animations ----------
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
