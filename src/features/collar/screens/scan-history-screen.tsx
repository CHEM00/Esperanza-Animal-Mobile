import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DeviceMapView } from "@/core/device";
import { messageForError } from "@/core/errors/problem-messages";
import { formatDateTime, formatHours, formatRelative, formatRemaining } from "@/core/i18n/format";
import { regionFittingPoints, type GeoPoint } from "@/core/map/region";
import type { MapMarker } from "@/core/ports/map-view";
import { useTheme } from "@/core/theme/use-theme";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { usePet } from "@/features/pets/hooks/use-pets";
import { RequireSession } from "@/features/shell/components/require-session";
import { AppText } from "@/shared/ui/app-text";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Chip } from "@/shared/ui/chip";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { LoadingView } from "@/shared/ui/loading-view";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ScrollScreen } from "@/shared/ui/scroll-screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { SectionTitle } from "@/shared/ui/section-title";
import { Sheet } from "@/shared/ui/sheet";
import { TAG_MUTE_HOUR_OPTIONS } from "../constants";
import { useMarkSuspicious, useScanHistory, useTagActions } from "../hooks/use-collar-controls";
import type { ScanHistoryItem } from "../repository";
import { COLLAR_STRINGS } from "../strings";

/** M7 · Historial de escaneos con mapa, marcar sospechoso, silenciar y desvincular (RF-E5, RF-F8). */
export function ScanHistoryScreen({ petId }: { petId: string }) {
  return (
    <RequireSession>
      <History petId={petId} />
    </RequireSession>
  );
}

const S = COLLAR_STRINGS.history;
const MAP_HEIGHT = 200;

function History({ petId }: { petId: string }) {
  const theme = useTheme();
  const pet = usePet(petId);
  const history = useScanHistory(petId);
  const remoteConfig = useRemoteConfig();
  const tagId = pet.data?.tag?.id ?? "";
  const tagActions = useTagActions(tagId, petId);
  const suspicious = useMarkSuspicious(petId);
  const [muteOpen, setMuteOpen] = useState(false);
  const [unlinkOpen, setUnlinkOpen] = useState(false);
  const [suspect, setSuspect] = useState<ScanHistoryItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const limits = remoteConfig.data?.limits ?? null;
  const [muteHours, setMuteHours] = useState<number | null>(null);

  const scans = useMemo(() => history.data?.pages.flatMap((page) => page.items) ?? [], [history.data]);
  const located = useMemo(
    () =>
      scans.filter(
        (scan): scan is ScanHistoryItem & { approxLat: number; approxLng: number } =>
          scan.approxLat !== null && scan.approxLng !== null,
      ),
    [scans],
  );
  const markers: MapMarker[] = located.map((scan) => ({
    id: scan.id,
    point: { lat: scan.approxLat, lng: scan.approxLng },
    kind: "scan",
    title: formatDateTime(new Date(scan.createdAt)),
  }));
  const region = useMemo(() => {
    const points: GeoPoint[] = located.map((scan) => ({ lat: scan.approxLat, lng: scan.approxLng }));
    return remoteConfig.data ? regionFittingPoints(points, remoteConfig.data.map.caseZoom) : null;
  }, [located, remoteConfig.data]);

  if (pet.isPending || history.isPending) {
    return <LoadingView />;
  }
  if (!pet.data) {
    return (
      <ScrollScreen>
        <ErrorBanner message={messageForError(pet.error)} />
      </ScrollScreen>
    );
  }

  const tag = pet.data.tag;
  const isOwner = pet.data.role === "DUENO";
  const now = new Date();
  const mutedRemaining = tag?.mutedUntil ? formatRemaining(new Date(tag.mutedUntil), now) : "";
  const muteOptions = TAG_MUTE_HOUR_OPTIONS.filter((hours) => !limits || hours <= limits.tagMuteMaxHours);
  const chosenHours = muteHours ?? limits?.tagMuteDefaultHours ?? muteOptions[0] ?? 0;
  const onError = (error: unknown) => setMessage(messageForError(error));

  return (
    <>
      <ScrollScreen refreshing={history.isRefetching} onRefresh={() => void history.refetch()}>
        <ErrorBanner message={message} />
        {notice ? <ErrorBanner message={notice} tone="warn" /> : null}

        <Card>
          {tag ? (
            <>
              <View style={styles.row}>
                <AppText variant="heading">{S.title}</AppText>
                <Badge label={S.status[tag.status]} tone={tag.status === "ACTIVO" ? "success" : tag.status === "EN_REVISION" ? "warn" : "muted"} />
              </View>
              {tag.activatedAt ? (
                <AppText variant="caption" tone="muted">
                  {S.activatedSince(formatRelative(new Date(tag.activatedAt), now))}
                </AppText>
              ) : null}
              {mutedRemaining ? (
                <AppText variant="label" style={styles.spacedSmall}>
                  {S.mute.active(mutedRemaining)}
                </AppText>
              ) : null}
              {isOwner ? (
                <View style={styles.actions}>
                  {mutedRemaining ? (
                    <SecondaryButton
                      label={S.mute.unmute}
                      loading={tagActions.unmute.isPending}
                      onPress={() => tagActions.unmute.mutate(undefined, { onError })}
                    />
                  ) : (
                    <SecondaryButton label={S.mute.title} onPress={() => setMuteOpen(true)} disabled={tag.status !== "ACTIVO"} />
                  )}
                  <SecondaryButton label={S.unlink.action} tone="danger" onPress={() => setUnlinkOpen(true)} />
                </View>
              ) : (
                <AppText variant="caption" tone="faint" style={styles.spacedSmall}>
                  {S.ownerOnly}
                </AppText>
              )}
            </>
          ) : (
            <AppText tone="muted">{COLLAR_STRINGS.activation.notActivatable.unknown}</AppText>
          )}
        </Card>

        {markers.length > 0 && region ? (
          <>
            <SectionTitle title={S.scans.mapTitle} hint={S.scans.mapHint} />
            <View style={[styles.map, { borderRadius: theme.radii.card }]}>
              <DeviceMapView region={region} markers={markers} testID="scan-map" />
            </View>
          </>
        ) : null}

        <SectionTitle title={S.scans.title} />
        {scans.length === 0 ? (
          <AppText tone="muted">{S.scans.empty}</AppText>
        ) : (
          scans.map((scan) => (
            <ScanItem
              key={scan.id}
              scan={scan}
              canMark={isOwner && scan.finderReport !== null && scan.finderReport.status !== "SOSPECHOSO" && tag?.status === "ACTIVO"}
              onMark={() => setSuspect(scan)}
            />
          ))
        )}
        {history.hasNextPage ? (
          <SecondaryButton label={S.scans.loadMore} loading={history.isFetchingNextPage} onPress={() => void history.fetchNextPage()} />
        ) : null}
      </ScrollScreen>

      <Sheet visible={muteOpen} onClose={() => setMuteOpen(false)} title={S.mute.title}>
        <AppText tone="muted">{S.mute.description}</AppText>
        <AppText variant="label">{S.mute.choose}</AppText>
        <View style={styles.chips}>
          {muteOptions.map((hours) => (
            <Chip key={hours} label={formatHours(hours)} selected={hours === chosenHours} onPress={() => setMuteHours(hours)} />
          ))}
        </View>
        <CtaButton
          label={S.mute.confirm(formatHours(chosenHours))}
          loading={tagActions.mute.isPending}
          disabled={chosenHours === 0}
          onPress={() =>
            tagActions.mute.mutate(chosenHours, {
              onSuccess: () => setMuteOpen(false),
              onError,
            })
          }
        />
      </Sheet>

      <ConfirmDialog
        visible={unlinkOpen}
        title={S.unlink.title}
        body={S.unlink.body}
        confirmLabel={S.unlink.confirm}
        cancelLabel={S.unlink.cancel}
        onConfirm={() => tagActions.unlink.mutate(undefined, { onSuccess: () => setUnlinkOpen(false), onError })}
        onCancel={() => setUnlinkOpen(false)}
        busy={tagActions.unlink.isPending}
      />

      <ConfirmDialog
        visible={suspect !== null}
        title={S.scans.suspiciousTitle}
        body={S.scans.suspiciousBody}
        confirmLabel={S.scans.suspiciousConfirm}
        cancelLabel={S.scans.suspiciousCancel}
        onConfirm={() =>
          suspect &&
          suspicious.mutate(suspect.id, {
            onSuccess: () => {
              setSuspect(null);
              setNotice(S.scans.marked);
            },
            onError,
          })
        }
        onCancel={() => setSuspect(null)}
        busy={suspicious.isPending}
      />
    </>
  );
}

