import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "./app-text";

/**
 * Etiqueta de campo (mayúsculas, espaciado corto) con accesorio opcional a la
 * derecha, como el contador «12/40». Única definición: la usan campos de texto,
 * fecha, grupos de chips y los datos del perfil.
 */
interface FieldLabelProps {
  children: string;
  trailing?: ReactNode;
}

export function FieldLabel({ children, trailing }: FieldLabelProps) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" tone="muted" style={styles.label}>
        {children}
      </AppText>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  label: { textTransform: "uppercase", letterSpacing: 0.4 },
});
