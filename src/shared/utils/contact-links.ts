/**
 * Enlaces de contacto (misma regla que `lib/contact-links.ts` de la web): el
 * teléfono se guarda con diez dígitos nacionales y WhatsApp exige el código de
 * país. Módulo puro.
 */

/** Código de país de México para WhatsApp. */
export const MX_COUNTRY_CODE = "52";

/** Solo dígitos. */
export function digitsOf(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function telUrl(phone: string): string {
  return `tel:${digitsOf(phone)}`;
}

export function whatsappUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${MX_COUNTRY_CODE}${digitsOf(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
