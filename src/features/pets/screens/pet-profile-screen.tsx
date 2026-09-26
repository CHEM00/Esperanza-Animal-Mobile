import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { messageForError } from "@/core/errors/problem-messages";
import { elapsedDays, formatLongDate, formatRelative, formatRemaining } from "@/core/i18n/format";
import { APP_ROUTES } from "@/core/navigation/links";
import { useTheme } from "@/core/theme/use-theme";
import { PetPublicCard } from "@/features/collar/components/pet-public-card";
import { RequireSession } from "@/features/shell/components/require-session";
import { AppText } from "@/shared/ui/app-text";
import { Card } from "@/shared/ui/card";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { useContentWidth } from "@/shared/ui/layout";
import { ListRow } from "@/shared/ui/list-row";
import { LoadingView } from "@/shared/ui/loading-view";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { FieldLabel } from "@/shared/ui/field-label";
import { ScrollScreen } from "@/shared/ui/scroll-screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { SectionTitle } from "@/shared/ui/section-title";
import { Sheet } from "@/shared/ui/sheet";
import { LostModeFlow } from "../components/lost-mode-flow";
import { PetChangesList } from "../components/pet-changes-list";
import { PetStatusBadge } from "../components/pet-status-badge";
import { useConfirmFound, useDeletePet } from "../hooks/use-pet-mutations";
import { usePet, usePetChanges, usePetPublicPreview } from "../hooks/use-pets";
import type { PetDetail } from "../repository";
import { PETS_STRINGS } from "../strings";

/** M2 · Perfil de mascota: fotos, datos, estado y acciones (RF-C4 a RF-C7, RF-F6). */
export function PetProfileScreen({ petId }: { petId: string }) {
  return (
    <RequireSession>
      <Profile petId={petId} />
    </RequireSession>
  );
}

const S = PETS_STRINGS.profile;
const GALLERY_HEIGHT = 240;

function Profile({ petId }: { petId: string }) {
  const pet = usePet(petId);
  if (pet.isPending) {
    return <LoadingView />;
  }
  if (!pet.data) {
    return (
      <ScrollScreen>
        <ErrorBanner message={pet.isError ? messageForError(pet.error) : S.notFound} />
      </ScrollScreen>
    );
  }
  return <ProfileContent pet={pet.data} refreshing={pet.isRefetching} onRefresh={() => void pet.refetch()} />;
}

interface ProfileContentProps {
  pet: PetDetail;
  refreshing: boolean;
  onRefresh: () => void;
}

