import { useQuery } from "@tanstack/react-query";
import { COLONIAS_QUERY_KEYS, COLONIAS_STALE_TIME_MS, isCompleteCp, searchColoniasByCp } from "./repository";

/** Colonias del CP escrito; no consulta hasta tener los cinco dígitos. */
export function useColoniaSearch(cp: string) {
  const enabled = isCompleteCp(cp);
  return useQuery({
    queryKey: COLONIAS_QUERY_KEYS.byCp(cp),
    queryFn: () => searchColoniasByCp(cp),
    enabled,
    staleTime: COLONIAS_STALE_TIME_MS,
  });
}
