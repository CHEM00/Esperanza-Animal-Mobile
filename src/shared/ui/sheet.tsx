import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/**
 * Hoja inferior (`.rounded-sheet` de la web): modal del sistema con fondo
 * atenuado, asa y contenido desplazable. Cierra al tocar fuera.
 */
interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** No se puede cerrar tocando fuera (mientras se envía algo). */
  locked?: boolean;
  testID?: string;
}

const BACKDROP = "rgba(0, 0, 0, 0.45)";
const MAX_HEIGHT_RATIO = 0.9;

export function Sheet({ visible, onClose, title, children, locked = false, testID }: SheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const handleClose = locked ? undefined : onClose;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose ?? (() => undefined)}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityLabel="Cerrar"
          accessibilityRole="button"
          style={[styles.backdrop, { backgroundColor: BACKDROP }]}
          onPress={handleClose}
        />
        <View
          testID={testID}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.radii.sheet,
              borderTopRightRadius: theme.radii.sheet,
              paddingBottom: insets.bottom + 16,
              maxHeight: `${MAX_HEIGHT_RATIO * 100}%`,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.colors.lineStrong }]} />
          {title ? (
            <AppText variant="heading" style={styles.title}>
              {title}
            </AppText>
          ) : null}
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  sheet: { paddingTop: 10, paddingHorizontal: 18 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, marginBottom: 12 },
  title: { marginBottom: 10 },
  content: { paddingBottom: 8, gap: 12 },
});
