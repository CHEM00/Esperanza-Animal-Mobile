import type { ApiClient } from "./client";

/**
 * Registro del cliente de la API (docs/06 §3, patrón fábrica + inyección).
 * La raíz de composición (index.ts) construye el cliente real al arrancar y lo
 * registra aquí; los repositorios lo piden en el momento de la llamada. Así un
 * repositorio no arrastra la configuración del proceso al importarse y las
 * pruebas le pasan un cliente con fetch falso.
 */

let current: ApiClient | null = null;

export function setApiClient(client: ApiClient): void {
  current = client;
}

export function getApiClient(): ApiClient {
  if (!current) {
    throw new Error("Cliente de la API no instalado: llama a bootstrapCore() al arrancar");
  }
  return current;
}

/** Solo para pruebas. */
export function resetApiClient(): void {
  current = null;
}

export { call, unwrap, API_HEADERS } from "./client";
export type { ApiClient } from "./client";
export { ApiError, isApiError } from "./problem";
export type { components, paths } from "./generated/schema";
