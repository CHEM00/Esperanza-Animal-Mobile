/**
 * Formato de fechas, teléfonos y duraciones en es-MX (docs/06 §14). Replica
 * `lib/relative-time.ts` y `formatPhoneDisplay` de la web para que el mismo
 * dato se lea igual en ambos clientes. Módulo puro: recibe el «ahora».
 */

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
/** A partir de un mes se muestra la fecha corta en vez de «hace N días». */
const RELATIVE_LIMIT_DAYS = 30;

const shortDate = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
const longDate = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dateTime = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

/** «16 ago» (sin el punto que agrega Intl a la abreviatura del mes). */
export function formatShortDate(date: Date): string {
  return shortDate.format(date).replace(".", "");
}

/** «16 de agosto de 2026». */
export function formatLongDate(date: Date): string {
  return longDate.format(date);
}

/** «16 ago, 14:05». */
export function formatDateTime(date: Date): string {
  return dateTime.format(date).replace(".", "");
}

/** «justo ahora» · «hace N min» · «hace N h» · «hace N día(s)» · «el 16 ago». */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const elapsedMs = now.getTime() - date.getTime();
  if (elapsedMs < MINUTE_MS) {
    return "justo ahora";
  }
  if (elapsedMs < HOUR_MS) {
    return `hace ${Math.floor(elapsedMs / MINUTE_MS)} min`;
  }
  if (elapsedMs < DAY_MS) {
    return `hace ${Math.floor(elapsedMs / HOUR_MS)} h`;
  }
  const days = Math.floor(elapsedMs / DAY_MS);
  if (days < RELATIVE_LIMIT_DAYS) {
    return days === 1 ? "hace 1 día" : `hace ${days} días`;
  }
  return `el ${formatShortDate(date)}`;
}

/** Días completos entre dos fechas, mínimo 1 («3 días de búsqueda»). */
export function elapsedDays(from: Date, to: Date): number {
  return Math.max(1, Math.round((to.getTime() - from.getTime()) / DAY_MS));
}

/** «921 123 4567» para un teléfono de diez dígitos, como en la web. */
export function formatPhoneDisplay(phone: string): string {
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
}

/** «4 h» · «1 día» · «3 días» · «1 semana» para las opciones de silencio. */
export function formatHours(hours: number): string {
  if (hours % (24 * 7) === 0) {
    const weeks = hours / (24 * 7);
    return weeks === 1 ? "1 semana" : `${weeks} semanas`;
  }
  if (hours % 24 === 0) {
    const days = hours / 24;
    return days === 1 ? "1 día" : `${days} días`;
  }
  return `${hours} h`;
}

/** Tiempo restante en palabras («queda 1 h», «quedan 20 min»); vacío si ya venció. */
export function formatRemaining(until: Date, now: Date = new Date()): string {
  const remainingMs = until.getTime() - now.getTime();
  if (remainingMs <= 0) {
    return "";
  }
  if (remainingMs < HOUR_MS) {
    const minutes = Math.max(1, Math.ceil(remainingMs / MINUTE_MS));
    return minutes === 1 ? "queda 1 min" : `quedan ${minutes} min`;
  }
  if (remainingMs < DAY_MS) {
    const hours = Math.ceil(remainingMs / HOUR_MS);
    return hours === 1 ? "queda 1 h" : `quedan ${hours} h`;
  }
  const days = Math.ceil(remainingMs / DAY_MS);
  return days === 1 ? "queda 1 día" : `quedan ${days} días`;
}

/** Fecha ISO (`YYYY-MM-DD`) de un Date en la zona local: para el campo de nacimiento. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Date local desde `YYYY-MM-DD`; null si la cadena no tiene esa forma. */
export function fromIsoDate(value: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) {
    return null;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
