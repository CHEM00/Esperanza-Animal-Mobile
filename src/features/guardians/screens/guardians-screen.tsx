import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { shareSheet } from "@/core/device";
import { messageForError } from "@/core/errors/problem-messages";
import { formatRelative, formatRemaining } from "@/core/i18n/format";
import { useMe } from "@/features/account/use-me";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { usePet } from "@/features/pets/hooks/use-pets";
import { RequireSession } from "@/features/shell/components/require-session";
import { AppText } from "@/shared/ui/app-text";
import { Card } from "@/shared/ui/card";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { ListRow } from "@/shared/ui/list-row";
import { LoadingView } from "@/shared/ui/loading-view";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ScrollScreen } from "@/shared/ui/scroll-screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { SectionTitle } from "@/shared/ui/section-title";
import { Sheet } from "@/shared/ui/sheet";
import { useGuardianActions, useGuardians } from "../hooks/use-guardians";
import type { Guardian, InviteLink, TransferLink } from "../repository";
import { GUARDIANS_STRINGS } from "../strings";

/** M8 · Guardianes: lista, invitar por enlace, quitar, transferir (RF-D1 a RF-D4). */
export function GuardiansScreen({ petId }: { petId: string }) {
  return (
    <RequireSession>
      <Guardians petId={petId} />
    </RequireSession>
  );
}

const S = GUARDIANS_STRINGS.screen;

type LinkSheet = { kind: "invite"; link: InviteLink } | { kind: "transfer"; link: TransferLink } | null;

