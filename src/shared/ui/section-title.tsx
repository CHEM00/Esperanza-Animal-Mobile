import { StyleSheet, View } from "react-native";
import { AppText } from "./app-text";

/** Encabezado de sección con acción opcional a la derecha. */
interface SectionTitleProps {
  title: string;
  hint?: string;
}

export function SectionTitle({ title, hint }: SectionTitleProps) {
  return (
    <View style={styles.root}>
      <AppText variant="heading">{title}</AppText>
      {hint ? (
        <AppText variant="caption" tone="muted" style={styles.hint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: 20, marginBottom: 10 },
  hint: { marginTop: 2 },
});
