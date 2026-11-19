import type { Config } from "tailwindcss";
import paxoPreset from "@paxo/ui/tailwind-preset";

/**
 * Tonos exactos del logo (extraidos del PDF original), los mismos que usa el
 * panel admin. El preset compartido sigue con sus valores para el resto.
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
          blue: { DEFAULT: "#2150A2", dark: "#173B7A" },
          red: { DEFAULT: "#BF1F2E", dark: "#981824" },
          ink: { DEFAULT: "#0F1B33", light: "#5A6478" },
        },
      },
    },
  },
};

export default config;
