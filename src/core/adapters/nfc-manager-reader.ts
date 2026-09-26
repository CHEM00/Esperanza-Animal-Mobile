import { Platform } from "react-native";
import NfcManager, { Ndef, NfcTech, type TagEvent } from "react-native-nfc-manager";
import type { NfcReader, NfcReadResult } from "@/core/ports/nfc-reader";

/**
 * Adaptador de react-native-nfc-manager (docs/06 §8): abre una sesión de
 * lectura NDEF en primer plano y devuelve la primera URL del tag. En iOS la
 * hoja del sistema muestra `prompt`; en Android se lee con la pantalla
 * encendida. Nunca escribe ni autentica.
 */

let started = false;

async function ensureStarted(): Promise<void> {
  if (!started) {
    await NfcManager.start();
    started = true;
  }
}

/** Primera URL de los registros NDEF; null si el tag no trae una. */
export function firstNdefUrl(tag: TagEvent | null): string | null {
  for (const record of tag?.ndefMessage ?? []) {
    if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
      const url = Ndef.uri.decodePayload(record.payload as unknown as Uint8Array);
      if (url) {
        return url;
      }
    }
  }
  return null;
}

function isUserCancellation(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /cancel/i.test(message);
}

export function createNfcManagerReader(): NfcReader {
  let cancelling = false;

  return {
    async isSupported() {
      try {
        return await NfcManager.isSupported();
      } catch {
        return false;
      }
    },

    async isEnabled() {
      if (Platform.OS !== "android") {
        return true;
      }
      try {
        return await NfcManager.isEnabled();
      } catch {
        return false;
      }
    },

    async readUrl({ prompt }): Promise<NfcReadResult> {
      if (!(await this.isSupported())) {
        return { status: "unavailable", reason: "unsupported" };
      }
      if (!(await this.isEnabled())) {
        return { status: "unavailable", reason: "disabled" };
      }
      cancelling = false;
      try {
        await ensureStarted();
        await NfcManager.requestTechnology(NfcTech.Ndef, { alertMessage: prompt });
        const tag = await NfcManager.getTag();
        const url = firstNdefUrl(tag);
        return url ? { status: "url", url } : { status: "not_url" };
      } catch (error) {
        if (cancelling || isUserCancellation(error)) {
          return { status: "cancelled" };
        }
        return {
          status: "failed",
          message: error instanceof Error ? error.message : "Lectura NFC fallida",
        };
      } finally {
        await NfcManager.cancelTechnologyRequest().catch(() => undefined);
      }
    },

    async cancel() {
      cancelling = true;
      await NfcManager.cancelTechnologyRequest().catch(() => undefined);
    },

    async openSettings() {
      if (Platform.OS === "android") {
        await NfcManager.goToNfcSetting();
      }
    },
  };
}
