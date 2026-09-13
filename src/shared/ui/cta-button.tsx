import { ActivityIndicator, Platform, Pressable, StyleSheet, type PressableProps } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/**
 * CTA principal (cta-button.tsx de la web): teal sólido en claro, oro en
 * oscuro. En Android usa ripple nativo; en iOS, opacidad al presionar.
 */
interface CtaButtonProps extends Omit<PressableProps, "children" | "style"> {
  label: string;
  loading?: boolean;
}

export function CtaButton({ label, loading = false, disabled, ...rest }: CtaButtonProps) {
  const theme = useTheme();
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      android_ripple={{ color: theme.colors.primaryDark }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radii.card,
          opacity: inactive ? 0.6 : pressed && Platform.OS === "ios" ? 0.85 : 1,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <AppText variant="label" tone="onPrimary" style={styles.label}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: "100%", paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 15.5 },
});