function ProfileContent({ pet, refreshing, onRefresh }: ProfileContentProps) {
  const theme = useTheme();
  const router = useRouter();
  const contentWidth = useContentWidth();
  const isOwner = pet.role === "DUENO";
  const isInactive = pet.status === "INACTIVA";
  const [lostOpen, setLostOpen] = useState(false);
  const [foundOpen, setFoundOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [changesOpen, setChangesOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const confirmFound = useConfirmFound(pet.id);
  const deletePet = useDeletePet(pet.id);
  const preview = usePetPublicPreview(pet.id, previewOpen);
  const changes = usePetChanges(pet.id, changesOpen);

  const now = new Date();
  const mutedRemaining = pet.tag?.mutedUntil ? formatRemaining(new Date(pet.tag.mutedUntil), now) : "";

  function collarLine(): string {
    if (!pet.tag) {
      return S.collarStatus.none;
    }
    if (pet.tag.status === "EN_REVISION") {
      return S.collarStatus.inReview;
    }
    if (mutedRemaining) {
      return S.collarStatus.muted(mutedRemaining);
    }
    return pet.tag.activatedAt ? S.collarStatus.active(formatRelative(new Date(pet.tag.activatedAt), now)) : PETS_STRINGS.list.collar[pet.tag.status];
  }

  return (
    <>
      <ScrollScreen refreshing={refreshing} onRefresh={onRefresh}>
        {pet.photos.length > 0 ? (
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={pet.photos}
            keyExtractor={(photo) => photo.id}
            style={[styles.gallery, { borderRadius: theme.radii.card }]}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.url }}
                style={[styles.galleryPhoto, { width: contentWidth }]}
                contentFit="cover"
                accessibilityLabel={`Foto de ${pet.name}`}
              />
            )}
          />
        ) : (
          <View style={[styles.gallery, styles.galleryEmpty, { backgroundColor: theme.colors.tabTrack, borderRadius: theme.radii.card }]}>
            <AppText style={styles.emoji}>{PETS_STRINGS.speciesEmoji[pet.species]}</AppText>
          </View>
        )}

        <View style={styles.titleRow}>
          <AppText variant="title" style={styles.name} numberOfLines={2}>
            {pet.name}
          </AppText>
          <PetStatusBadge status={pet.status} testID="pet-status" />
        </View>
        <AppText variant="caption" tone="muted">
          {`${PETS_STRINGS.speciesEmoji[pet.species]} ${pet.speciesDetail ?? PETS_STRINGS.species[pet.species]} · ${PETS_STRINGS.sex[pet.sex]}`}
        </AppText>
        {pet.status === "PERDIDA" && pet.lostSince ? (
          <AppText variant="label" style={{ color: theme.colors.alert }}>
            {S.lostSince(elapsedDays(new Date(pet.lostSince), now))}
          </AppText>
        ) : null}

        <ErrorBanner message={message} />

        {!isInactive ? (
          <View style={styles.actions}>
            {pet.status === "EN_CASA" ? (
              <CtaButton label={S.actions.markLost} onPress={() => setLostOpen(true)} />
            ) : (
              <>
                <CtaButton label={S.actions.markFound} onPress={() => setFoundOpen(true)} />
                {pet.activeCaseId ? (
                  <SecondaryButton label={S.actions.viewCase} onPress={() => router.push(APP_ROUTES.publication(pet.activeCaseId as string))} />
                ) : null}
              </>
            )}
          </View>
        ) : null}

        <SectionTitle title={S.sections.collar} />
        <Card>
          <AppText tone="muted">{collarLine()}</AppText>
          <View style={styles.cardActions}>
            {pet.tag ? (
              <SecondaryButton label={S.actions.collarDetails} onPress={() => router.push(APP_ROUTES.petScans(pet.id))} />
            ) : isOwner && !isInactive ? (
              <SecondaryButton label={S.actions.activateCollar} onPress={() => router.push(APP_ROUTES.collarActivate(pet.id))} />
            ) : null}
          </View>
        </Card>

        <SectionTitle title={S.sections.about} />
        <Card>
          <Field label={S.fields.description} value={pet.description} />
          <Field label={S.fields.birthDate} value={pet.birthDate ? formatLongDate(new Date(pet.birthDate)) : null} />
          <Field
            label={S.fields.sterilized}
            value={pet.sterilized === null ? null : pet.sterilized ? S.sterilized.yes : S.sterilized.no}
          />
          <Field label={S.fields.microchip} value={pet.microchipCode} />
          <Field label={S.fields.medicalNotes} value={pet.medicalNotes} />
          <Field label={S.fields.publicCode} value={pet.publicCode} last />
        </Card>

        <SectionTitle title={S.sections.visibility} />
        <Card>
          <AppText tone="muted">{pet.showPhoneToFinder ? S.visibility.phone.on : S.visibility.phone.off}</AppText>
          <AppText tone="muted" style={styles.spaced}>
            {pet.showMedicalNotes ? S.visibility.notes.on : S.visibility.notes.off}
          </AppText>
          <View style={styles.cardActions}>
            <SecondaryButton label={S.actions.publicPreview} onPress={() => setPreviewOpen(true)} />
          </View>
        </Card>

        <SectionTitle title={S.sections.guardians} />
        <Card>
          {pet.guardians.map((guardian) => (
            <ListRow
              key={guardian.userId}
              title={guardian.name}
              subtitle={`${PETS_STRINGS.list.role[guardian.role]} · ${formatRelative(new Date(guardian.since), now)}`}
            />
          ))}
          <View style={styles.cardActions}>
            <SecondaryButton label={S.actions.guardians} onPress={() => router.push(APP_ROUTES.petGuardians(pet.id))} />
          </View>
        </Card>

        <SectionTitle title={S.sections.history} />
        <Card>
          <SecondaryButton label={S.actions.changes} onPress={() => setChangesOpen(true)} />
        </Card>

        {isOwner && !isInactive ? (
          <View style={styles.ownerActions}>
            <SecondaryButton label={S.actions.edit} onPress={() => router.push(APP_ROUTES.petEdit(pet.id))} />
            <SecondaryButton label={S.actions.deactivate} tone="danger" onPress={() => setDeactivateOpen(true)} />
          </View>
        ) : !isOwner ? (
          <AppText variant="caption" tone="faint" style={styles.guardianNote}>
            {S.guardianOnly}
          </AppText>
        ) : null}
      </ScrollScreen>

      <LostModeFlow
        pet={pet}
        visible={lostOpen}
        onClose={() => setLostOpen(false)}
        onViewCase={(publicationId) => router.push(APP_ROUTES.publication(publicationId))}
      />

      <ConfirmDialog
        visible={foundOpen}
        title={S.foundConfirm.title}
        body={S.foundConfirm.body}
        tone="primary"
        emblem="🎉"
        confirmLabel={S.foundConfirm.confirm}
        cancelLabel={S.foundConfirm.cancel}
        onConfirm={() =>
          confirmFound.mutate(undefined, {
            onSuccess: () => setFoundOpen(false),
            onError: (error) => setMessage(messageForError(error)),
          })
        }
        onCancel={() => setFoundOpen(false)}
        busy={confirmFound.isPending}
        error={confirmFound.isError ? messageForError(confirmFound.error) : null}
      />

      <ConfirmDialog
        visible={deactivateOpen}
        title={S.deactivateConfirm.title}
        body={S.deactivateConfirm.body}
        confirmLabel={S.deactivateConfirm.confirm}
        cancelLabel={S.deactivateConfirm.cancel}
        onConfirm={() =>
          deletePet.mutate(undefined, {
            onSuccess: () => {
              setDeactivateOpen(false);
              router.replace(APP_ROUTES.pets);
            },
          })
        }
        onCancel={() => setDeactivateOpen(false)}
        busy={deletePet.isPending}
        error={deletePet.isError ? messageForError(deletePet.error) : null}
      />

      <Sheet visible={previewOpen} onClose={() => setPreviewOpen(false)} title={S.previewTitle}>
        <AppText variant="caption" tone="muted">
          {S.previewHint}
        </AppText>
        {preview.isPending ? <LoadingView /> : null}
        {preview.isError ? <ErrorBanner message={messageForError(preview.error)} /> : null}
        {preview.data ? <PetPublicCard pet={preview.data} /> : null}
      </Sheet>

      <Sheet visible={changesOpen} onClose={() => setChangesOpen(false)} title={S.changes.title}>
        {changes.isPending ? <LoadingView /> : null}
        {changes.isError ? <ErrorBanner message={messageForError(changes.error)} /> : null}
        {changes.data ? <PetChangesList changes={changes.data} /> : null}
      </Sheet>
    </>
  );
}

function Field({ label, value, last = false }: { label: string; value: string | null; last?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.field, !last && { borderBottomColor: theme.colors.line, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <FieldLabel>{label}</FieldLabel>
      <AppText style={!value && { color: theme.colors.faint }}>{value ?? S.empty}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  gallery: { height: GALLERY_HEIGHT, width: "100%", overflow: "hidden" },
  galleryPhoto: { height: GALLERY_HEIGHT },
  galleryEmpty: { alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 72, lineHeight: 84 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 4 },
  name: { flex: 1, fontSize: 26, lineHeight: 30 },
  actions: { gap: 10, marginTop: 6 },
  cardActions: { marginTop: 12, gap: 8 },
  spaced: { marginTop: 6 },
  field: { paddingVertical: 8, gap: 2 },
  ownerActions: { marginTop: 20, gap: 10 },
  guardianNote: { marginTop: 16, textAlign: "center" },
});
