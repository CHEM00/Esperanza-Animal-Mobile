import { createAuthClient } from "better-auth/react";
import { appConfig } from "@/core/config";
import { sessionStore } from "./session";

/**
 * Cliente de Better Auth para la app (docs/05 §2): cada petición lleva el
 * token de sesión como portador y, al iniciar sesión, el backend devuelve el
 * token nuevo en el encabezado `set-auth-token` (plugin bearer del servidor).
 */

export const SESSION_TOKEN_RESPONSE_HEADER = "set-auth-token";

export const authClient = createAuthClient({
  baseURL: appConfig.apiBaseUrl,
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => sessionStore.getState().token ?? "",
    },
  },
});

/** Extrae el token de sesión que el backend adjunta a una respuesta exitosa. */
export function sessionTokenFromResponse(response: Response): string | null {
  return response.headers.get(SESSION_TOKEN_RESPONSE_HEADER);
}
