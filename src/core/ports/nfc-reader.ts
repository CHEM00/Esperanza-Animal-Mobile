/**
 * Puerto de lectura NFC en primer plano (docs/06 §8, ADR-003): la app solo lee
 * la URL NDEF del collar; nunca autentica con el chip ni conoce llaves. El
 * adaptador real usa react-native-nfc-manager; las pruebas usan un doble.
 */

export type NfcReadResult =
  | { status: "url"; url: string }
  | { status: "cancelled" }
  /** El chip respondió pero no traía una URL NDEF (no es un collar). */
  | { status: "not_url" }
  | { status: "unavailable"; reason: NfcUnavailableReason }
  | { status: "failed"; message: string };

export type NfcUnavailableReason = "unsupported" | "disabled";

export interface NfcReader {
  /** El dispositivo tiene NFC y la app puede usarlo. */
  isSupported(): Promise<boolean>;
  /** En Android el usuario puede tener el NFC apagado; iOS siempre responde true. */
  isEnabled(): Promise<boolean>;
  /** Abre la sesión de lectura (hoja del sistema en iOS) y espera un collar. */
  readUrl(options: { prompt: string }): Promise<NfcReadResult>;
  /** Cierra una lectura en curso (al salir de la pantalla). */
  cancel(): Promise<void>;
  /** Abre los ajustes de NFC del sistema cuando está apagado (solo Android). */
  openSettings(): Promise<void>;
}

/** Doble para pruebas y para el simulador, con lecturas programadas. */
export function createFakeNfcReader(
  results: NfcReadResult[],
  options: { supported?: boolean; enabled?: boolean } = {},
): NfcReader & { readCount: number; cancelled: boolean } {
  const queue = [...results];
  const reader = {
    readCount: 0,
    cancelled: false,
    async isSupported() {
      return options.supported ?? true;
    },
    async isEnabled() {
      return options.enabled ?? true;
    },
    async readUrl(): Promise<NfcReadResult> {
      reader.readCount += 1;
      return queue.shift() ?? { status: "cancelled" };
    },
    async cancel() {
      reader.cancelled = true;
    },
    async openSettings() {},
  };
  return reader;
}
