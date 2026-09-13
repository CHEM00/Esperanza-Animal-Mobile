import { Linking, Platform, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { CtaButton } from "@/shared/ui/cta-button";
import { Screen } from "@/shared/ui/screen";
import { SHELL_STRINGS } from "../strings";

/**
 * M11 · Actualización obligatoria (RF-N3). Los enlaces de tienda se leen de
 * la configuración remota cuando existan fichas publicadas; hasta entonces
 * abre la tienda por el identificador de la app.
 */
interface UpdateRequiredScreenProps {
  storeUrl: string | null;
}

export function UpdateRequiredScreen({ storeUrl }: UpdateRequiredScreenProps) {
  const theme = useTheme();
  const canOpenStore = storeUrl !== null;
  return (
    <Screen centered>
      <PawIcon size={56} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {SHELL_STRINGS.updateRequired.title}
      </AppText>
      <AppText tone="muted" style={styles.body}>
        {SHELL_STRINGS.updateRequired.body}
      </AppText>
      <View style={styles.cta}>
        <CtaButton
          label={SHELL_STRINGS.updateRequired.cta}
          disabled={!canOpenStore}
          onPress={() => {
            if (storeUrl) {
              void Linking.openURL(storeUrl);
            }
          }}
        />
      </View>
      {!canOpenStore ? (
        <AppText variant="caption" tone="faint" style={styles.hint}>
          {Platform.OS === "ios" ? "Búscanos en App Store." : "Búscanos en Google Play."}
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, textAlign: "center" },
  body: { marginTop: 8, textAlign: "center" },
  cta: { marginTop: 24, width: "100%" },
  hint: { marginTop: 10 },
});
