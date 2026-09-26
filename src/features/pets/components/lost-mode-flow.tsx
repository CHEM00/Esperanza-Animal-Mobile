import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { DeviceMapView } from "@/core/device";
import { regionFromCenterZoom, type GeoPoint } from "@/core/map/region";
import { useTheme } from "@/core/theme/use-theme";
import { normalizeCp } from "@/features/colonias/repository";
import { useColoniaSearch } from "@/features/colonias/use-colonia-search";
import { SHELL_STRINGS } from "@/features/shell/strings";
import { AppText } from "@/shared/ui/app-text";
import { Chip } from "@/shared/ui/chip";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { FieldLabel } from "@/shared/ui/field-label";
import { NoticeModal, NoticeParagraph, NoticeStrong } from "@/shared/ui/notice-modal";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { Sheet } from "@/shared/ui/sheet";
import { SwitchRow } from "@/shared/ui/switch-row";
import { TextField } from "@/shared/ui/text-field";
import { useLostMode } from "../hooks/use-lost-mode";
import type { PetDetail } from "../repository";
import { PETS_STRINGS } from "../strings";

/**
 * M10 · Modo perdido sobre el perfil (RF-C5): aviso 3d, formulario del caso y
 * responsiva 3e, reutilizando los mismos textos que la web. La máquina de
 * estados vive en el hook; aquí solo se pinta el paso actual.
 */
interface LostModeFlowProps {
  pet: PetDetail;
  visible: boolean;
  onClose: () => void;
  onViewCase: (publicationId: string) => void;
}

const MAP_HEIGHT = 220;
const S = PETS_STRINGS.lostMode;

