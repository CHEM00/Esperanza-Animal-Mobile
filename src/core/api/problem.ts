/**
 * Errores de la API como datos (docs/05 §3): el backend responde Problem
 * Details con un `code` estable y la app decide el texto a partir de él.
 * Módulo puro.
 */

export interface ProblemFieldError {
  path: string;
  message: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code: string;
  requestId: string;
  detail?: string;
  errors?: ProblemFieldError[];
}

export type ApiErrorKind = "problem" | "network" | "unexpected";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly code: string | null;
  readonly requestId: string | null;
  readonly detail: string | null;
  readonly fieldErrors: readonly ProblemFieldError[];

  constructor(input: {
    kind: ApiErrorKind;
    message: string;
    status?: number | null;
    code?: string | null;
    requestId?: string | null;
    detail?: string | null;
    fieldErrors?: readonly ProblemFieldError[];
    cause?: unknown;
  }) {
    super(input.message, { cause: input.cause });
    this.name = "ApiError";
    this.kind = input.kind;
    this.status = input.status ?? null;
    this.code = input.code ?? null;
    this.requestId = input.requestId ?? null;
    this.detail = input.detail ?? null;
    this.fieldErrors = input.fieldErrors ?? [];
  }
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.code === "string" &&
    typeof candidate.status === "number" &&
    typeof candidate.title === "string"
  );
}

/** Convierte el error de una respuesta (cuerpo ya parseado) en `ApiError`. */
export function apiErrorFromResponse(
  status: number,
  body: unknown,
  requestId: string | null,
): ApiError {
  if (isProblemDetails(body)) {
    return new ApiError({
      kind: "problem",
      message: body.detail ?? body.title,
      status: body.status,
      code: body.code,
      requestId: body.requestId ?? requestId,
      detail: body.detail ?? null,
      fieldErrors: body.errors ?? [],
    });
  }
  return new ApiError({
    kind: "unexpected",
    message: `Respuesta inesperada del servidor (${status})`,
    status,
    requestId,
  });
}

export function apiErrorFromNetwork(cause: unknown): ApiError {
  return new ApiError({
    kind: "network",
    message: "No se pudo conectar con el servidor",
    cause,
  });
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
