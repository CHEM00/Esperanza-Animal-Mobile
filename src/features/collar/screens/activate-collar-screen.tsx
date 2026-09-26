import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { formatRemaining } from "@/core/i18n/format";
import { APP_ROUTES } from "@/core/navigation/links";
import { useTheme } from "@/core/theme/use-theme";
import { PETS_STRINGS } from "@/features/pets/strings";
import { RequireSession } from "@/features/shell/components/require-session";
import { AppText } from "@/shared/ui/app-text";
import { Card } from "@/shared/ui/card";
import { CtaButton } from "@/shared/ui/cta-button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { ListRow } from "@/shared/ui/list-row";
import { LoadingView } from "@/shared/ui/loading-view";
import { ScrollScreen } from "@/shared/ui/scroll-screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { useActivation } from "../hooks/use-activation";
import { COLLAR_STRINGS } from "../strings";

/**
 * M4 · Activar collar (RF-E3): guía de acercamiento, elección de mascota y
 * vínculo. Con `preselectedPetId` (desde el perfil) la lectura verificada
 * vincula directo; con `initialScan` (desde un enlace universal) se salta la
 * lectura.
 */
interface ActivateCollarScreenProps {
  preselectedPetId: string | null;
  initialScan: { token: string; expiresAt: string } | null;
}

export function ActivateCollarScreen(props: ActivateCollarScreenProps) {
  return (
    <RequireSession reason={COLLAR_STRINGS.activation.signIn}>
      <Activation {...props} />
    </RequireSession>
  );
}

const S = COLLAR_STRINGS.activation;
/** Refresco del «la lectura vale N min» mientras se elige mascota. */
const REMAINING_TICK_MS = 15 * 1000;

function Activation({ preselectedPetId, initialScan }: ActivateCollarScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const activation = useActivation(preselectedPetId, initialScan);
  const { state, pets, eligiblePets } = activation;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (state.step !== "resolved") {
      return;
    }
    const timer = setInterval(() => setNow(new Date()), REMAINING_TICK_MS);
    return () => clearInterval(timer);
  }, [state.step]);

  if (pets.isPending) {
    return <LoadingView />;
  }

  if (state.step === "done") {
    const pet = pets.data?.find((candidate) => candidate.id === state.petId);
    return (
      <ScrollScreen>
        <EmptyState
          icon={<AppText style={styles.emoji}>🎉</AppText>}
          title={S.done.title}
          body={S.done.body(pet?.name ?? "")}
          actionLabel={S.done.viewPet}
          onAction={() => router.replace(APP_ROUTES.pet(state.petId))}
          testID="activation-done"
        />
      </ScrollScreen>
    );
  }

  if (eligiblePets.length === 0 && !preselectedPetId) {
    return (
      <ScrollScreen>
        <EmptyState
          title={S.noPets.title}
          body={S.noPets.body}
          actionLabel={S.noPets.action}
          onAction={() => router.push(APP_ROUTES.petNew)}
        />
        <AppText variant="caption" tone="faint" style={styles.centered}>
          {S.onlyOwner}
        </AppText>
      </ScrollScreen>
    );
  }

  const resolved = state.step === "resolved" || state.step === "activating";

  return (
    <ScrollScreen>
      <Card>
        <AppText variant="heading">{S.step1.title}</AppText>
        <AppText tone="muted" style={styles.body}>
          {S.step1.body}
        </AppText>
        <View style={styles.actions}>
          {state.step === "reading" ? (
            <>
              <LoadingView label={S.reading} />
              <SecondaryButton label={COLLAR_STRINGS.scan.cancel} onPress={() => void activation.cancelRead()} />
            </>
          ) : resolved ? (
            <>
              <ErrorBanner message={S.resolved} tone="warn" />
              {state.step === "resolved" ? (
                <AppText variant="caption" tone="muted" style={styles.centered}>
                  {S.expiresIn(formatRemaining(new Date(state.expiresAt), now))}
                </AppText>
              ) : null}
            </>
          ) : (
            <>
              {state.step === "idle" && state.error ? (
                <ErrorBanner message={state.error === "expired" ? S.expired : state.error} />
              ) : null}
              {state.step === "unsupported" ? (
                <>
                  <ErrorBanner
                    message={state.reason === "disabled" ? COLLAR_STRINGS.scan.disabled : COLLAR_STRINGS.scan.unsupported}
                    tone="warn"
                  />
                  {state.reason === "disabled" ? (
                    <SecondaryButton label={COLLAR_STRINGS.scan.openSettings} onPress={() => void activation.openNfcSettings()} />
                  ) : null}
                </>
              ) : null}
              {state.step === "not_collar" ? <ErrorBanner message={COLLAR_STRINGS.scan.notUrl} tone="warn" /> : null}
              {state.step === "rejected" ? (
                <ErrorBanner
                  message={
                    state.view === "FINDER" || state.view === "GUARDIAN"
                      ? S.notActivatable.ACTIVO
                      : state.tagStatus
                        ? S.notActivatable[state.tagStatus]
                        : S.notActivatable.unknown
                  }
                  tone="warn"
                />
              ) : null}
              <CtaButton label={S.read} onPress={() => void activation.startRead()} />
            </>
          )}
        </View>
      </Card>

      {!preselectedPetId ? (
        <Card style={!resolved && styles.dimmed}>
          <AppText variant="heading">{S.step2.title}</AppText>
          <AppText tone="muted" style={styles.body}>
            {S.step2.body}
          </AppText>
          {resolved ? (
            <View style={styles.pets}>
              <AppText variant="label">{S.choosePet}</AppText>
              {eligiblePets.map((pet) => {
                const selected = state.petId === pet.id;
                return (
                  <ListRow
                    key={pet.id}
                    testID="pet-option"
                    title={pet.name}
                    subtitle={`${PETS_STRINGS.speciesEmoji[pet.species]} ${pet.speciesDetail ?? PETS_STRINGS.species[pet.species]}`}
                    onPress={() => activation.pickPet(pet.id)}
                    trailing={
                      <View
                        style={[
                          styles.radio,
                          { borderColor: selected ? theme.colors.primary : theme.colors.lineStrong },
                          selected && { backgroundColor: theme.colors.primary },
                        ]}
                      />
                    }
                  />
                );
              })}
              <AppText variant="caption" tone="faint">
                {S.onlyOwner}
              </AppText>
            </View>
          ) : null}
        </Card>
      ) : null}

      {resolved ? (
        <View style={styles.actions}>
          {state.step === "resolved" && state.error ? <ErrorBanner message={state.error} /> : null}
          <CtaButton
            label={
              state.step === "activating"
                ? S.activating
                : S.activate(eligiblePets.find((pet) => pet.id === state.petId)?.name ?? pets.data?.find((pet) => pet.id === state.petId)?.name ?? "")
            }
            loading={state.step === "activating"}
            disabled={!state.petId}
            onPress={activation.activate}
          />
        </View>
      ) : null}
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 6 },
  actions: { marginTop: 14, gap: 10 },
  centered: { textAlign: "center" },
  dimmed: { opacity: 0.55 },
  pets: { marginTop: 12, gap: 6 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
  emoji: { fontSize: 44, lineHeight: 52 },
});
