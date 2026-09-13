import { darkTokens, lightTokens, radii, type ColorTokens } from "./tokens.generated";

/**
 * Tema de la app (docs/06 §10): marca compartida con la web, chrome nativo.
 * Los colores y radios salen del archivo generado desde la web; las familias
 * tipográficas replican la regla de la web: Quicksand en claro, Space Grotesk
 * e Inter en oscuro. Módulo puro.
 */

export type ThemeMode = "light" | "dark";

/** Nombres con los que expo-font registra cada fuente (paquetes @expo-google-fonts). */
export const FONT_FAMILIES = {
  quicksand: {
    regular: "Quicksand_400Regular",
    medium: "Quicksand_500Medium",
    semibold: "Quicksand_600SemiBold",
    bold: "Quicksand_700Bold",
  },
  spaceGrotesk: {
    regular: "SpaceGrotesk_400Regular",
    medium: "SpaceGrotesk_500Medium",
    semibold: "SpaceGrotesk_600SemiBold",
    bold: "SpaceGrotesk_700Bold",
  },
  inter: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
} as const;

export interface FontSet {
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ColorTokens;
  radii: typeof radii;
  fonts: {
    display: FontSet;
    body: FontSet;
  };
}

export function createTheme(mode: ThemeMode): Theme {
  return mode === "dark"
    ? {
        mode,
        colors: darkTokens,
        radii,
        fonts: { display: FONT_FAMILIES.spaceGrotesk, body: FONT_FAMILIES.inter },
      }
    : {
        mode,
        colors: lightTokens,
        radii,
        fonts: { display: FONT_FAMILIES.quicksand, body: FONT_FAMILIES.quicksand },
      };
}

export type ThemePreference = "system" | ThemeMode;

/** Modo efectivo: la preferencia manual manda; si es "system", el del dispositivo. */
export function resolveThemeMode(
  preference: ThemePreference,
  systemScheme: ThemeMode | null | undefined,
): ThemeMode {
  if (preference !== "system") {
    return preference;
  }
  return systemScheme ?? "light";
}
