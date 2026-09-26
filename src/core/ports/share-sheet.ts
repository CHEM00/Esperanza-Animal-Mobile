/**
 * Puerto para compartir texto y copiar al portapapeles (enlaces de invitación
 * y transferencia, RF-D2 y RF-D4). El adaptador real usa la hoja nativa de
 * React Native y expo-clipboard.
 */

export interface ShareSheet {
  /** Abre la hoja del sistema; resuelve true si la persona eligió un destino. */
  share(input: { message: string; title?: string }): Promise<boolean>;
  copy(text: string): Promise<void>;
}

export function createFakeShareSheet(): ShareSheet & { shared: string[]; copied: string[] } {
  const sheet = {
    shared: [] as string[],
    copied: [] as string[],
    async share(input: { message: string }) {
      sheet.shared.push(input.message);
      return true;
    },
    async copy(text: string) {
      sheet.copied.push(text);
    },
  };
  return sheet;
}
