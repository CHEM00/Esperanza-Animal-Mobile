import { useQuery } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { PETS_QUERY_KEYS, PET_DETAIL_STALE_TIME_MS, PET_LIST_STALE_TIME_MS } from "../constants";
import { getPet, getPetPublicPreview, listPetChanges, listPets } from "../repository";

/** Mis mascotas (M1); no consulta sin sesión. */
export function usePets() {
  const authenticated = useIsAuthenticated();
  return useQuery({
    queryKey: PETS_QUERY_KEYS.list(),
    queryFn: () => listPets(),
    enabled: authenticated,
    staleTime: PET_LIST_STALE_TIME_MS,
  });
}

/** Perfil completo de una mascota (M2). */
export function usePet(petId: string | null) {
  const authenticated = useIsAuthenticated();
  return useQuery({
    queryKey: PETS_QUERY_KEYS.detail(petId ?? ""),
    queryFn: () => getPet(petId as string),
    enabled: authenticated && petId !== null,
    staleTime: PET_DETAIL_STALE_TIME_MS,
  });
}

/** Lo que vería quien la encuentre (RF-F6); se pide solo al abrir la vista previa. */
export function usePetPublicPreview(petId: string, enabled: boolean) {
  return useQuery({
    queryKey: PETS_QUERY_KEYS.publicPreview(petId),
    queryFn: () => getPetPublicPreview(petId),
    enabled,
  });
}

/** Primera página del historial de cambios del perfil (RF-C10). */
export function usePetChanges(petId: string, enabled: boolean) {
  return useQuery({
    queryKey: PETS_QUERY_KEYS.changes(petId),
    queryFn: () => listPetChanges(petId, null),
    enabled,
  });
}
