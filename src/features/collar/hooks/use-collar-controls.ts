import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PETS_QUERY_KEYS } from "@/features/pets/constants";
import { COLLAR_QUERY_KEYS } from "../constants";
import { listScanHistory, markScanSuspicious, muteTag, unlinkTag, unmuteTag } from "../repository";

/** Historial de escaneos paginado por cursor (M7, RF-E5). */
export function useScanHistory(petId: string) {
  return useInfiniteQuery({
    queryKey: COLLAR_QUERY_KEYS.scanHistory(petId),
    queryFn: ({ pageParam }) => listScanHistory(petId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

function useInvalidateCollar(petId: string) {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: COLLAR_QUERY_KEYS.scanHistory(petId) }),
    ]);
}

/** Silenciar, quitar silencio y desvincular (solo el dueño; el servidor lo aplica). */
export function useTagActions(tagId: string, petId: string) {
  const invalidate = useInvalidateCollar(petId);
  const mute = useMutation({ mutationFn: (hours: number) => muteTag(tagId, hours), onSuccess: () => invalidate() });
  const unmute = useMutation({ mutationFn: () => unmuteTag(tagId), onSuccess: () => invalidate() });
  const unlink = useMutation({ mutationFn: () => unlinkTag(tagId), onSuccess: () => invalidate() });
  return { mute, unmute, unlink, busy: mute.isPending || unmute.isPending || unlink.isPending };
}

/** Marcar un escaneo como sospechoso (RF-F8): el collar pasa a revisión. */
export function useMarkSuspicious(petId: string) {
  const invalidate = useInvalidateCollar(petId);
  return useMutation({
    mutationFn: (scanId: string) => markScanSuspicious(petId, scanId),
    onSuccess: () => invalidate(),
  });
}
