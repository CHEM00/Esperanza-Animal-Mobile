import { call, getApiClient, type ApiClient, type components } from "@/core/api/registry";

/**
 * Repositorio de guardianes, invitaciones y transferencias (RF-D1 a RF-D4).
 * Los enlaces son tokens opacos: la app solo los muestra o los acepta.
 */

export type GuardianList = components["schemas"]["GuardianList"];
export type Guardian = GuardianList["items"][number];
export type InviteLink = components["schemas"]["InviteLink"];
export type TransferLink = components["schemas"]["TransferLink"];
export type TransferResult = components["schemas"]["TransferResult"];
export type GuardianAcceptance = components["schemas"]["GuardianAcceptance"];
export type LinkPreview = components["schemas"]["LinkPreview"];

export type LinkKind = "invite" | "transfer";

export const GUARDIANS_QUERY_KEYS = {
  list: (petId: string) => ["pets", "detail", petId, "guardians"] as const,
  linkPreview: (kind: LinkKind, code: string) => ["links", kind, code] as const,
};

export function listGuardians(petId: string, client: ApiClient = getApiClient()): Promise<Guardian[]> {
  return call(() => client.GET("/api/v1/pets/{id}/guardians", { params: { path: { id: petId } } })).then(
    (page) => page.items,
  );
}

export function createGuardianInvite(petId: string, client: ApiClient = getApiClient()): Promise<InviteLink> {
  return call(() => client.POST("/api/v1/pets/{id}/guardian-invites", { params: { path: { id: petId } } }));
}

/** El dueño quita a un guardián, o un guardián se quita a sí mismo. */
export function removeGuardian(petId: string, userId: string, client: ApiClient = getApiClient()): Promise<Guardian[]> {
  return call(() =>
    client.DELETE("/api/v1/pets/{id}/guardians/{userId}", { params: { path: { id: petId, userId } } }),
  ).then((page) => page.items);
}

export function createPetTransfer(petId: string, client: ApiClient = getApiClient()): Promise<TransferLink> {
  return call(() => client.POST("/api/v1/pets/{id}/transfers", { params: { path: { id: petId } } }));
}

export function cancelPetTransfer(petId: string, client: ApiClient = getApiClient()): Promise<TransferResult> {
  return call(() => client.POST("/api/v1/pets/{id}/transfers/cancel", { params: { path: { id: petId } } }));
}

/** Qué mascota y si el enlace sigue vigente, antes de aceptar (M9). */
export function getLinkPreview(kind: LinkKind, code: string, client: ApiClient = getApiClient()): Promise<LinkPreview> {
  return kind === "invite"
    ? call(() => client.GET("/api/v1/guardian-invites/{code}", { params: { path: { code } } }))
    : call(() => client.GET("/api/v1/transfers/{code}", { params: { path: { code } } }));
}

export function acceptGuardianInvite(code: string, client: ApiClient = getApiClient()): Promise<GuardianAcceptance> {
  return call(() => client.POST("/api/v1/guardian-invites/{code}/accept", { params: { path: { code } } }));
}

export function acceptPetTransfer(code: string, client: ApiClient = getApiClient()): Promise<TransferResult> {
  return call(() => client.POST("/api/v1/transfers/{code}/accept", { params: { path: { code } } }));
}
