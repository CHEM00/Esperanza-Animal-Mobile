import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { messageForError } from "@/core/errors/problem-messages";
import { APP_ROUTES } from "@/core/navigation/links";
import { useTheme } from "@/core/theme/use-theme";
import { useMe } from "@/features/account/use-me";
import { useSignIn } from "@/features/auth/use-sign-in";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { CtaButton } from "@/shared/ui/cta-button";
import { Screen } from "@/shared/ui/screen";
import { AUTH_STRINGS } from "@/features/auth/strings";
import { SHELL_STRINGS } from "../strings";

/**
 * Pestaña Perfil en S10: demuestra el ciclo completo de sesión (entrar,
 * consultar /me con token portador, salir). La pantalla 3g completa llega en S12.
 */
export function ProfileGateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const authenticated = useIsAuthenticated();
  const me = useMe();
  const { signOut } = useSignIn();

  if (!authenticated) {
    return (
      <Screen centered>
        <PawIcon size={48} color={theme.colors.primary} />
        <AppText variant="title" style={styles.title}>
          {SHELL_STRINGS.tabs.profile}
        </AppText>
        <AppText tone="muted" style={styles.body}>
          {AUTH_STRINGS.subtitle}
        </AppText>
        <View style={styles.cta}>
          <CtaButton label={AUTH_STRINGS.title} onPress={() => router.push(APP_ROUTES.login)} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen centered>
      <PawIcon size={48} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {me.data?.user.name ?? SHELL_STRINGS.loading}
      </AppText>
      {me.data ? (
        <AppText tone="muted" style={styles.body}>
          {me.data.user.email}
          {me.data.profile ? ` · ${me.data.profile.coloniaName}` : ""}
        </AppText>
      ) : null}
      {me.isError ? (
        <AppText tone="warn" style={styles.body}>
          {messageForError(me.error)}
        </AppText>
      ) : null}
      <View style={styles.cta}>
        <CtaButton label="Cerrar sesión" onPress={() => void signOut()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, textAlign: "center" },
  body: { marginTop: 8, textAlign: "center" },
  cta: { marginTop: 24, width: "100%" },
});
