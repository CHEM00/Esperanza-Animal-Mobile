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
  "scan.not_reportable": "Este collar no puede recibir avisos ahora mismo.",
  "scan.muted": "La familia ya fue avisada hace poco; gracias por intentarlo.",
  "scan.cooldown": "Ya enviaste un aviso hace poco. Espera unos minutos.",
  "scan.daily_limit": "Este collar ya recibió los avisos del día por QR.",
  "tag.under_review": "Este collar está en revisión y no puede usarse por ahora.",
  "tag.not_activatable": "Este collar no está listo para activarse o ya tiene mascota.",
  "tag.not_linked": "Este collar no está vinculado a ninguna mascota.",
  "pet.limit_reached": "Llegaste al máximo de mascotas por cuenta.",
  "pet.not_owner": "Solo el dueño de la mascota puede hacer eso.",
  "pet.invalid_state": "La mascota no está en un estado que permita esa acción.",
  "pet.microchip_locked": "El microchip no se puede cambiar desde la app; escríbenos.",
  "profile.incomplete": "Completa tu perfil (colonia y contacto) antes de continuar.",
  "photo.invalid": "Alguna foto no es válida. Prueba con otra imagen.",
  "photo.limit": "Ya no caben más fotos.",
  "guardian.limit_reached": "La mascota ya tiene el máximo de guardianes.",
  "invite.invalid": "La invitación ya se usó o no existe.",
  "invite.expired": "La invitación caducó; pide otra.",
  "transfer.invalid": "La transferencia ya se resolvió o no es para ti.",
  "transfer.expired": "La transferencia caducó; pide otra.",
  "transfer.pending_exists": "Ya hay una transferencia pendiente de esta mascota.",
  "colonia.not_selectable": "Esa colonia no está disponible por ahora.",
  "publication.daily_limit": "Llegaste al límite de publicaciones de hoy.",
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
