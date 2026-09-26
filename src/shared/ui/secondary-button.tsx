import { ActivityIndicator, Platform, Pressable, StyleSheet, type PressableProps } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/**
 * Botón secundario: borde de línea sobre superficie; variante `danger` con la
 * tinta de alerta para acciones que quitan o desvinculan.
 */
interface SecondaryButtonProps extends Omit<PressableProps, "children" | "style"> {
  label: string;
  loading?: boolean;
  tone?: "default" | "danger";
  compact?: boolean;
}

export function SecondaryButton({
  label,
  loading = false,
  disabled,
  tone = "default",
  compact = false,
  ...rest
}: SecondaryButtonProps) {
  const theme = useTheme();
  const inactive = disabled || loading;
  const ink = tone === "danger" ? theme.colors.alert : theme.colors.ink;
  const border = tone === "danger" ? theme.colors.alert : theme.colors.line;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      android_ripple={{ color: theme.colors.line }}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        {
          backgroundColor: theme.colors.surface,
          borderColor: border,
          borderRadius: theme.radii.btn,
          opacity: inactive ? 0.6 : pressed && Platform.OS === "ios" ? 0.85 : 1,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={ink} />
      ) : (
        <AppText variant="label" style={{ color: ink }}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  compact: { paddingVertical: 9, width: undefined, paddingHorizontal: 14 },
});
