import { ActivityIndicator, Platform, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import type { NativeIdentityProviderId } from "@/core/ports/identity-provider";
import { AppText } from "@/shared/ui/app-text";
import { AUTH_STRINGS } from "../strings";

/**
 * Botón de proveedor (3b): borde de línea en claro; Apple relleno con la
 * tinta principal, como en la web.
 */
interface ProviderButtonProps {
  provider: NativeIdentityProviderId;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function ProviderButton({ provider, loading, disabled, onPress }: ProviderButtonProps) {
  const theme = useTheme();
  const filled = provider === "apple";
  const background = filled ? theme.colors.ink : theme.colors.surface;
  const labelColor = filled ? theme.colors.bg : theme.colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={AUTH_STRINGS.providers[provider]}
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: theme.colors.line }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: background,
          borderColor: theme.colors.line,
          borderRadius: theme.radii.btn,
          opacity: disabled ? 0.6 : pressed && Platform.OS === "ios" ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <AppText variant="label" style={{ color: labelColor }}>
          {AUTH_STRINGS.providers[provider]}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
});
