import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/core/auth/use-session";
import { PETS_QUERY_KEYS } from "@/features/pets/constants";
import {
  GUARDIANS_QUERY_KEYS,
  acceptGuardianInvite,
  acceptPetTransfer,
  cancelPetTransfer,
  createGuardianInvite,
  createPetTransfer,
  getLinkPreview,
  listGuardians,
  removeGuardian,
  type LinkKind,
} from "../repository";

/** Guardianes de una mascota (M8). */
export function useGuardians(petId: string) {
  const authenticated = useIsAuthenticated();
  return useQuery({
    queryKey: GUARDIANS_QUERY_KEYS.list(petId),
    queryFn: () => listGuardians(petId),
    enabled: authenticated,
  });
}

function useInvalidatePet(petId: string) {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: GUARDIANS_QUERY_KEYS.list(petId) }),
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.detail(petId) }),
    ]);
}

export function useGuardianActions(petId: string) {
  const invalidate = useInvalidatePet(petId);
  const queryClient = useQueryClient();
  const invite = useMutation({ mutationFn: () => createGuardianInvite(petId) });
  const remove = useMutation({
    mutationFn: (userId: string) => removeGuardian(petId, userId),
    onSuccess: (items) => {
      queryClient.setQueryData(GUARDIANS_QUERY_KEYS.list(petId), items);
      return invalidate();
    },
  });
  const transfer = useMutation({ mutationFn: () => createPetTransfer(petId) });
  const cancelTransfer = useMutation({ mutationFn: () => cancelPetTransfer(petId), onSuccess: () => invalidate() });
  return { invite, remove, transfer, cancelTransfer };
}

/** Vista previa de un enlace (M9): pública, no requiere sesión. */
export function useLinkPreview(kind: LinkKind, code: string) {
  return useQuery({
    queryKey: GUARDIANS_QUERY_KEYS.linkPreview(kind, code),
    queryFn: () => getLinkPreview(kind, code),
    retry: false,
  });
}

/** Aceptar invitación o transferencia; refresca mascotas al terminar. */
export function useAcceptLink(kind: LinkKind, code: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (kind === "invite") {
        const result = await acceptGuardianInvite(code);
        return { petId: result.petId };
      }
      const result = await acceptPetTransfer(code);
      return { petId: result.petId };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.all }),
  });
}
