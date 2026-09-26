import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { appConfig } from "@/core/config";
import { APP_ROUTES, hrefForDeepLink, resolveDeepLink } from "@/core/navigation/links";
import { useTheme } from "@/core/theme/use-theme";
import { AUTH_STRINGS } from "@/features/auth/strings";
import { SHELL_STRINGS } from "@/features/shell/strings";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { LoadingView } from "@/shared/ui/loading-view";
import { Screen } from "@/shared/ui/screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { useScanResolution } from "../hooks/use-scan-resolution";
import { parseScanUrl, scanRouteParamsFrom, scanUrlFromRouteParams, type RawRouteParams } from "../scan-url";
import { COLLAR_STRINGS } from "../strings";

/**
 * Resolución de una URL de collar (docs/06 §5 y §8): llega por enlace
 * universal (`/t?p&m`, `/q/{code}`) o por lectura NFC/QR dentro de la app.
 * Una URL, tres vistas: navega a finder, al perfil propio o a la activación;
 * si no hay nada que mostrar, pantalla neutra.
 */
export function ScanResolverScreen({ params }: { params: RawRouteParams }) {
  const theme = useTheme();
  const router = useRouter();
  const authenticated = useIsAuthenticated();
  const domains = useMemo(() => ({ linkDomain: appConfig.linkDomain, scheme: appConfig.scheme }), []);
  const url = useMemo(
    () => scanUrlFromRouteParams(scanRouteParamsFrom(params), appConfig.linkDomain),
    [params],
  );
  const parsed = useMemo(
    () =>
      url
        ? parseScanUrl(url, domains, (candidate) => {
            const link = resolveDeepLink(candidate, domains);
            return link ? hrefForDeepLink(link) : null;
          })
        : null,
    [domains, url],
  );
  const resolution = useScanResolution(parsed);

  useEffect(() => {
    if (parsed?.kind === "other") {
      router.replace(parsed.href as never);
      return;
    }
    if (resolution.status !== "ready") {
      return;
    }
    const { navigation, petId } = resolution;
    if (navigation.kind === "finder") {
      router.replace(APP_ROUTES.finder(navigation.token));
    } else if (navigation.kind === "guardian" && petId) {
      router.replace(APP_ROUTES.pet(petId));
    } else if (navigation.kind === "activation") {
      router.replace(APP_ROUTES.collarActivateWithScan(navigation.token, navigation.expiresAt) as never);
    }
  }, [parsed, resolution, router]);

  const S = COLLAR_STRINGS;

  if (!url || parsed?.kind === "invalid") {
    return (
      <Neutral title={S.neutral.title} body={S.resolver.invalidUrl(SHELL_STRINGS.appName)} onClose={() => router.replace(APP_ROUTES.feed)} />
    );
  }

  if (resolution.status === "error") {
    return (
      <Screen centered>
        <PawIcon size={48} color={theme.colors.primary} />
        <AppText variant="title" style={styles.title}>
          {S.resolver.title}
        </AppText>
        <View style={styles.block}>
          <ErrorBanner message={resolution.message} />
          <SecondaryButton label={S.resolver.close} onPress={() => router.replace(APP_ROUTES.feed)} />
        </View>
      </Screen>
    );
  }

  if (resolution.status === "ready" && resolution.navigation.kind === "neutral") {
    const collarReadyForOwner = resolution.resolution.tagStatus === "LISTO" && !authenticated;
    return (
      <Neutral
        title={S.neutral.title}
        body={collarReadyForOwner ? S.neutral.inactive : resolution.navigation.reason === "inactive" ? S.neutral.inactive : S.neutral.body(SHELL_STRINGS.appName)}
        onClose={() => router.replace(APP_ROUTES.feed)}
        secondaryLabel={collarReadyForOwner ? AUTH_STRINGS.title : undefined}
        onSecondary={collarReadyForOwner ? () => router.push(APP_ROUTES.login) : undefined}
      />
    );
  }

  return (
    <Screen centered>
      <PawIcon size={48} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {S.resolver.title}
      </AppText>
      <LoadingView
        label={
          resolution.status === "ready" && resolution.navigation.kind === "guardian" ? S.resolver.guardianLoading : S.resolver.verifying
        }
      />
    </Screen>
  );
}

interface NeutralProps {
  title: string;
  body: string;
  onClose: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/** Pantalla neutra del collar: no revela nada del tag ni de la mascota. */
export function Neutral({ title, body, onClose, secondaryLabel, onSecondary }: NeutralProps) {
  const theme = useTheme();
  return (
    <Screen centered>
      <PawIcon size={56} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      <AppText tone="muted" style={styles.body}>
        {body}
      </AppText>
      <View style={styles.block}>
        {secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} /> : null}
        <CtaButton label={COLLAR_STRINGS.neutral.viewFeed} onPress={onClose} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, textAlign: "center" },
  body: { marginTop: 8, textAlign: "center" },
  block: { marginTop: 24, width: "100%", gap: 12 },
});