function Guardians({ petId }: { petId: string }) {
  const pet = usePet(petId);
  const me = useMe();
  const guardians = useGuardians(petId);
  const remoteConfig = useRemoteConfig();
  const actions = useGuardianActions(petId);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Guardian | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [sheet, setSheet] = useState<LinkSheet>(null);
  const [transferIntro, setTransferIntro] = useState(false);

  if (pet.isPending || guardians.isPending) {
    return <LoadingView />;
  }
  if (!pet.data || !guardians.data) {
    return (
      <ScrollScreen>
        <ErrorBanner message={messageForError(pet.error ?? guardians.error)} />
      </ScrollScreen>
    );
  }

  const isOwner = pet.data.role === "DUENO";
  const maxGuardians = remoteConfig.data?.limits.maxGuardiansPerPet ?? null;
  const guardianCount = guardians.data.filter((guardian) => guardian.role === "GUARDIAN").length;
  const limitReached = maxGuardians !== null && guardianCount >= maxGuardians;
  const myId = me.data?.user.id ?? null;
  const now = new Date();

  const showError = (error: unknown) => setMessage(messageForError(error));

  function shareLink(kind: "invite" | "transfer", url: string) {
    const text =
      kind === "invite" ? S.invite.shareMessage(pet.data?.name ?? "", url) : S.transfer.shareMessage(pet.data?.name ?? "", url);
    void shareSheet.share({ message: text });
  }

  async function copyLink(url: string) {
    await shareSheet.copy(url);
    setNotice(S.invite.copied);
  }

  return (
    <>
      <ScrollScreen refreshing={guardians.isRefetching} onRefresh={() => void guardians.refetch()}>
        {maxGuardians !== null ? <AppText tone="muted">{S.intro(maxGuardians)}</AppText> : null}
        <ErrorBanner message={message} />
        {notice ? <ErrorBanner message={notice} tone="warn" /> : null}

        <Card>
          {guardians.data.map((guardian) => {
            const isMe = guardian.userId === myId;
            const canRemove = isOwner && guardian.role === "GUARDIAN";
            const canLeave = !isOwner && isMe;
            return (
              <ListRow
                key={guardian.userId}
                title={guardian.name}
                subtitle={`${S.role[guardian.role]} · ${S.since(formatRelative(new Date(guardian.since), now))}`}
                trailing={
                  canRemove ? (
                    <SecondaryButton label={S.remove} compact tone="danger" onPress={() => setRemoving(guardian)} />
                  ) : canLeave ? (
                    <SecondaryButton label={S.leave} compact tone="danger" onPress={() => setLeaving(true)} />
                  ) : null
                }
              />
            );
          })}
        </Card>

        {isOwner ? (
          <>
            <SectionTitle title={S.invite.action} />
            {limitReached ? (
              <AppText variant="caption" tone="muted">
                {S.invite.limit}
              </AppText>
            ) : (
              <CtaButton
                label={S.invite.action}
                loading={actions.invite.isPending}
                onPress={() => {
                  setMessage(null);
                  actions.invite.mutate(undefined, {
                    onSuccess: (link) => setSheet({ kind: "invite", link }),
                    onError: showError,
                  });
                }}
              />
            )}

            <SectionTitle title={S.transfer.title} hint={S.transfer.explain} />
            <View style={styles.transferActions}>
              <SecondaryButton label={S.transfer.action} onPress={() => setTransferIntro(true)} />
              <SecondaryButton
                label={S.transfer.cancel}
                tone="danger"
                loading={actions.cancelTransfer.isPending}
                onPress={() => {
                  setMessage(null);
                  actions.cancelTransfer.mutate(undefined, {
                    onSuccess: () => setNotice(S.transfer.cancelled),
                    onError: showError,
                  });
                }}
              />
            </View>
          </>
        ) : (
          <AppText variant="caption" tone="faint" style={styles.ownerOnly}>
            {S.ownerOnly}
          </AppText>
        )}
      </ScrollScreen>

      <ConfirmDialog
        visible={removing !== null}
        title={S.removeConfirm.title(removing?.name ?? "")}
        body={S.removeConfirm.body}
        confirmLabel={S.removeConfirm.confirm}
        cancelLabel={S.removeConfirm.cancel}
        onConfirm={() =>
          removing &&
          actions.remove.mutate(removing.userId, { onSuccess: () => setRemoving(null), onError: showError })
        }
        onCancel={() => setRemoving(null)}
        busy={actions.remove.isPending}
      />

      <ConfirmDialog
        visible={leaving}
        title={S.leaveConfirm.title}
        body={S.leaveConfirm.body}
        confirmLabel={S.leaveConfirm.confirm}
        cancelLabel={S.leaveConfirm.cancel}
        onConfirm={() =>
          myId && actions.remove.mutate(myId, { onSuccess: () => setLeaving(false), onError: showError })
        }
        onCancel={() => setLeaving(false)}
        busy={actions.remove.isPending}
      />

      <ConfirmDialog
        visible={transferIntro}
        title={S.transfer.title}
        body={S.transfer.explain}
        emblem="🤝"
        confirmLabel={S.transfer.action}
        cancelLabel={S.removeConfirm.cancel}
        onConfirm={() =>
          actions.transfer.mutate(undefined, {
            onSuccess: (link) => {
              setTransferIntro(false);
              setSheet({ kind: "transfer", link });
            },
          })
        }
        onCancel={() => setTransferIntro(false)}
        busy={actions.transfer.isPending}
        error={actions.transfer.isError ? messageForError(actions.transfer.error) : null}
      />

      <Sheet
        visible={sheet !== null}
        onClose={() => setSheet(null)}
        title={sheet?.kind === "transfer" ? S.transfer.title : S.invite.title}
      >
        {sheet ? (
          <>
            <AppText tone="muted">
              {sheet.kind === "invite"
                ? S.invite.body(formatRemaining(new Date(sheet.link.expiresAt), now))
                : S.transfer.body(formatRemaining(new Date(sheet.link.expiresAt), now))}
            </AppText>
            <AppText variant="caption" tone="faint" selectable>
              {sheet.link.url}
            </AppText>
            <CtaButton label={S.invite.share} onPress={() => shareLink(sheet.kind, sheet.link.url)} />
            <SecondaryButton label={S.invite.copy} onPress={() => void copyLink(sheet.link.url)} />
          </>
        ) : null}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  transferActions: { gap: 10 },
  ownerOnly: { marginTop: 12, textAlign: "center" },
});
