import { resolveDeepLink, type LinkDomains } from "@/core/navigation/links";
import { CMAC_PATTERN, PICC_DATA_PATTERN, QR_CODE_MAX_LENGTH, SCAN_URL_PARAM_MAC, SCAN_URL_PARAM_PICC } from "./constants";

/**
 * Interpreta la URL leída de un collar (NFC o QR) con el mismo resolvedor de
 * los enlaces profundos (docs/06 §8): solo cuentan las del dominio configurado
 * y con la forma que acepta el backend. Módulo puro.
 */

export type ParsedScanUrl =
  | { kind: "nfc"; p: string; m: string }
  | { kind: "qr"; code: string }
  /** URL del dominio pero que no es un escaneo (p. ej. una publicación): se navega tal cual. */
  | { kind: "other"; href: string }
  | { kind: "invalid" };

/** Parámetros con los que puede llegar la ruta de resolución (enlace universal o lectura en la app). */
export interface ScanRouteParams {
  /** URL completa leída por NFC o QR dentro de la app. */
  url?: string;
  /** Enlace universal `/t?p&m` ya abierto por el sistema: la ruta recibe los parámetros sueltos. */
  p?: string;
  m?: string;
  /** Enlace universal `/q/{code}`. */
  code?: string;
}

/** Parámetros tal como los entrega Expo Router (un valor repetido llega como arreglo). */
export type RawRouteParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function scanRouteParamsFrom(raw: RawRouteParams): ScanRouteParams {
  return {
    url: firstValue(raw.url),
    p: firstValue(raw[SCAN_URL_PARAM_PICC]),
    m: firstValue(raw[SCAN_URL_PARAM_MAC]),
    code: firstValue(raw.code),
  };
}

/** Reconstruye la URL del collar a partir de los parámetros de la ruta; null si no hay nada que resolver. */
export function scanUrlFromRouteParams(params: ScanRouteParams, linkDomain: string): string | null {
  if (params.url) {
    return params.url;
  }
  if (params.p !== undefined && params.m !== undefined) {
    const query = new URLSearchParams({ [SCAN_URL_PARAM_PICC]: params.p, [SCAN_URL_PARAM_MAC]: params.m });
    return `https://${linkDomain}/t?${query.toString()}`;
  }
  if (params.code) {
    return `https://${linkDomain}/q/${encodeURIComponent(params.code)}`;
  }
  return null;
}

export function parseScanUrl(url: string, domains: LinkDomains, hrefFor: (url: string) => string | null): ParsedScanUrl {
  const link = resolveDeepLink(url, domains);
  if (!link) {
    return { kind: "invalid" };
  }
  if (link.kind === "tagScan") {
    const p = link.query[SCAN_URL_PARAM_PICC] ?? "";
    const m = link.query[SCAN_URL_PARAM_MAC] ?? "";
    return PICC_DATA_PATTERN.test(p) && CMAC_PATTERN.test(m) ? { kind: "nfc", p, m } : { kind: "invalid" };
  }
  if (link.kind === "qrScan") {
    const code = link.segment ?? "";
    return code.length > 0 && code.length <= QR_CODE_MAX_LENGTH ? { kind: "qr", code } : { kind: "invalid" };
  }
  const href = hrefFor(url);
  return href ? { kind: "other", href } : { kind: "invalid" };
}
