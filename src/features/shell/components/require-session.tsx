import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { APP_ROUTES } from "@/core/navigation/links";
import { useTheme } from "@/core/theme/use-theme";
import { AUTH_STRINGS } from "@/features/auth/strings";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { CtaButton } from "@/shared/ui/cta-button";
import { Screen } from "@/shared/ui/screen";

/**
 * Puerta de sesión para pantallas privadas (mascotas, collar, guardianes): sin
 * sesión explica por qué y lleva al login; con sesión pinta el contenido.
 */
interface RequireSessionProps {
  children: ReactNode;
  /** Explicación específica de la pantalla; si falta, la genérica del login. */
  reason?: string;
  title?: string;
}

export function RequireSession({ children, reason, title }: RequireSessionProps) {
  const theme = useTheme();
  const router = useRouter();
  const authenticated = useIsAuthenticated();

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <Screen centered>
      <PawIcon size={48} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {title ?? AUTH_STRINGS.title}
      </AppText>
      <AppText tone="muted" style={styles.body}>
        {reason ?? AUTH_STRINGS.subtitle}
      </AppText>
      <View style={styles.cta}>
        <CtaButton label={AUTH_STRINGS.title} onPress={() => router.push(APP_ROUTES.login)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, textAlign: "center" },
  body: { marginTop: 8, textAlign: "center" },
  cta: { marginTop: 24, width: "100%" },
});
