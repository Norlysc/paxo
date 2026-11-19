import type { Config } from "tailwindcss";
import paxoPreset from "@paxo/ui/tailwind-preset";

/**
 * El panel usa los tonos exactos del logo (extraidos del PDF original) y una
 * escala de radios y sombras mas sobria que la landing. Estos valores solo
 * aplican al admin: la landing sigue con el preset tal cual.
 */
const config: Config = {
  presets: [paxoPreset as Config],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paxo: {
          blue: { DEFAULT: "#2150A2", dark: "#173B7A", soft: "#EAF0FA" },
          red: { DEFAULT: "#BF1F2E", dark: "#981824", soft: "#FCEBED" },
          navy: { DEFAULT: "#0E2550", deep: "#091B3D" },
          neutral: { DEFAULT: "#F3F5F9", dark: "#E2E7EF" },
          ink: { DEFAULT: "#0F1B33", light: "#5A6478" },
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15, 27, 51, 0.04), 0 1px 1px rgba(15, 27, 51, 0.03)",
        soft: "0 1px 2px rgba(15, 27, 51, 0.06), 0 6px 16px -8px rgba(33, 80, 162, 0.35)",
        card: "0 1px 2px rgba(15, 27, 51, 0.04), 0 12px 32px -20px rgba(15, 27, 51, 0.25)",
      },
    },
  },
};

export default config;
