import type { JsonBody, MultipartBody } from "@/core/api/contract-types";
import { multipartOptions } from "@/core/api/multipart";
import { call, getApiClient, type ApiClient, type components } from "@/core/api/registry";
import { PET_CHANGES_PAGE_SIZE } from "./constants";

/**
 * Repositorio de mascotas (docs/06 §3): la UI pide «mis mascotas» o «marcar
 * perdida», no rutas. El cliente se inyecta para probar con fetch falso.
 */

export type PetSummary = components["schemas"]["PetSummary"];
export type PetDetail = components["schemas"]["PetDetail"];
export type PetPublicView = components["schemas"]["PetPublicView"];
export type PetChanges = components["schemas"]["PetChanges"];
export type LostModeResult = components["schemas"]["LostModeResult"];
export type PetStatus = PetSummary["status"];
export type PetSpecies = PetSummary["species"];
export type PetSex = PetDetail["sex"];
export type GuardianRole = PetSummary["role"];
export type TagStatus = NonNullable<PetSummary["tag"]>["status"];

export type PetPatch = JsonBody<"/api/v1/pets/{id}", "patch">;
export type LostModeInput = JsonBody<"/api/v1/pets/{id}/lost", "post">;
export type CreatePetBody = MultipartBody<"/api/v1/pets", "post">;
export type AddPetPhotosBody = MultipartBody<"/api/v1/pets/{id}/photos", "post">;

export function listPets(client: ApiClient = getApiClient()): Promise<PetSummary[]> {
  return call(() => client.GET("/api/v1/pets")).then((page) => page.items);
}

export function getPet(petId: string, client: ApiClient = getApiClient()): Promise<PetDetail> {
  return call(() => client.GET("/api/v1/pets/{id}", { params: { path: { id: petId } } }));
}

/** Alta con fotos: el FormData ya trae campos y archivos (model/pet-form.ts). */
export function createPet(form: FormData, client: ApiClient = getApiClient()): Promise<PetDetail> {
  return call(() => client.POST("/api/v1/pets", multipartOptions<CreatePetBody>(form)));
}

export function updatePet(petId: string, patch: PetPatch, client: ApiClient = getApiClient()): Promise<PetDetail> {
  return call(() => client.PATCH("/api/v1/pets/{id}", { params: { path: { id: petId } }, body: patch }));
}

/** Baja lógica: la mascota pasa a INACTIVA (RF-C4). */
export function deletePet(petId: string, client: ApiClient = getApiClient()): Promise<PetSummary> {
  return call(() => client.DELETE("/api/v1/pets/{id}", { params: { path: { id: petId } } }));
}

export function addPetPhotos(petId: string, form: FormData, client: ApiClient = getApiClient()): Promise<PetDetail> {
  return call(() =>
    client.POST("/api/v1/pets/{id}/photos", {
      params: { path: { id: petId } },
      ...multipartOptions<AddPetPhotosBody>(form),
    }),
  );
}

export function removePetPhoto(petId: string, photoId: string, client: ApiClient = getApiClient()): Promise<PetDetail> {
  return call(() =>
    client.DELETE("/api/v1/pets/{id}/photos/{photoId}", { params: { path: { id: petId, photoId } } }),
  );
}

export function reorderPetPhotos(petId: string, photoIds: string[], client: ApiClient = getApiClient()): Promise<PetDetail> {
  return call(() =>
    client.PATCH("/api/v1/pets/{id}/photos/order", { params: { path: { id: petId } }, body: { photoIds } }),
  );
}

/** Lo que vería quien encuentre a la mascota (RF-F6). */
export function getPetPublicPreview(petId: string, client: ApiClient = getApiClient()): Promise<PetPublicView> {
  return call(() => client.GET("/api/v1/pets/{id}/public-preview", { params: { path: { id: petId } } }));
}

export function listPetChanges(
  petId: string,
  cursor: string | null,
  client: ApiClient = getApiClient(),
): Promise<PetChanges> {
  return call(() =>
    client.GET("/api/v1/pets/{id}/changes", {
      params: {
        path: { id: petId },
        query: { limit: PET_CHANGES_PAGE_SIZE, ...(cursor ? { cursor } : {}) },
      },
    }),
  );
}

/** Modo perdido (RF-C5): crea el caso prellenado y deja la mascota en PERDIDA. */
export function activateLostMode(
  petId: string,
  input: LostModeInput,
  client: ApiClient = getApiClient(),
): Promise<LostModeResult> {
  return call(() => client.POST("/api/v1/pets/{id}/lost", { params: { path: { id: petId } }, body: input }));
}

/** Regreso a casa (RF-C6): cierra el caso como ENCONTRADA. */
export function confirmPetFound(petId: string, client: ApiClient = getApiClient()): Promise<LostModeResult> {
  return call(() => client.DELETE("/api/v1/pets/{id}/lost", { params: { path: { id: petId } } }));
}