function ScanItem({ scan, canMark, onMark }: { scan: ScanHistoryItem; canMark: boolean; onMark: () => void }) {
  const theme = useTheme();
  const report = scan.finderReport;
  return (
    <Card style={styles.item}>
      <View style={styles.row}>
        <AppText variant="label">{formatDateTime(new Date(scan.createdAt))}</AppText>
        <Badge
          label={S.scans.trust[scan.trustLevel]}
          tone={scan.trustLevel === "NFC_VERIFICADO" ? "success" : "warn"}
        />
      </View>
      <AppText variant="caption" tone="muted">
        {`${S.scans.result[scan.result]}${scan.view ? ` · ${S.scans.view[scan.view]}` : ""}${scan.approxLat !== null ? ` · ${S.scans.withLocation}` : ""}`}
      </AppText>
      {report ? (
        <View style={[styles.report, { backgroundColor: theme.colors.bg, borderRadius: theme.radii.field }]}>
          <View style={styles.row}>
            <AppText variant="caption" style={{ color: theme.colors.ink, fontFamily: theme.fonts.body.bold }}>
              {S.scans.withReport}
            </AppText>
            <Badge label={S.scans.reportStatus[report.status]} tone={report.status === "SOSPECHOSO" ? "alert" : "primary"} />
          </View>
          {report.message ? (
            <AppText variant="caption" tone="muted">
              {`${S.scans.message} ${report.message}`}
            </AppText>
          ) : null}
          {report.contactPhone ? (
            <AppText variant="caption" tone="muted">
              {`${S.scans.contactPhone} ${report.contactPhone}`}
            </AppText>
          ) : null}
          {report.photoUrl ? (
            <Image source={{ uri: report.photoUrl }} style={[styles.photo, { borderRadius: theme.radii.field }]} contentFit="cover" />
          ) : null}
          {canMark ? (
            <View style={styles.spacedSmall}>
              <SecondaryButton label={S.scans.markSuspicious} tone="danger" compact onPress={onMark} />
            </View>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  actions: { marginTop: 12, gap: 8 },
  spacedSmall: { marginTop: 6 },
  map: { height: MAP_HEIGHT, overflow: "hidden" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  item: { marginBottom: 10 },
  report: { marginTop: 8, padding: 10, gap: 4 },
  photo: { width: "100%", aspectRatio: 4 / 3, marginTop: 6 },
});
