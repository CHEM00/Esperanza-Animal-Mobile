import type { paths } from "./generated/schema";

/**
 * Utilidades de tipo sobre el contrato generado (docs/05 §6): extraen el cuerpo
 * de petición de una operación para que cada repositorio declare sus tipos sin
 * repetir la condicional. Solo tipos: no emite código.
 */

type Operation<P extends keyof paths, M extends keyof paths[P]> = paths[P][M];

/** Cuerpo JSON de una operación (`application/json`). */
export type JsonBody<P extends keyof paths, M extends keyof paths[P]> =
  Operation<P, M> extends { requestBody: { content: { "application/json": infer B } } } ? B : never;

/** Cuerpo multipart de una operación (`multipart/form-data`). */
export type MultipartBody<P extends keyof paths, M extends keyof paths[P]> =
  Operation<P, M> extends { requestBody: { content: { "multipart/form-data": infer B } } } ? B : never;

/** Parámetros de consulta de una operación. */
export type QueryParams<P extends keyof paths, M extends keyof paths[P]> =
  Operation<P, M> extends { parameters: { query?: infer Q } } ? NonNullable<Q> : never;
