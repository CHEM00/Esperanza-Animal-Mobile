import type { NfcUnavailableReason } from "@/core/ports/nfc-reader";
import type { ScanResolution, ScanView, TagStatus, TagSummary } from "../repository";

/**
 * Activación del collar (M4, RF-E3) como máquina de estados explícita
 * (docs/06 §3): leer el chip → lectura verificada y vigente → elegir mascota →
 * vincular → listo. El token de escaneo caduca (SCAN_TOKEN_TTL_MINUTES): la
 * pantalla despacha EXPIRED con un temporizador. Módulo puro.
 */

export type ActivationState =
  | { step: "idle"; petId: string | null; error: string | null }
  | { step: "reading"; petId: string | null }
  /** El teléfono no puede leer: sin NFC o apagado. */
  | { step: "unsupported"; petId: string | null; reason: NfcUnavailableReason }
  /** El chip respondió pero no traía una URL de collar. */
  | { step: "not_collar"; petId: string | null }
  /** Lectura válida pero la vista no es de activación (collar ya activo, en revisión…). */
  | { step: "rejected"; petId: string | null; view: ScanView; tagStatus: TagStatus | null }
  /** Lectura verificada y vigente; falta elegir mascota (o ya viene preseleccionada). */
  | { step: "resolved"; petId: string | null; scanToken: string; expiresAt: string; error: string | null }
  | { step: "activating"; petId: string; scanToken: string; expiresAt: string }
  | { step: "done"; petId: string; tag: TagSummary };

export type ActivationEvent =
  | { type: "START_READ" }
  | { type: "READ_CANCELLED" }
  | { type: "READ_UNAVAILABLE"; reason: NfcUnavailableReason }
  | { type: "READ_NOT_COLLAR" }
  | { type: "READ_FAILED"; message: string }
  | { type: "RESOLVED"; resolution: ScanResolution }
  | { type: "PICK_PET"; petId: string }
  | { type: "ACTIVATE" }
  | { type: "ACTIVATED"; tag: TagSummary }
  | { type: "ACTIVATION_FAILED"; message: string }
  | { type: "EXPIRED" }
  | { type: "RESET" };

export function initialActivationState(preselectedPetId: string | null = null): ActivationState {
  return { step: "idle", petId: preselectedPetId, error: null };
}

export function isScanExpired(expiresAt: string, now: Date = new Date()): boolean {
  return new Date(expiresAt).getTime() <= now.getTime();
}

export function activationReducer(state: ActivationState, event: ActivationEvent): ActivationState {
  switch (event.type) {
    case "START_READ":
      return state.step === "idle" || state.step === "unsupported" || state.step === "not_collar" || state.step === "rejected"
        ? { step: "reading", petId: state.petId }
        : state;
    case "READ_CANCELLED":
      return state.step === "reading" ? { step: "idle", petId: state.petId, error: null } : state;
    case "READ_UNAVAILABLE":
      return state.step === "reading" ? { step: "unsupported", petId: state.petId, reason: event.reason } : state;
    case "READ_NOT_COLLAR":
      return state.step === "reading" ? { step: "not_collar", petId: state.petId } : state;
    case "READ_FAILED":
      return state.step === "reading" ? { step: "idle", petId: state.petId, error: event.message } : state;
    case "RESOLVED": {
      if (state.step !== "reading") {
        return state;
      }
      const { resolution } = event;
      if (resolution.view === "ACTIVATION" && resolution.scanToken && resolution.expiresAt) {
        return {
          step: "resolved",
          petId: state.petId,
          scanToken: resolution.scanToken,
          expiresAt: resolution.expiresAt,
          error: null,
        };
      }
      return { step: "rejected", petId: state.petId, view: resolution.view, tagStatus: resolution.tagStatus };
    }
    case "PICK_PET":
      return state.step === "resolved" ? { ...state, petId: event.petId, error: null } : state;
    case "ACTIVATE":
      return state.step === "resolved" && state.petId
        ? { step: "activating", petId: state.petId, scanToken: state.scanToken, expiresAt: state.expiresAt }
        : state;
    case "ACTIVATED":
      return state.step === "activating" ? { step: "done", petId: state.petId, tag: event.tag } : state;
    case "ACTIVATION_FAILED":
      return state.step === "activating"
        ? { step: "resolved", petId: state.petId, scanToken: state.scanToken, expiresAt: state.expiresAt, error: event.message }
        : state;
    case "EXPIRED":
      return state.step === "resolved" ? { step: "idle", petId: state.petId, error: "expired" } : state;
    case "RESET":
      return initialActivationState(state.petId);
  }
}

/** Mascota elegible para vincular: propia, activa y sin collar (RF-E3, ADR-002). */
export function isPetEligibleForCollar(pet: {
  role: "DUENO" | "GUARDIAN";
  status: "EN_CASA" | "PERDIDA" | "INACTIVA";
  tag: { status: TagStatus } | null;
}): boolean {
  return pet.role === "DUENO" && pet.status !== "INACTIVA" && pet.tag === null;
}
