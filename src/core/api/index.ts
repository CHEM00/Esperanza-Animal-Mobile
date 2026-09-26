import { randomUUID } from "expo-crypto";
import { secureStoreStorage } from "@/core/adapters/secure-store-storage";
import { sessionStore } from "@/core/auth/session";
import { appConfig } from "@/core/config";
import { createApiClient } from "./client";
import { createDeviceIdProvider } from "./device-id";
import { setApiClient } from "./registry";

/**
 * Raíz de composición del cliente de la API (docs/06 §3, patrón fábrica): con
 * las dependencias reales del proceso. La llama bootstrapCore() al arrancar;
 * los repositorios usan getApiClient() del registro.
 */
export function installApiClient(): void {
  const getDeviceId = createDeviceIdProvider(secureStoreStorage, randomUUID);
  setApiClient(
    createApiClient({
      baseUrl: appConfig.apiBaseUrl,
      getSessionToken: () => sessionStore.getState().token,
      getDeviceId,
      newRequestId: randomUUID,
    }),
  );
}

export { call, unwrap, API_HEADERS, getApiClient, ApiError, isApiError } from "./registry";
export type { ApiClient, components, paths } from "./registry";
