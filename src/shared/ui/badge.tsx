import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/**
 * Etiqueta corta con tinte (chips de estado de la web: SE BUSCA, EN CASA…).
 * Los tonos son pares de tokens tinte/tinta del tema.
 */
export type BadgeTone = "alert" | "success" | "warn" | "primary" | "muted";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  testID?: string;
}

export function Badge({ label, tone = "muted", testID }: BadgeProps) {
  const theme = useTheme();
  const palette = {
    alert: { bg: theme.colors.alertTint, ink: theme.colors.alert },
    success: { bg: theme.colors.successTint, ink: theme.colors.successInk },
    warn: { bg: theme.colors.warnTint, ink: theme.colors.warnInk },
    primary: { bg: theme.colors.primaryTint, ink: theme.colors.privacyInk },
    muted: { bg: theme.colors.tabTrack, ink: theme.colors.muted },
  }[tone];

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      style={[styles.badge, { backgroundColor: palette.bg, borderRadius: theme.radii.chip }]}
    >
      <AppText variant="caption" style={[styles.label, { color: palette.ink }]}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start" },
  label: { fontSize: 10.5, lineHeight: 14, textTransform: "uppercase" },
});
