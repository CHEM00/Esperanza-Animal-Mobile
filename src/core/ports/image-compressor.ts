import type { ImageCompressionPolicy } from "@/core/media/image-policy";
import type { PickedImage } from "./image-picker";

/**
 * Puerto de compresión de fotos antes de subir: aplica la política de la
 * configuración remota (lado mayor y calidad JPEG). El adaptador real usa
 * expo-image-manipulator.
 */

export interface UploadableImage {
  uri: string;
  width: number;
  height: number;
  /** Siempre JPEG tras comprimir; el servidor convierte a WebP. */
  mimeType: string;
  fileName: string;
  /** Tamaño en bytes cuando el sistema lo informa; null si no se pudo medir. */
  bytes: number | null;
}

export interface ImageCompressor {
  compress(image: PickedImage, policy: ImageCompressionPolicy): Promise<UploadableImage>;
}

/** Doble que «comprime» sin tocar el archivo. */
export function createPassthroughCompressor(): ImageCompressor {
  return {
    async compress(image) {
      return {
        uri: image.uri,
        width: image.width,
        height: image.height,
        mimeType: "image/jpeg",
        fileName: image.fileName ?? "foto.jpg",
        bytes: null,
      };
    },
  };
}
