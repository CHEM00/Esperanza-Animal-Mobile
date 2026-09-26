import type { ScanResolution, ScanView } from "./repository";

/**
 * Estrategia por vista de escaneo (docs/06 §3, RF-F2): el servidor decide la
 * vista; aquí solo se traduce a dónde navega la app, sin condicionales
 * anidados. Agregar una vista es agregar una fila. Módulo puro.
 */

export type ScanNavigation =
  /** Quien encontró a la mascota: vista M6 con el token. */
  | { kind: "finder"; token: string }
  /** Es una mascota propia: la app abre su perfil (el token permite leer qué mascota es). */
  | { kind: "guardian"; token: string }
  /** Collar listo y sesión iniciada: activación M4 con el token vigente. */
  | { kind: "activation"; token: string; expiresAt: string }
  /** Nada que mostrar: tag inactivo o lectura sin token. */
  | { kind: "neutral"; reason: "inactive" | "no_token" };

type Strategy = (resolution: ScanResolution) => ScanNavigation;

const withToken = (build: (token: string, resolution: ScanResolution) => ScanNavigation): Strategy =>
  (resolution) =>
    resolution.scanToken ? build(resolution.scanToken, resolution) : { kind: "neutral", reason: "no_token" };

const STRATEGIES: Record<ScanView, Strategy> = {
  FINDER: withToken((token) => ({ kind: "finder", token })),
  GUARDIAN: withToken((token) => ({ kind: "guardian", token })),
  ACTIVATION: withToken((token, resolution) =>
    resolution.expiresAt
      ? { kind: "activation", token, expiresAt: resolution.expiresAt }
      : { kind: "neutral", reason: "no_token" },
  ),
  NEUTRAL: () => ({ kind: "neutral", reason: "inactive" }),
};

export function planScanNavigation(resolution: ScanResolution): ScanNavigation {
  return STRATEGIES[resolution.view](resolution);
}
