import { isApiError } from "@/core/api/problem";

/**
 * Textos en es-MX para los códigos de problema del backend (docs/05 §3). La
 * app nunca muestra el texto del servidor: traduce por código para que el
 * mensaje sea coherente con la pantalla. Códigos desconocidos caen en el
 * genérico; agregar uno nuevo es agregar una fila.
 */

export const PROBLEM_MESSAGES: Readonly<Record<string, string>> = {
  "auth.required": "Inicia sesión para continuar.",
  "auth.suspended":
    "Tu cuenta está suspendida: puedes seguir viendo casos, pero no publicar ni interactuar.",
  "auth.forbidden": "No tienes permiso para hacer eso.",
  "validation.failed": "Revisa los datos marcados e inténtalo de nuevo.",
  unsupported_media_type: "El formato enviado no es válido.",
  not_found: "Eso ya no existe o no está disponible.",
  rate_limited: "Espera un momento antes de volver a intentar.",
  internal_error: "Algo falló de nuestro lado. Inténtalo más tarde.",
  "scan.token_required": "Acerca tu teléfono al collar para continuar.",
  "scan.token_invalid": "La lectura del collar ya no es válida. Vuelve a acercar el teléfono.",
  "app.update_required": "Necesitas actualizar la app para continuar.",
};

export const NETWORK_MESSAGE = "Sin conexión. Revisa tu red e inténtalo de nuevo.";
export const GENERIC_MESSAGE = "No se pudo completar la acción. Inténtalo de nuevo.";

export function messageForError(error: unknown): string {
  if (isApiError(error)) {
    if (error.kind === "network") {
      return NETWORK_MESSAGE;
    }
    if (error.code && PROBLEM_MESSAGES[error.code]) {
      return PROBLEM_MESSAGES[error.code] ?? GENERIC_MESSAGE;
    }
  }
  return GENERIC_MESSAGE;
}
