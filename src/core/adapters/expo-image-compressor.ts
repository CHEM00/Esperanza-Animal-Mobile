import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { planResize } from "@/core/media/image-policy";
import type { ImageCompressor, UploadableImage } from "@/core/ports/image-compressor";

/**
 * Adaptador de expo-image-manipulator: aplica el plan de redimensión y
 * recomprime a JPEG con la calidad de la política. Convierte además formatos
 * del teléfono (HEIC) a JPEG universal, como hace la web en el navegador.
 */

const JPEG_EXTENSION = ".jpg";

function jpegName(original: string | null): string {
  const base = (original ?? "foto").replace(/\.\w+$/, "");
  return `${base}${JPEG_EXTENSION}`;
}

export function createExpoImageCompressor(): ImageCompressor {
  return {
    async compress(image, policy): Promise<UploadableImage> {
      const plan = planResize({ width: image.width, height: image.height }, policy.maxDimension);
      const context = ImageManipulator.manipulate(image.uri);
      if (plan.shouldResize) {
        context.resize(plan.target);
      }
      const rendered = await context.renderAsync();
      const saved = await rendered.saveAsync({ compress: policy.quality, format: SaveFormat.JPEG });
      rendered.release();
      return {
        uri: saved.uri,
        width: saved.width,
        height: saved.height,
        mimeType: "image/jpeg",
        fileName: jpegName(image.fileName),
        bytes: null,
      };
    },
  };
}
