import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import type { ShareSheet } from "@/core/ports/share-sheet";

/** Hoja de compartir del sistema y portapapeles. */
export function createNativeShareSheet(): ShareSheet {
  return {
    async share({ message, title }) {
      const result = await Share.share({ message, ...(title ? { title } : {}) });
      return result.action === Share.sharedAction;
    },
    async copy(text) {
      await Clipboard.setStringAsync(text);
    },
  };
}
