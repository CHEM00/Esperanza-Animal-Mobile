import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { APP_ROUTES } from "@/core/navigation/links";
import type { NativeIdentityProviderId } from "@/core/ports/identity-provider";
import { useTheme } from "@/core/theme/use-theme";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { Screen } from "@/shared/ui/screen";
import { ProviderButton } from "../components/provider-button";
import { AUTH_STRINGS } from "../strings";
import { useSignIn } from "../use-sign-in";

/**
 * 3b · Login. Un proveedor aparece solo si el backend lo tiene habilitado
 * (configuración remota) y el dispositivo lo soporta (proveedores nativos).
 * Microsoft por navegador del sistema llega con el plugin Expo de Better
 * Auth en una sección posterior.
 */
export function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const remoteConfig = useRemoteConfig();
  const { available, busy, message, signIn } = useSignIn();

  const enabledByBackend = new Set(remoteConfig.data?.oauthProviders ?? []);
  const providers: NativeIdentityProviderId[] = (available ?? []).filter((id) =>
    enabledByBackend.has(id),
  );
  const resolved = available !== null && !remoteConfig.isPending;

  async function handleSignIn(provider: NativeIdentityProviderId) {
    const outcome = await signIn(provider);
    if (outcome.status === "signed-in") {
      router.replace(APP_ROUTES.feed);
    }
  }

  return (
    <Screen centered>
      <PawIcon size={56} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {AUTH_STRINGS.title}
      </AppText>
      <AppText tone="muted" style={styles.subtitle}>
        {AUTH_STRINGS.subtitle}
      </AppText>

      <View style={styles.providers}>
        {providers.map((provider) => (
          <ProviderButton
            key={provider}
            provider={provider}
            loading={busy === provider}
            disabled={busy !== null}
            onPress={() => void handleSignIn(provider)}
          />
        ))}
        {resolved && providers.length === 0 ? (
          <AppText tone="muted" style={styles.note}>
            {AUTH_STRINGS.noProviders}
          </AppText>
        ) : null}
      </View>

      {message ? (
        <AppText tone="warn" style={styles.note}>
          {message}
        </AppText>
      ) : null}

      <View
        style={[
          styles.privacy,
          { backgroundColor: theme.colors.primaryTint, borderRadius: theme.radii.field },
        ]}
      >
        <AppText variant="caption" style={{ color: theme.colors.privacyInk }}>
          {AUTH_STRINGS.privacyNote}
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace(APP_ROUTES.feed)}
        style={styles.skip}
      >
        <AppText variant="label" tone="primary">
          {AUTH_STRINGS.skip}
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, textAlign: "center" },
  subtitle: { marginTop: 8, textAlign: "center" },
  providers: { width: "100%", marginTop: 28, gap: 12 },
  note: { marginTop: 12, textAlign: "center" },
  privacy: { width: "100%", marginTop: 20, padding: 12 },
  skip: { marginTop: 24, paddingVertical: 8 },
});
