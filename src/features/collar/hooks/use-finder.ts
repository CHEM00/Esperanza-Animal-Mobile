import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { appendFields, appendFile } from "@/core/api/multipart";
import { imageCompressor, imagePicker, locationProvider } from "@/core/device";
import { policyFromLimits } from "@/core/media/image-policy";
import type { UploadableImage } from "@/core/ports/image-compressor";
import type { GeoPoint } from "@/core/map/region";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { COLLAR_QUERY_KEYS, SCAN_PREVIEW_STALE_TIME_MS } from "../constants";
import { getScanPreview, sendFinderReport, type FinderReportBody } from "../repository";
import { COLLAR_STRINGS } from "../strings";

/** Estado de la sesión de escaneo y lo público de la mascota (M6). */
export function useScanPreview(token: string) {
  return useQuery({
    queryKey: COLLAR_QUERY_KEYS.scanPreview(token),
    queryFn: () => getScanPreview(token),
    staleTime: SCAN_PREVIEW_STALE_TIME_MS,
    retry: false,
  });
}

export interface FinderReportDraft {
  message: string;
  phone: string;
  shareLocation: boolean;
  point: GeoPoint | null;
  photo: UploadableImage | null;
}

export const EMPTY_FINDER_DRAFT: FinderReportDraft = {
  message: "",
  phone: "",
  shareLocation: false,
  point: null,
  photo: null,
};

/** Campo multipart de la foto del finder, como lo declara el contrato. */
const FINDER_PHOTO_FIELD = "photo";

/** Cuerpo multipart del aviso: solo lo que la persona decidió compartir. */
export function buildFinderReportForm(draft: FinderReportDraft, contactAllowed: boolean): FormData {
  const form = new FormData();
  const fields: Record<keyof FinderReportBody, string | number | boolean | undefined> = {
    message: draft.message.trim() || undefined,
    locationConsent: draft.shareLocation && draft.point !== null,
    approxLat: draft.shareLocation && draft.point ? draft.point.lat : undefined,
    approxLng: draft.shareLocation && draft.point ? draft.point.lng : undefined,
    phone: contactAllowed && draft.phone.trim() ? draft.phone.replace(/\D/g, "") : undefined,
    photo: undefined,
  };
  appendFields(form, fields);
  if (draft.photo) {
    appendFile(form, FINDER_PHOTO_FIELD, draft.photo);
  }
  return form;
}

/** Aviso al dueño (RF-F4, RF-F9): ubicación con consentimiento, foto y teléfono opcionales. */
export function useFinderReport(token: string, contactAllowed: boolean) {
  const remoteConfig = useRemoteConfig();
  const [draft, setDraft] = useState<FinderReportDraft>(EMPTY_FINDER_DRAFT);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const report = useMutation({ mutationFn: (form: FormData) => sendFinderReport(token, form) });

  const edit = useCallback((patch: Partial<FinderReportDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const toggleLocation = useCallback(async (checked: boolean) => {
    setLocationError(null);
    if (!checked) {
      setDraft((current) => ({ ...current, shareLocation: false, point: null }));
      return;
    }
    setLocating(true);
    try {
      const result = await locationProvider.getCurrentPosition();
      if (result.status === "ok") {
        setDraft((current) => ({ ...current, shareLocation: true, point: result.point }));
      } else {
        setLocationError(COLLAR_STRINGS.finder.form.locationError);
        setDraft((current) => ({ ...current, shareLocation: false, point: null }));
      }
    } finally {
      setLocating(false);
    }
  }, []);

  const attachPhoto = useCallback(async () => {
    setPhotoError(null);
    const limits = remoteConfig.data?.limits;
    if (!limits) {
      return;
    }
    const picked = await imagePicker.pickFromLibrary(1);
    if (picked.status === "denied") {
      setPhotoError(COLLAR_STRINGS.scan.qrDenied);
      return;
    }
    if (picked.status !== "picked" || !picked.images[0]) {
      return;
    }
    const photo = await imageCompressor.compress(picked.images[0], policyFromLimits(limits));
    setDraft((current) => ({ ...current, photo }));
  }, [remoteConfig.data?.limits]);

  const submit = useCallback(() => {
    report.mutate(buildFinderReportForm(draft, contactAllowed));
  }, [contactAllowed, draft, report]);

  return {
    draft,
    edit,
    toggleLocation,
    locating,
    locationError,
    attachPhoto,
    photoError,
    submit,
    report,
    messageMaxLength: remoteConfig.data?.limits.finderMessageMaxLength ?? null,
    phoneLength: remoteConfig.data?.limits.phoneLength ?? null,
  };
}
