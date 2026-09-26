/** Claves de caché y frescura de la feature de mascotas (docs/06 §11). */

export const PETS_QUERY_KEYS = {
  all: ["pets"] as const,
  list: () => ["pets", "list"] as const,
  detail: (petId: string) => ["pets", "detail", petId] as const,
  publicPreview: (petId: string) => ["pets", "detail", petId, "public-preview"] as const,
  changes: (petId: string) => ["pets", "detail", petId, "changes"] as const,
};

/** La lista cambia poco; el perfil de mascota es «medio» según el documento 06. */
export const PET_LIST_STALE_TIME_MS = 60 * 1000;
export const PET_DETAIL_STALE_TIME_MS = 5 * 60 * 1000;

/** Tamaño de página que pide la app para el historial de cambios (tope del servidor: 30). */
export const PET_CHANGES_PAGE_SIZE = 30;

/** Campo multipart de las fotos, como lo declara el contrato. */
export const PET_PHOTOS_FIELD = "photos";

/** Edad máxima razonable para la fecha de nacimiento (límite inferior del selector). */
export const PET_MAX_AGE_YEARS = 30;
