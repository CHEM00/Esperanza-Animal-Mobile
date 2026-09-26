import { useCallback, useState } from "react";
import { imageCompressor, imagePicker } from "@/core/device";
import { policyFromLimits, remainingPhotoSlots } from "@/core/media/image-policy";
import type { UploadableImage } from "@/core/ports/image-compressor";
import type { ImagePickResult } from "@/core/ports/image-picker";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { PETS_STRINGS } from "../strings";

/**
 * Elegir y preparar fotos (RF-C2): galería o cámara, compresión con la
 * política remota y tope de fotos del servidor. Devuelve archivos listos para
 * el multipart; la pantalla decide cuándo subirlos.
 */
export function usePhotoPicker(currentCount: number) {
  const remoteConfig = useRemoteConfig();
  const [preparing, setPreparing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const limits = remoteConfig.data?.limits ?? null;
  const maxPhotos = limits?.maxPhotos ?? 0;
  const remaining = remainingPhotoSlots(currentCount, maxPhotos);

  const prepare = useCallback(
    async (result: ImagePickResult): Promise<UploadableImage[]> => {
      if (result.status === "denied") {
        setMessage(PETS_STRINGS.form.photos.denied);
        return [];
      }
      if (result.status === "cancelled" || !limits) {
        return [];
      }
      setPreparing(true);
      try {
        const policy = policyFromLimits(limits);
        const selected = result.images.slice(0, remaining);
        return await Promise.all(selected.map((image) => imageCompressor.compress(image, policy)));
      } finally {
        setPreparing(false);
      }
    },
    [limits, remaining],
  );

  const pickFromLibrary = useCallback(async () => {
    setMessage(null);
    if (remaining === 0) {
      return [];
    }
    return prepare(await imagePicker.pickFromLibrary(remaining));
  }, [prepare, remaining]);

  const takePhoto = useCallback(async () => {
    setMessage(null);
    if (remaining === 0) {
      return [];
    }
    return prepare(await imagePicker.takePhoto());
  }, [prepare, remaining]);

  return { pickFromLibrary, takePhoto, preparing, message, remaining, maxPhotos, minPhotos: limits?.minPhotos ?? 1 };
}
