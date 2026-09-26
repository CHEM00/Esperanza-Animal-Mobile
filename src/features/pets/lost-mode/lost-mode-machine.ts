import { z } from "zod";
import type { GeoPoint } from "@/core/map/region";
import type { RemoteConfig } from "@/features/config/repository";
import type { LostModeInput, LostModeResult } from "../repository";
import { PETS_STRINGS } from "../strings";

/**
 * Modo perdido (M10, RF-C5) como máquina de estados explícita (docs/06 §3):
 * aviso 3d → formulario (colonia, referencia, punto, teléfono, recompensa) →
 * responsiva 3e → envío → listo. Un reductor puro; la pantalla solo despacha
 * eventos y pinta el paso.
 */

export type LostModeStep = "notice" | "form" | "responsiva" | "submitting" | "done";

export interface LostModeFormValues {
  cp: string;
  coloniaId: string | null;
  coloniaLabel: string | null;
  locationReference: string;
  point: GeoPoint | null;
  phone: string;
  hasReward: boolean;
}

export interface LostModeState {
  step: LostModeStep;
  form: LostModeFormValues;
  /** Aceptaciones que el contrato exige explícitas (aviso 3d y responsiva 3e). */
  safetyNoticeAccepted: boolean;
  liabilityAccepted: boolean;
  error: string | null;
  result: LostModeResult | null;
}

export type LostModeEvent =
  | { type: "ACCEPT_NOTICE" }
  | { type: "EDIT"; patch: Partial<LostModeFormValues> }
  | { type: "CONTINUE" }
  | { type: "BACK" }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_OK"; result: LostModeResult }
  | { type: "SUBMIT_FAIL"; message: string }
  | { type: "RESET" };

export const EMPTY_LOST_MODE_FORM: LostModeFormValues = {
  cp: "",
  coloniaId: null,
  coloniaLabel: null,
  locationReference: "",
  point: null,
  phone: "",
  hasReward: false,
};

export function initialLostModeState(defaults: Partial<LostModeFormValues> = {}): LostModeState {
  return {
    step: "notice",
    form: { ...EMPTY_LOST_MODE_FORM, ...defaults },
    safetyNoticeAccepted: false,
    liabilityAccepted: false,
    error: null,
    result: null,
  };
}

/** Transiciones válidas por paso; cualquier otra combinación no cambia el estado. */
export function lostModeReducer(state: LostModeState, event: LostModeEvent): LostModeState {
  switch (event.type) {
    case "ACCEPT_NOTICE":
      return state.step === "notice" ? { ...state, step: "form", safetyNoticeAccepted: true } : state;
    case "EDIT":
      return state.step === "form" ? { ...state, form: { ...state.form, ...event.patch }, error: null } : state;
    case "CONTINUE":
      return state.step === "form" ? { ...state, step: "responsiva", error: null } : state;
    case "BACK":
      return state.step === "responsiva" ? { ...state, step: "form", error: null } : state;
    case "SUBMIT":
      return state.step === "responsiva"
        ? { ...state, step: "submitting", liabilityAccepted: true, error: null }
        : state;
    case "SUBMIT_OK":
      return state.step === "submitting" ? { ...state, step: "done", result: event.result } : state;
    case "SUBMIT_FAIL":
      return state.step === "submitting" ? { ...state, step: "responsiva", error: event.message } : state;
    case "RESET":
      return initialLostModeState(state.form);
  }
}

export type LostModeLimits = Pick<RemoteConfig["limits"], "referenceMinLength" | "referenceMaxLength" | "phoneLength">;

const errors = PETS_STRINGS.lostMode.form.errors;

/** Validación del formulario con los límites remotos (misma regla que el caso web 3c). */
export function buildLostModeSchema(limits: LostModeLimits) {
  return z.object({
    coloniaId: z.string({ error: errors.colonia }).min(1, errors.colonia),
    locationReference: z
      .string()
      .trim()
      .min(limits.referenceMinLength, errors.referenceMin(limits.referenceMinLength))
      .max(limits.referenceMaxLength, errors.referenceMax(limits.referenceMaxLength)),
    phone: z
      .string()
      .transform((value) => value.replace(/\D/g, ""))
      .pipe(z.string().length(limits.phoneLength, errors.phone(limits.phoneLength))),
    point: z.object({ lat: z.number(), lng: z.number() }, { error: errors.point }),
    hasReward: z.boolean(),
  });
}

export type LostModeErrors = Partial<Record<"coloniaId" | "locationReference" | "phone" | "point", string>>;

export function lostModeErrorsOf(error: z.ZodError): LostModeErrors {
  const result: LostModeErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in result)) {
      result[key as keyof LostModeErrors] = issue.message;
    }
  }
  return result;
}

/**
 * Cuerpo de `POST /pets/{id}/lost` a partir de un formulario ya validado. Las
 * aceptaciones van en `true` literal porque la máquina solo llega a SUBMIT tras
 * el aviso 3d y la responsiva 3e; el contrato las exige así.
 */
export function toLostModeInput(values: z.infer<ReturnType<typeof buildLostModeSchema>>): LostModeInput {
  return {
    coloniaId: values.coloniaId,
    locationReference: values.locationReference,
    phone: values.phone,
    hasReward: values.hasReward,
    lat: values.point.lat,
    lng: values.point.lng,
    safetyNoticeAccepted: true,
    liabilityAccepted: true,
  };
}
