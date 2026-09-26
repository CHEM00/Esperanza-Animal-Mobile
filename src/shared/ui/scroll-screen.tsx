import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme/use-theme";
import { CONTENT_MAX_WIDTH, HORIZONTAL_PADDING } from "./layout";

/**
 * Lienzo desplazable para pantallas con formulario o lista corta: mismo ancho
 * de lectura que `Screen`, teclado que no tapa los campos y «tirar para
 * actualizar» opcional.
 */
const BOTTOM_PADDING = 32;

interface ScrollScreenProps {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Sin área segura superior cuando la pila ya pinta cabecera nativa. */
  edges?: ("top" | "bottom")[];
  testID?: string;
}

export function ScrollScreen({ children, refreshing = false, onRefresh, edges = ["bottom"], testID }: ScrollScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: theme.colors.bg }]}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          testID={testID}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 12,
    paddingBottom: BOTTOM_PADDING,
    gap: 12,
  },
});
