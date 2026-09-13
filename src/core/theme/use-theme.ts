import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { createTheme, resolveThemeMode, type Theme } from "./theme";
import { themeStore } from "./theme-store";

/** Tema efectivo para la pantalla actual. */
export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const preference = themeStore((state) => state.preference);
  // React Native puede responder "unspecified": se trata como sin dato.
  const knownScheme = systemScheme === "dark" || systemScheme === "light" ? systemScheme : null;
  const mode = resolveThemeMode(preference, knownScheme);
  return useMemo(() => createTheme(mode), [mode]);
}
