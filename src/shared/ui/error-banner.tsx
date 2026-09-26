import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/** Mensaje de error o aviso en tinte (alerta o advertencia), anunciado por accesibilidad. */
interface ErrorBannerProps {
  message: string | null | undefined;
  tone?: "alert" | "warn";
  testID?: string;
}

export function ErrorBanner({ message, tone = "alert", testID }: ErrorBannerProps) {
  const theme = useTheme();
  if (!message) {
    return null;
  }
  const palette =
    tone === "alert"
      ? { bg: theme.colors.alertTint, ink: theme.colors.alert }
      : { bg: theme.colors.warnTint, ink: theme.colors.warnInk };
  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: palette.bg, borderRadius: theme.radii.field }]}
    >
      <AppText variant="caption" style={{ color: palette.ink, textAlign: "center" }}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { width: "100%", paddingHorizontal: 12, paddingVertical: 10 },
});
