import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { messageForError } from "@/core/errors/problem-messages";
import { APP_ROUTES } from "@/core/navigation/links";
import { useTheme } from "@/core/theme/use-theme";
import { AUTH_STRINGS } from "@/features/auth/strings";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { Card } from "@/shared/ui/card";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { LoadingView } from "@/shared/ui/loading-view";
import { Screen } from "@/shared/ui/screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { useAcceptLink, useLinkPreview } from "../hooks/use-guardians";
import type { LinkKind } from "../repository";
import { GUARDIANS_STRINGS } from "../strings";

/**
 * M9 · Aceptar invitación o transferencia por enlace profundo (RF-D2, RF-D4).
 * La vista previa es pública: primero se ve qué mascota es y si el enlace
 * sigue vigente; aceptar exige sesión. Misma lógica que el respaldo web.
 */
interface LinkAcceptScreenProps {
  kind: LinkKind;
  code: string;
}

export function LinkAcceptScreen({ kind, code }: LinkAcceptScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const authenticated = useIsAuthenticated();
  const preview = useLinkPreview(kind, code);
  const accept = useAcceptLink(kind, code);
  const S = GUARDIANS_STRINGS.link;
  const texts = S[kind];

  if (preview.isPending) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  if (preview.isError || !preview.data) {
    return (
      <Screen centered>
        <PawIcon size={48} color={theme.colors.primary} />
        <AppText variant="title" style={styles.title}>
          {S.invalid.title}
        </AppText>
        <AppText tone="muted" style={styles.body}>
          {S.invalid.body}
        </AppText>
        <View style={styles.cta}>
          <SecondaryButton label={S.goToPets} onPress={() => router.replace(APP_ROUTES.pets)} />
        </View>
      </Screen>
    );
  }

  const { petName, state } = preview.data;

  if (accept.isSuccess) {
    return (
      <Screen centered>
        <AppText style={styles.emoji}>🎉</AppText>
        <AppText variant="title" style={styles.title}>
          {texts.accepted(petName)}
        </AppText>
        <View style={styles.cta}>
          <CtaButton label={S.viewPet} onPress={() => router.replace(APP_ROUTES.pet(accept.data.petId))} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen centered>
      <PawIcon size={48} color={theme.colors.primary} />
      <AppText variant="title" style={styles.title}>
        {texts.title}
      </AppText>
      <Card style={styles.card}>
        <AppText variant="heading" style={styles.intro}>
          {texts.intro(petName)}
        </AppText>
        <AppText tone="muted" style={styles.body}>
          {texts.body}
        </AppText>
      </Card>
      {state !== "valida" ? (
        <View style={styles.cta}>
          <ErrorBanner message={S.state[state]} tone="warn" />
          <SecondaryButton label={S.goToPets} onPress={() => router.replace(APP_ROUTES.pets)} />
        </View>
      ) : authenticated ? (
        <View style={styles.cta}>
          <ErrorBanner message={accept.isError ? messageForError(accept.error) : null} />
          <CtaButton label={texts.accept} loading={accept.isPending} onPress={() => accept.mutate()} />
        </View>
      ) : (
        <View style={styles.cta}>
          <AppText tone="muted" style={styles.body}>
            {S.signIn}
          </AppText>
          <CtaButton label={AUTH_STRINGS.title} onPress={() => router.push(APP_ROUTES.login)} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 14, textAlign: "center" },
  body: { marginTop: 8, textAlign: "center" },
  intro: { textAlign: "center" },
  card: { marginTop: 18 },
  cta: { marginTop: 20, width: "100%", gap: 12 },
  emoji: { fontSize: 44, lineHeight: 52 },
});
