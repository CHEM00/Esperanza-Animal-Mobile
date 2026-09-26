import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { isApiError } from "@/core/api/problem";
import { messageForError } from "@/core/errors/problem-messages";
import { formatPhoneDisplay } from "@/core/i18n/format";
import { APP_ROUTES } from "@/core/navigation/links";
import { useTheme } from "@/core/theme/use-theme";
import { PETS_STRINGS } from "@/features/pets/strings";
import { SHELL_STRINGS } from "@/features/shell/strings";
import { AppText } from "@/shared/ui/app-text";
import { PawIcon } from "@/shared/ui/brand/paw-icon";
import { Card } from "@/shared/ui/card";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { LoadingView } from "@/shared/ui/loading-view";
import { ScrollScreen } from "@/shared/ui/scroll-screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { TextField } from "@/shared/ui/text-field";
import { ContactButtons } from "../components/contact-buttons";
import { PetPublicCard } from "../components/pet-public-card";
import { useFinderReport, useScanPreview } from "../hooks/use-finder";
import type { FinderReportResult, ScanPreview } from "../repository";
import { COLLAR_STRINGS } from "../strings";

/**
 * M6 · Vista de finder en la app (RF-F3, RF-F4, RF-F9, ADR-010): idéntica en
 * contenido a la web. El servidor decidió la vista al abrir la sesión; aquí
 * solo se pinta según `preview.view`.
 */
export function FinderScreen({ token }: { token: string }) {
  const theme = useTheme();
  const router = useRouter();
  const preview = useScanPreview(token);
  const S = COLLAR_STRINGS.finder;

  if (preview.isPending) {
    return <LoadingView label={COLLAR_STRINGS.resolver.verifying} />;
  }

  if (preview.isError) {
    const consumed = isApiError(preview.error) && preview.error.code === "scan.token_invalid";
    return (
      <ScrollScreen>
        <Header />
        <Card>
          <AppText variant="title" style={styles.centered}>
            {consumed ? S.consumed.title : COLLAR_STRINGS.neutral.title}
          </AppText>
          <AppText tone="muted" style={[styles.centered, styles.spaced]}>
            {consumed ? S.consumed.default : messageForError(preview.error)}
          </AppText>
        </Card>
        <CtaButton label={S.viewFeed} onPress={() => router.replace(APP_ROUTES.feed)} />
      </ScrollScreen>
    );
  }

  return (
    <ScrollScreen>
      <Header />
      <PreviewBody token={token} preview={preview.data} />
      <View style={styles.footer}>
        <Pressable accessibilityRole="button" onPress={() => router.replace(APP_ROUTES.feed)}>
          <AppText variant="label" tone="primary" style={styles.centered}>
            {S.viewFeed}
          </AppText>
        </Pressable>
        <PawIcon size={18} color={theme.colors.faint} />
      </View>
    </ScrollScreen>
  );
}

function Header() {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <PawIcon size={22} color={theme.colors.primary} />
      <AppText variant="label" tone="primary">
        {SHELL_STRINGS.appName}
      </AppText>
    </View>
  );
}

function PreviewBody({ token, preview }: { token: string; preview: ScanPreview }) {
  const router = useRouter();
  const authenticated = useIsAuthenticated();
  const S = COLLAR_STRINGS.finder;

  if (preview.view === "ACTIVATION") {
    return (
      <Card>
        <AppText variant="title" style={styles.centered}>
          {COLLAR_STRINGS.activation.title}
        </AppText>
        <AppText tone="muted" style={[styles.centered, styles.spaced]}>
          {authenticated ? COLLAR_STRINGS.activation.resolved : COLLAR_STRINGS.neutral.inactive}
        </AppText>
        {authenticated ? (
          <View style={styles.spaced}>
            <CtaButton
              label={COLLAR_STRINGS.activation.title}
              onPress={() => router.replace(APP_ROUTES.collarActivateWithScan(token, preview.expiresAt) as never)}
            />
          </View>
        ) : null}
      </Card>
    );
  }

  if (!preview.pet) {
    return (
      <Card>
        <AppText variant="title" style={styles.centered}>
          {COLLAR_STRINGS.neutral.title}
        </AppText>
        <AppText tone="muted" style={[styles.centered, styles.spaced]}>
          {S.noPet}
        </AppText>
      </Card>
    );
  }

  if (preview.view === "GUARDIAN") {
    return (
      <>
        <ErrorBanner message={S.guardianNote} tone="warn" />
        <PetPublicCard pet={preview.pet} />
        {preview.petId ? (
          <SecondaryButton label={PETS_STRINGS.profile.actions.collarDetails} onPress={() => router.replace(APP_ROUTES.pet(preview.petId as string))} />
        ) : null}
      </>
    );
  }

  const contactAllowed = preview.trustLevel === "NFC_VERIFICADO";
  return (
    <>
      {!contactAllowed ? <ErrorBanner message={S.unverified} tone="warn" /> : null}
      <PetPublicCard pet={preview.pet} />
      <FinderReportForm token={token} petName={preview.pet.name} contactAllowed={contactAllowed} />
    </>
  );
}

