import { StyleSheet, Switch, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/** Fila con título, descripción e interruptor del sistema (preferencias de visibilidad). */
interface SwitchRowProps {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
}

export function SwitchRow({ title, description, value, onValueChange, disabled, testID }: SwitchRowProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderColor: theme.colors.line, borderRadius: theme.radii.field }]}>
      <View style={styles.texts}>
        <AppText variant="label">{title}</AppText>
        {description ? (
          <AppText variant="caption" tone="muted" style={styles.description}>
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch
        testID={testID}
        accessibilityLabel={title}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: theme.colors.primary, false: theme.colors.lineStrong }}
        thumbColor={theme.colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  texts: { flex: 1 },
  description: { marginTop: 2 },
});
