import { useQuery } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { ME_QUERY_KEY, fetchMe } from "./repository";

/** Usuario en sesión; no consulta nada sin token. */
export function useMe() {
  const authenticated = useIsAuthenticated();
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: () => fetchMe(),
    enabled: authenticated,
  });
}
