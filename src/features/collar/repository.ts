import { API_HEADERS } from "@/core/api/client";
import type { MultipartBody } from "@/core/api/contract-types";
import { multipartOptions } from "@/core/api/multipart";
import { call, getApiClient, type ApiClient, type components } from "@/core/api/registry";
import { SCAN_HISTORY_PAGE_SIZE } from "./constants";

/**
 * Repositorio del collar (docs/06 §3): resolución de escaneos, activación,
 * silencio, desvinculación, historial y aviso del finder. El token de escaneo
 * viaja en la cabecera acordada (docs/05 §2) solo en las rutas que lo exigen.
 */

export type ScanResolution = components["schemas"]["ScanResolution"];
export type ScanPreview = components["schemas"]["ScanPreview"];
export type ScanHistory = components["schemas"]["ScanHistory"];
export type ScanHistoryItem = ScanHistory["items"][number];
export type TagSummary = components["schemas"]["TagSummary"];
export type PetPublicView = components["schemas"]["PetPublicView"];
export type FinderReportResult = components["schemas"]["FinderReportResult"];
export type SuspiciousScanResult = components["schemas"]["SuspiciousScanResult"];
export type ScanView = ScanResolution["view"];
export type ScanTrustLevel = ScanPreview["trustLevel"];
export type TagStatus = TagSummary["status"];

export type FinderReportBody = MultipartBody<"/api/v1/scans/{token}/finder-report", "post">;

/** Lectura firmada del chip (`/t?p&m`): el servidor decide la vista. */
export function resolveNfcScan(
  input: { p: string; m: string },
  client: ApiClient = getApiClient(),
): Promise<ScanResolution> {
  return call(() => client.POST("/api/v1/scans/nfc", { body: input }));
}

/** QR impreso (`/q/{code}`): nivel sin verificar (ADR-008). */
export function resolveQrScan(code: string, client: ApiClient = getApiClient()): Promise<ScanResolution> {
  return call(() => client.POST("/api/v1/scans/qr", { body: { code } }));
}

function scanTokenHeaders(token: string): Record<string, string> {
  return { [API_HEADERS.scanToken]: token };
}

/** Estado de la sesión de escaneo y lo público de la mascota (M6). */
export function getScanPreview(token: string, client: ApiClient = getApiClient()): Promise<ScanPreview> {
  return call(() =>
    client.GET("/api/v1/scans/{token}", { params: { path: { token } }, headers: scanTokenHeaders(token) }),
  );
}

/** Aviso al dueño (RF-F4): mensaje, ubicación aproximada, foto y teléfono opcionales. */
export function sendFinderReport(
  token: string,
  form: FormData,
  client: ApiClient = getApiClient(),
): Promise<FinderReportResult> {
  return call(() =>
    client.POST("/api/v1/scans/{token}/finder-report", {
      params: { path: { token } },
      headers: scanTokenHeaders(token),
      ...multipartOptions<FinderReportBody>(form),
    }),
  );
}

/** Vincula el collar a la mascota; el token de escaneo se consume (RF-E3). */
export function activateTag(
  input: { scanToken: string; petId: string },
  client: ApiClient = getApiClient(),
): Promise<TagSummary> {
  return call(() => client.POST("/api/v1/tags/activate", { body: input }));
}

export function muteTag(tagId: string, hours: number, client: ApiClient = getApiClient()): Promise<TagSummary> {
  return call(() => client.POST("/api/v1/tags/{id}/mute", { params: { path: { id: tagId } }, body: { hours } }));
}

export function unmuteTag(tagId: string, client: ApiClient = getApiClient()): Promise<TagSummary> {
  return call(() => client.DELETE("/api/v1/tags/{id}/mute", { params: { path: { id: tagId } } }));
}

export function unlinkTag(tagId: string, client: ApiClient = getApiClient()): Promise<TagSummary> {
  return call(() => client.POST("/api/v1/tags/{id}/unlink", { params: { path: { id: tagId } } }));
}

export function listScanHistory(
  petId: string,
  cursor: string | null,
  client: ApiClient = getApiClient(),
): Promise<ScanHistory> {
  return call(() =>
    client.GET("/api/v1/pets/{id}/scans", {
      params: {
        path: { id: petId },
        query: { limit: SCAN_HISTORY_PAGE_SIZE, ...(cursor ? { cursor } : {}) },
      },
    }),
  );
}

/** Marca un escaneo como sospechoso: el collar pasa a revisión (RF-F8). */
export function markScanSuspicious(
  petId: string,
  scanId: string,
  client: ApiClient = getApiClient(),
): Promise<SuspiciousScanResult> {
  return call(() =>
    client.POST("/api/v1/pets/{id}/scans/{scanId}/suspicious", { params: { path: { id: petId, scanId } } }),
  );
}
