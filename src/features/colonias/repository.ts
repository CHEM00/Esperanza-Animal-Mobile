import { call, getApiClient, type ApiClient, type components } from "@/core/api/registry";

/**
 * Catálogo de colonias por código postal (SEPOMEX, `GET /api/v1/colonias`).
 * Lo usan el modo perdido (S13) y, después, el onboarding (S12).
 */

export type CpSearchResult = components["schemas"]["CpSearchResult"];
export type ColoniaOption = Extract<CpSearchResult, { status: "ok" }>["colonias"][number];

export const CP_LENGTH = 5;

export const COLONIAS_QUERY_KEYS = {
  byCp: (cp: string) => ["colonias", "cp", cp] as const,
};

/** El catálogo cambia rara vez: una hora de frescura evita repetir la búsqueda al ir y volver. */
export const COLONIAS_STALE_TIME_MS = 60 * 60 * 1000;

/** Deja solo dígitos y corta al largo de un CP (para el campo controlado). */
export function normalizeCp(value: string): string {
  return value.replace(/\D/g, "").slice(0, CP_LENGTH);
}

export function isCompleteCp(value: string): boolean {
  return /^\d{5}$/.test(value);
}

export function searchColoniasByCp(cp: string, client: ApiClient = getApiClient()): Promise<CpSearchResult> {
  return call(() => client.GET("/api/v1/colonias", { params: { query: { cp } } }));
}
