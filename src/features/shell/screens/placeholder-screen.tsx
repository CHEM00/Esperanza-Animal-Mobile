import { StyleSheet } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { Screen } from "@/shared/ui/screen";
import { SHELL_STRINGS } from "../strings";

/** Pantalla provisional para las pestañas que llenan S11 y S12. */
export function PlaceholderScreen({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <Screen centered>
      <PawIcon size={48} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      <AppText tone="muted" style={styles.body}>
        {SHELL_STRINGS.placeholder.body}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16 },
  body: { marginTop: 6, textAlign: "center" },
});
