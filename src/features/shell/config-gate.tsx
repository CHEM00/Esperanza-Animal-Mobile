import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { appConfig } from "@/core/config";
import { useTheme } from "@/core/theme/use-theme";
import { isUpdateRequired } from "@/core/version/version-gate";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { AppText } from "@/shared/ui/app-text";
import { CtaButton } from "@/shared/ui/cta-button";
import { Screen } from "@/shared/ui/screen";
import { UpdateRequiredScreen } from "./screens/update-required-screen";
import { SHELL_STRINGS } from "./strings";

/**
 * Puerta de arranque (docs/05 §7): pide la configuración remota antes de
 * mostrar la app. Sin red no se bloquea a quien ya tiene datos en caché; sin
 * caché muestra reintento. Por debajo de la versión mínima, exige actualizar.
 */
export function ConfigGate({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const config = useRemoteConfig();

  if (config.isPending) {
    return (
      <Screen centered>
        <ActivityIndicator color={theme.colors.primary} />
        <AppText tone="muted" style={styles.loading}>
          {SHELL_STRINGS.loading}
        </AppText>
      </Screen>
    );
  }

  if (config.isError && !config.data) {
    return (
      <Screen centered>
        <AppText variant="title" style={styles.title}>
          {SHELL_STRINGS.offline.title}
        </AppText>
        <AppText tone="muted" style={styles.body}>
          {SHELL_STRINGS.offline.body}
        </AppText>
        <View style={styles.cta}>
          <CtaButton
            label={SHELL_STRINGS.offline.retry}
            loading={config.isFetching}
            onPress={() => void config.refetch()}
          />
        </View>
      </Screen>
    );
  }

  if (config.data && isUpdateRequired(appConfig.appVersion, config.data.minSupportedAppVersion)) {
    return <UpdateRequiredScreen storeUrl={null} />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: { marginTop: 12 },
  title: { textAlign: "center" },
  body: { marginTop: 8, textAlign: "center" },
  cta: { marginTop: 24, width: "100%" },
});
