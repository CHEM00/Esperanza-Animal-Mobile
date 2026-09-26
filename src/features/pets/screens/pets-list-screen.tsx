import { useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { messageForError } from "@/core/errors/problem-messages";
import { APP_ROUTES } from "@/core/navigation/links";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { RequireSession } from "@/features/shell/components/require-session";
import { AppText } from "@/shared/ui/app-text";
import { CtaButton } from "@/shared/ui/cta-button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { LoadingView } from "@/shared/ui/loading-view";
import { Screen } from "@/shared/ui/screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { PetCard } from "../components/pet-card";
import { usePets } from "../hooks/use-pets";
import { PETS_STRINGS } from "../strings";

/** M1 · Mis mascotas: lista con estado y collar, alta y acceso a escanear. */
export function PetsListScreen() {
  return (
    <RequireSession title={PETS_STRINGS.list.title} reason={PETS_STRINGS.list.signInPrompt}>
      <PetsList />
    </RequireSession>
  );
}

function PetsList() {
  const router = useRouter();
  const pets = usePets();
  const remoteConfig = useRemoteConfig();
  const maxPets = remoteConfig.data?.limits.maxPetsPerUser ?? null;
  const owned = pets.data?.filter((pet) => pet.role === "DUENO" && pet.status !== "INACTIVA").length ?? 0;
  const limitReached = maxPets !== null && owned >= maxPets;

  if (pets.isPending) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={pets.data ?? []}
        keyExtractor={(pet) => pet.id}
        contentContainerStyle={styles.list}
        refreshing={pets.isRefetching}
        onRefresh={() => void pets.refetch()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          pets.isError ? <ErrorBanner message={messageForError(pets.error)} /> : null
        }
        ListEmptyComponent={
          pets.isError ? null : (
            <EmptyState
              title={PETS_STRINGS.list.empty.title}
              body={PETS_STRINGS.list.empty.body}
              actionLabel={PETS_STRINGS.list.empty.action}
              onAction={() => router.push(APP_ROUTES.petNew)}
              testID="pets-empty"
            />
          )
        }
        renderItem={({ item }) => <PetCard pet={item} onPress={() => router.push(APP_ROUTES.pet(item.id))} />}
        ListFooterComponent={
          <View style={styles.footer}>
            {(pets.data?.length ?? 0) > 0 ? (
              limitReached && maxPets !== null ? (
                <AppText variant="caption" tone="muted" style={styles.limit}>
                  {PETS_STRINGS.list.limitReached(maxPets)}
                </AppText>
              ) : (
                <CtaButton label={PETS_STRINGS.list.add} onPress={() => router.push(APP_ROUTES.petNew)} />
              )
            ) : null}
            <SecondaryButton label={PETS_STRINGS.list.scanCollar} onPress={() => router.push(APP_ROUTES.collarScan)} />
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  list: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 32 },
  separator: { height: 10 },
  footer: { marginTop: 20, gap: 10 },
  limit: { textAlign: "center" },
});
