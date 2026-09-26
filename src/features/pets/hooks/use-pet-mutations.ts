import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PETS_QUERY_KEYS } from "../constants";
import {
  addPetPhotos,
  confirmPetFound,
  createPet,
  deletePet,
  removePetPhoto,
  reorderPetPhotos,
  updatePet,
  type PetDetail,
  type PetPatch,
} from "../repository";

/**
 * Mutaciones de mascotas. Cada una invalida la raíz de la feature: la lista, el
 * perfil y las vistas derivadas se vuelven a pedir (docs/06 §11, observador).
 */

function useInvalidatePets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.all });
}

export function useCreatePet() {
  const invalidate = useInvalidatePets();
  return useMutation({
    mutationFn: (form: FormData) => createPet(form),
    onSuccess: () => invalidate(),
  });
}

export function useUpdatePet(petId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePets();
  return useMutation({
    mutationFn: (patch: PetPatch) => updatePet(petId, patch),
    onSuccess: (pet: PetDetail) => {
      queryClient.setQueryData(PETS_QUERY_KEYS.detail(petId), pet);
      return invalidate();
    },
  });
}

export function useDeletePet(petId: string) {
  const invalidate = useInvalidatePets();
  return useMutation({
    mutationFn: () => deletePet(petId),
    onSuccess: () => invalidate(),
  });
}

/** Fotos del perfil: agregar (multipart), quitar y reordenar; la primera es la portada. */
export function usePetPhotos(petId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePets();
  const settle = (pet: PetDetail) => {
    queryClient.setQueryData(PETS_QUERY_KEYS.detail(petId), pet);
    return invalidate();
  };
  const add = useMutation({ mutationFn: (form: FormData) => addPetPhotos(petId, form), onSuccess: settle });
  const remove = useMutation({ mutationFn: (photoId: string) => removePetPhoto(petId, photoId), onSuccess: settle });
  const reorder = useMutation({
    mutationFn: (photoIds: string[]) => reorderPetPhotos(petId, photoIds),
    onSuccess: settle,
  });
  return { add, remove, reorder, busy: add.isPending || remove.isPending || reorder.isPending };
}

/** Regreso a casa (RF-C6). */
export function useConfirmFound(petId: string) {
  const invalidate = useInvalidatePets();
  return useMutation({
    mutationFn: () => confirmPetFound(petId),
    onSuccess: () => invalidate(),
  });
}
