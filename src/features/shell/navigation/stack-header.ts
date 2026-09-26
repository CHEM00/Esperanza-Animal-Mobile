import type { Stack } from "expo-router";
import type { ComponentProps } from "react";
import { useTheme } from "@/core/theme/use-theme";

/** Opciones estáticas de una pantalla de la pila (sin la forma de función). */
type StackScreenOptions = Exclude<
  NonNullable<ComponentProps<typeof Stack.Screen>["options"]>,
  (...args: never[]) => unknown
>;

/**
 * Cabecera nativa de la pila con los tokens del tema (docs/06 §10): título
 * grande en iOS, barra Material en Android. La raíz la apaga por defecto y cada
 * ruta interior la enciende con esta función.
 */
export function useStackHeader(title: string): StackScreenOptions {
  const theme = useTheme();
  return {
    headerShown: true,
    title,
    headerBackButtonDisplayMode: "minimal",
    headerTintColor: theme.colors.primary,
    headerStyle: { backgroundColor: theme.colors.bg },
    headerShadowVisible: false,
    headerTitleStyle: { fontFamily: theme.fonts.display.bold, color: theme.colors.heading },
    contentStyle: { backgroundColor: theme.colors.bg },
  };
}
