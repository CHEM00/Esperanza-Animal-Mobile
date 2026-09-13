import { randomUUID } from "expo-crypto";
import { secureStoreStorage } from "@/core/adapters/secure-store-storage";
import { sessionStore } from "@/core/auth/session";
import { appConfig } from "@/core/config";
import { createApiClient, type ApiClient } from "./client";
import { createDeviceIdProvider } from "./device-id";

/**
 * Cliente de la API del proceso, con las dependencias reales (docs/06 §3,
 * patrón fábrica). Solo lo importan los repositorios de cada feature.
 */

const getDeviceId = createDeviceIdProvider(secureStoreStorage, randomUUID);

export const apiClient: ApiClient = createApiClient({
  baseUrl: appConfig.apiBaseUrl,
  getSessionToken: () => sessionStore.getState().token,
  getDeviceId,
  newRequestId: randomUUID,
});

export { call, unwrap, API_HEADERS } from "./client";
export type { ApiClient } from "./client";
export { ApiError, isApiError } from "./problem";
export type { components, paths } from "./generated/schema";
