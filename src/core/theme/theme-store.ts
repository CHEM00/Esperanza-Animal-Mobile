import { create } from "zustand";
import type { ThemePreference } from "./theme";

/**
 * Preferencia de tema (docs/06 §10): sigue al sistema con override manual.
 * La persistencia de la preferencia llega con Ajustes (S12); mientras, vive
 * en memoria por sesión.
 */
interface ThemePreferenceState {
  preference: ThemePreference;
  setPreference(preference: ThemePreference): void;
}

export const themeStore = create<ThemePreferenceState>((set) => ({
  preference: "system",
  setPreference(preference) {
    set({ preference });
  },
}));
