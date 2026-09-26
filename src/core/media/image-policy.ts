/**
 * Política de fotos antes de subir (misma regla que `lib/image-compress.ts`
 * de la web): el lado mayor se limita a `clientImageMaxDimension` y se guarda
 * como JPEG con `clientImageQuality`. Los valores llegan por configuración
 * remota para que web y app compriman igual. Módulo puro; el adaptador de
 * expo-image-manipulator aplica el plan.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageCompressionPolicy {
  /** Lado mayor máximo en píxeles. */
  maxDimension: number;
  /** Calidad JPEG entre 0 y 1. */
  quality: number;
  /** Peso máximo aceptado por el servidor; se valida antes de intentar la subida. */
  maxBytes: number;
}

export interface ResizePlan {
  /** Dimensiones destino; iguales a las originales cuando no hace falta encoger. */
  target: ImageDimensions;
  /** Si hay que redimensionar (la recompresión a JPEG se hace siempre). */
  shouldResize: boolean;
}

/** Escala proporcional para que el lado mayor no supere `maxDimension`. */
export function planResize(source: ImageDimensions, maxDimension: number): ResizePlan {
  const longest = Math.max(source.width, source.height);
  if (longest <= maxDimension || longest === 0) {
    return { target: { ...source }, shouldResize: false };
  }
  const scale = maxDimension / longest;
  return {
    target: {
      width: Math.max(1, Math.round(source.width * scale)),
      height: Math.max(1, Math.round(source.height * scale)),
    },
    shouldResize: true,
  };
}

/** Política a partir de los límites de la configuración remota. */
export function policyFromLimits(limits: {
  clientImageMaxDimension: number;
  clientImageQuality: number;
  maxPhotoBytes: number;
}): ImageCompressionPolicy {
  return {
    maxDimension: limits.clientImageMaxDimension,
    quality: limits.clientImageQuality,
    maxBytes: limits.maxPhotoBytes,
  };
}

/** Cuántas fotos más caben respetando el tope del servidor. */
export function remainingPhotoSlots(current: number, maxPhotos: number): number {
  return Math.max(0, maxPhotos - current);
}
