import type { Config } from "tailwindcss";

/**
 * Preset de marca PAXO — colores oficiales del manual de marca de
 * SOLUCIONES PAXO C.A. `blue`/`red` son los colores de acento (títulos,
 * botones, enlaces, estados activos); `ink`/`ink-light` son el texto
 * primario/secundario; `neutral` son fondos y bordes.
 */
const paxoPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        paxo: {
          blue: {
            DEFAULT: "#2158B5",
            dark: "#18438E",
          },
          red: {
            DEFAULT: "#A61D28",
            dark: "#7F151D",
          },
          neutral: {
            DEFAULT: "#F5F7FA",
            dark: "#D9DEE5",
          },
          ink: {
            DEFAULT: "#111827",
            light: "#4B5563",
          },
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#DC2626",
          info: "#0EA5E9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 12px 34px -22px rgba(15, 23, 42, 0.35)",
        card: "0 18px 38px -28px rgba(17, 24, 39, 0.28)",
      },
    },
  },
};

export default paxoPreset;
