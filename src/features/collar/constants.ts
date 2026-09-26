/** Claves de caché y parámetros de la feature de collar (docs/06 §11, documento 01 §5). */

export const COLLAR_QUERY_KEYS = {
  scanHistory: (petId: string) => ["pets", "detail", petId, "scans"] as const,
  scanPreview: (token: string) => ["scans", token] as const,
  linkPreview: (kind: "invite" | "transfer", code: string) => ["links", kind, code] as const,
};

/** Historial de escaneos: página que pide la app (tope del servidor: 30). */
export const SCAN_HISTORY_PAGE_SIZE = 30;

/**
 * Opciones de silencio que ofrece la app (RF-E5), en horas. El valor por defecto
 * y el tope llegan por configuración remota; estas son las paradas intermedias.
 */
export const TAG_MUTE_HOUR_OPTIONS = [4, 12, 24, 72, 168] as const;

/** Radio del círculo de «zona aproximada» del finder, en metros (unos 110 m del redondeo). */
export const APPROX_ZONE_RADIUS_METERS = 110;

/** Cada cuánto se refresca el estado de la sesión de escaneo mientras el finder escribe. */
export const SCAN_PREVIEW_STALE_TIME_MS = 30 * 1000;

/** Parámetros de la URL grabada en el collar, como los define el backend. */
export const SCAN_URL_PARAM_PICC = "p";
export const SCAN_URL_PARAM_MAC = "m";

/** Formas que acepta `POST /scans/nfc` y `/scans/qr` (mismas expresiones del contrato). */
export const PICC_DATA_PATTERN = /^[0-9a-fA-F]{32}$/;
export const CMAC_PATTERN = /^[0-9a-fA-F]{16}$/;
export const QR_CODE_MAX_LENGTH = 20;
