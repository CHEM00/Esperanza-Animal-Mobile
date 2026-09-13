import { useQuery } from "@tanstack/react-query";
import { REMOTE_CONFIG_QUERY_KEY, REMOTE_CONFIG_STALE_TIME_MS } from "./constants";
import { fetchRemoteConfig } from "./repository";

/** Configuración remota con caché; es el primer request de la app (docs/05 §7). */
export function useRemoteConfig() {
  return useQuery({
    queryKey: REMOTE_CONFIG_QUERY_KEY,
    queryFn: () => fetchRemoteConfig(),
    staleTime: REMOTE_CONFIG_STALE_TIME_MS,
  });
}