export function LostModeFlow({ pet, visible, onClose, onViewCase }: LostModeFlowProps) {
  const theme = useTheme();
  const lost = useLostMode(pet.id);
  const { state, errors, limits, mapDefaults } = lost;
  const search = useColoniaSearch(state.form.cp);

  const municipioCenter: GeoPoint | null =
    search.data?.status === "ok" ? search.data.municipioCenter : null;
  const region = useMemo(() => {
    if (!mapDefaults) {
      return null;
    }
    if (state.form.point) {
      return regionFromCenterZoom(state.form.point, mapDefaults.caseZoom);
    }
    if (municipioCenter) {
      return regionFromCenterZoom(municipioCenter, mapDefaults.cityZoom);
    }
    return regionFromCenterZoom(mapDefaults.nationalView.center, mapDefaults.nationalView.zoom);
  }, [mapDefaults, municipioCenter, state.form.point]);

  if (!visible) {
    return null;
  }

  function close() {
    lost.reset();
    onClose();
  }

  return (
    <>
      <NoticeModal
        visible={state.step === "notice"}
        title={S.notice.title}
        primaryLabel={S.notice.accept}
        onPrimary={lost.acceptNotice}
        secondaryLabel={S.done.close}
        onSecondary={close}
      >
        <NoticeParagraph>{S.notice.p1(SHELL_STRINGS.appName)}</NoticeParagraph>
        <NoticeParagraph>
          {S.notice.p2a}
          <NoticeStrong>{S.notice.p2strong}</NoticeStrong>
          {S.notice.p2b}
        </NoticeParagraph>
        <NoticeParagraph>
          {S.notice.p3a}
          <NoticeStrong>{S.notice.p3strong}</NoticeStrong>
          {S.notice.p3b}
        </NoticeParagraph>
      </NoticeModal>

      <Sheet visible={state.step === "form"} onClose={close} title={S.title} testID="lost-mode-form">
        <AppText tone="muted">{S.form.intro(pet.name)}</AppText>

        <TextField
          label={S.form.cp.label}
          placeholder={S.form.cp.placeholder}
          value={state.form.cp}
          onChangeText={(value) => lost.edit({ cp: normalizeCp(value), coloniaId: null, coloniaLabel: null })}
          keyboardType="number-pad"
          maxLength={5}
          error={errors.coloniaId && !state.form.cp ? errors.coloniaId : null}
        />

        {search.isFetching ? (
          <AppText variant="caption" tone="muted">
            {S.form.colonia.searching}
          </AppText>
        ) : null}
        {search.data?.status === "not_found" ? <ErrorBanner message={S.form.cpNotFound} tone="warn" /> : null}
        {search.data?.status === "inactive" ? (
          <ErrorBanner message={S.form.cpInactive(search.data.municipio, search.data.estado)} tone="warn" />
        ) : null}
        {search.data?.status === "ok" ? (
          <View>
            <FieldLabel>{`${S.form.colonia.label} · ${search.data.municipio}, ${search.data.estado}`}</FieldLabel>
            <View style={styles.chips}>
              {search.data.colonias.map((colonia) => (
                <Chip
                  key={colonia.id}
                  label={colonia.type && colonia.type !== "Colonia" ? `${colonia.name} (${colonia.type})` : colonia.name}
                  selected={colonia.id === state.form.coloniaId}
                  onPress={() => lost.edit({ coloniaId: colonia.id, coloniaLabel: colonia.name })}
                />
              ))}
            </View>
            {errors.coloniaId ? (
              <AppText variant="caption" tone="warn" style={styles.error}>
                {errors.coloniaId}
              </AppText>
            ) : null}
          </View>
        ) : null}

        <TextField
          label={S.form.locationReference.label}
          placeholder={S.form.locationReference.placeholder}
          value={state.form.locationReference}
          onChangeText={(value) => lost.edit({ locationReference: value })}
          maxLength={limits?.referenceMaxLength}
          error={errors.locationReference}
        />

        <View>
          <FieldLabel>{S.form.point.label}</FieldLabel>
          <AppText variant="caption" tone="faint" style={styles.hint}>
            {S.form.point.hint}
          </AppText>
          {region ? (
            <View style={[styles.map, { borderRadius: theme.radii.field, borderColor: theme.colors.line }]}>
              <DeviceMapView
                region={region}
                draggablePin={state.form.point}
                onPinMoved={(point) => lost.edit({ point })}
                onPressMap={(point) => lost.edit({ point })}
                testID="lost-mode-map"
              />
            </View>
          ) : null}
          <View style={styles.locationRow}>
            <SecondaryButton
              label={lost.locating ? S.form.point.locating : S.form.point.useMyLocation}
              loading={lost.locating}
              compact
              onPress={() => void lost.useMyLocation()}
            />
          </View>
          {lost.locationMessage ? <ErrorBanner message={lost.locationMessage} tone="warn" /> : null}
          {errors.point ? (
            <AppText variant="caption" tone="warn" style={styles.error}>
              {errors.point}
            </AppText>
          ) : null}
        </View>

        <TextField
          label={S.form.phone.label}
          placeholder={S.form.phone.placeholder}
          hint={S.form.phone.hint}
          value={state.form.phone}
          onChangeText={(value) => lost.edit({ phone: value })}
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <SwitchRow
          title={S.form.reward.title}
          description={S.form.reward.description}
          value={state.form.hasReward}
          onValueChange={(hasReward) => lost.edit({ hasReward })}
        />

        <CtaButton label={S.form.continue} onPress={lost.continueToResponsiva} disabled={!limits} />
      </Sheet>

      <NoticeModal
        visible={state.step === "responsiva" || state.step === "submitting"}
        title={S.responsiva.title}
        tone="warn"
        emblem="🤝"
        primaryLabel={state.step === "submitting" ? S.responsiva.submitting : S.responsiva.accept}
        onPrimary={lost.submit}
        secondaryLabel={S.responsiva.back}
        onSecondary={lost.back}
        busy={state.step === "submitting"}
        error={state.error}
      >
        <NoticeParagraph>
          {S.responsiva.p1a(SHELL_STRINGS.appName)}
          <NoticeStrong>{S.responsiva.p1strong}</NoticeStrong>
          {S.responsiva.p1b}
        </NoticeParagraph>
        <NoticeParagraph>
          {S.responsiva.p2a}
          <NoticeStrong>{S.responsiva.p2strong}</NoticeStrong>
          {S.responsiva.p2b}
        </NoticeParagraph>
      </NoticeModal>

      <NoticeModal
        visible={state.step === "done"}
        title={S.done.title}
        emblem="🐾"
        primaryLabel={state.result?.publicationId ? S.done.viewCase : S.done.close}
        onPrimary={() => {
          const publicationId = state.result?.publicationId;
          close();
          if (publicationId) {
            onViewCase(publicationId);
          }
        }}
        secondaryLabel={state.result?.publicationId ? S.done.close : undefined}
        onSecondary={state.result?.publicationId ? close : undefined}
      >
        <NoticeParagraph>{S.done.body}</NoticeParagraph>
      </NoticeModal>
    </>
  );
}

const styles = StyleSheet.create({
  hint: { marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  error: { marginTop: 5 },
  map: { height: MAP_HEIGHT, overflow: "hidden", borderWidth: 1 },
  locationRow: { flexDirection: "row", marginTop: 8 },
});
