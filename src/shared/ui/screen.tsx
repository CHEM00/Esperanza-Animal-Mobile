import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme/use-theme";
import { CONTENT_MAX_WIDTH, HORIZONTAL_PADDING } from "./layout";

/** Lienzo de pantalla: fondo del tema, área segura y el ancho de lectura de la web. */

interface ScreenProps {
  children: ReactNode;
  centered?: boolean;
  style?: ViewStyle;
}

export function Screen({ children, centered = false, style }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.content, centered && styles.centered, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  centered: { alignItems: "center", justifyContent: "center" },
});