interface FinderReportFormProps {
  token: string;
  petName: string;
  contactAllowed: boolean;
}

function FinderReportForm({ token, petName, contactAllowed }: FinderReportFormProps) {
  const theme = useTheme();
  const finder = useFinderReport(token, contactAllowed);
  const S = COLLAR_STRINGS.finder.form;
  const { draft } = finder;

  if (finder.report.isSuccess) {
    return <SentCard result={finder.report.data} petName={petName} contactAllowed={contactAllowed} />;
  }

  const phoneDigits = draft.phone.replace(/\D/g, "");
  const phoneInvalid = contactAllowed && phoneDigits.length > 0 && finder.phoneLength !== null && phoneDigits.length !== finder.phoneLength;

  return (
    <Card>
      <AppText variant="heading">{S.title(petName)}</AppText>
      <AppText variant="caption" tone="muted" style={styles.spacedSmall}>
        {S.intro}
      </AppText>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: draft.shareLocation }}
        onPress={() => void finder.toggleLocation(!draft.shareLocation)}
        style={[styles.consent, { borderColor: theme.colors.line, borderRadius: theme.radii.field }]}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: theme.colors.primary },
            draft.shareLocation && { backgroundColor: theme.colors.primary },
          ]}
        />
        <AppText variant="caption" tone="muted" style={styles.consentText}>
          <AppText variant="caption" style={{ color: theme.colors.ink, fontFamily: theme.fonts.body.bold }}>
            {S.shareLocation}
          </AppText>
          {` ${S.shareLocationHint}`}
          {finder.locating ? ` ${S.locating}` : draft.point ? ` ${S.located}` : ""}
        </AppText>
      </Pressable>
      <ErrorBanner message={finder.locationError} tone="warn" />

      <View style={styles.spaced}>
        <TextField
          label={S.message}
          placeholder={S.messagePlaceholder}
          value={draft.message}
          onChangeText={(message) => finder.edit({ message })}
          maxLength={finder.messageMaxLength ?? undefined}
          multiline
        />
      </View>

      <View style={[styles.row, styles.spaced]}>
        <SecondaryButton label={draft.photo ? S.photoAttached : S.photo} compact onPress={() => void finder.attachPhoto()} />
        {contactAllowed ? (
          <View style={styles.phone}>
            <TextField
              label={S.phone}
              placeholder={S.phone}
              value={draft.phone}
              onChangeText={(phone) => finder.edit({ phone })}
              keyboardType="phone-pad"
              error={phoneInvalid && finder.phoneLength ? S.phoneError(finder.phoneLength) : null}
            />
          </View>
        ) : null}
      </View>
      <ErrorBanner message={finder.photoError} tone="warn" />

      <AppText variant="caption" tone="faint" style={styles.spacedSmall}>
        {contactAllowed ? S.contactNote : S.unverifiedNote}
      </AppText>

      {finder.report.isError ? (
        <View style={styles.spacedSmall}>
          <ErrorBanner message={messageForError(finder.report.error)} />
        </View>
      ) : null}

      <View style={styles.spaced}>
        <CtaButton
          label={finder.report.isPending ? S.submitting : S.submit}
          loading={finder.report.isPending}
          disabled={phoneInvalid}
          onPress={finder.submit}
        />
      </View>
    </Card>
  );
}

function SentCard({ result, petName, contactAllowed }: { result: FinderReportResult; petName: string; contactAllowed: boolean }) {
  const S = COLLAR_STRINGS.finder.sent;
  return (
    <Card testID="finder-sent">
      <AppText style={[styles.emoji, styles.centered]}>🎉</AppText>
      <AppText variant="heading" style={styles.centered}>
        {S.title}
      </AppText>
      <AppText tone="muted" style={[styles.centered, styles.spacedSmall]}>
        {S.body(petName)}
        {contactAllowed ? S.contact : S.noContact}
      </AppText>
      {result.ownerPhone ? (
        <View style={styles.spaced}>
          <AppText variant="caption" tone="muted" style={styles.centered}>
            {`${COLLAR_STRINGS.publicCard.family} ${formatPhoneDisplay(result.ownerPhone)}`}
          </AppText>
          <View style={styles.spacedSmall}>
            <ContactButtons phone={result.ownerPhone} petName={petName} />
          </View>
        </View>
      ) : null}
      <AppText variant="caption" tone="faint" style={[styles.centered, styles.spaced]}>
        {S.safety}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  centered: { textAlign: "center" },
  spaced: { marginTop: 12 },
  spacedSmall: { marginTop: 6 },
  consent: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderWidth: 1.5, padding: 12, marginTop: 12 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, marginTop: 2 },
  consentText: { flex: 1 },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  phone: { flex: 1 },
  emoji: { fontSize: 34, lineHeight: 42 },
  footer: { alignItems: "center", gap: 10, marginTop: 8 },
});
