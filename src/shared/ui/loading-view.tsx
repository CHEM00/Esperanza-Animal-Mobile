import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/** Indicador centrado con texto opcional; ocupa el alto disponible. */
export function LoadingView({ label, testID }: { label?: string; testID?: string }) {
  const theme = useTheme();
  return (
    <View testID={testID} style={styles.root} accessibilityRole="progressbar">
      <ActivityIndicator color={theme.colors.primary} />
      {label ? (
        <AppText tone="muted" style={styles.label}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 32 },
  label: { marginTop: 12 },
});
