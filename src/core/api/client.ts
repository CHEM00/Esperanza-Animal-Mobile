import createClient, { type Client, type Middleware } from "openapi-fetch";
import type { paths } from "./generated/schema";
import { apiErrorFromNetwork, apiErrorFromResponse, type ApiError } from "./problem";

/**
 * Cliente HTTP tipado por el contrato (docs/05 §6). Fábrica pura: recibe sus
 * dependencias (token de sesión, id de dispositivo, generador de ids) y las
 * pruebas usan dobles. Ninguna pantalla lo importa: pasa por repositorios.
 */

/** Cabeceras acordadas con el backend (docs/05 §2 y §3). */
export const API_HEADERS = {
  authorization: "authorization",
  requestId: "x-request-id",
  deviceId: "x-device-id",
  scanToken: "x-scan-token",
} as const;

const BEARER_PREFIX = "Bearer ";

export interface ApiClientDeps {
  baseUrl: string;
  getSessionToken: () => string | null | Promise<string | null>;
  getDeviceId: () => string | null | Promise<string | null>;
  newRequestId: () => string;
  fetch?: typeof globalThis.fetch;
}

export type ApiClient = Client<paths>;

export function createApiClient(deps: ApiClientDeps): ApiClient {
  const client = createClient<paths>({
    baseUrl: deps.baseUrl,
    ...(deps.fetch ? { fetch: deps.fetch } : {}),
  });

  const headers: Middleware = {
    async onRequest({ request }) {
      request.headers.set(API_HEADERS.requestId, deps.newRequestId());
      const token = await deps.getSessionToken();
      if (token) {
        request.headers.set(API_HEADERS.authorization, `${BEARER_PREFIX}${token}`);
      }
      const deviceId = await deps.getDeviceId();
      if (deviceId) {
        request.headers.set(API_HEADERS.deviceId, deviceId);
      }
      return request;
    },
  };
  client.use(headers);
  return client;
}

interface FetchResult<T> {
  data?: T;
  error?: unknown;
  response: Response;
}

/**
 * openapi-fetch devuelve `{ data, error }`; los repositorios prefieren lanzar
 * `ApiError` para que TanStack Query y las pantallas traten un solo tipo.
 */
export function unwrap<T>(result: FetchResult<T>): T {
  if (result.error !== undefined || result.data === undefined) {
    throw apiErrorFromResponse(
      result.response.status,
      result.error,
      result.response.headers.get(API_HEADERS.requestId),
    );
  }
  return result.data;
}

/** Envuelve una llamada para convertir fallos de red en `ApiError`. */
export async function call<T>(run: () => Promise<FetchResult<T>>): Promise<T> {
  let result: FetchResult<T>;
  try {
    result = await run();
  } catch (cause) {
    throw apiErrorFromNetwork(cause);
  }
  return unwrap(result);
}

export type { ApiError };
