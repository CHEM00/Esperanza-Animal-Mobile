import { apiClient, call, type ApiClient, type components } from "@/core/api";

/**
 * Repositorio de configuración remota (docs/06 §3): la UI pide «la
 * configuración», no «GET /config». El cliente se inyecta para probar.
 */

export type RemoteConfig = components["schemas"]["RemoteConfig"];

export function fetchRemoteConfig(client: ApiClient = apiClient): Promise<RemoteConfig> {
  return call(() => client.GET("/api/v1/config"));
}
