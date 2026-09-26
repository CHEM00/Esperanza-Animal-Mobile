/**
 * Puerto de selección de fotos (docs/06 §2): galería o cámara del sistema.
 * Devuelve archivos locales sin procesar; la compresión es otro puerto.
 */

export interface PickedImage {
  /** URI local (file:// o content://) que el sistema entrega. */
  uri: string;
  width: number;
  height: number;
  mimeType: string | null;
  fileName: string | null;
}

export type ImagePickResult =
  | { status: "picked"; images: PickedImage[] }
  | { status: "cancelled" }
  /** Permiso negado de forma definitiva; la pantalla ofrece ir a ajustes. */
  | { status: "denied" };

export interface ImagePicker {
  /** Hasta `limit` fotos de la galería. */
  pickFromLibrary(limit: number): Promise<ImagePickResult>;
  /** Una foto con la cámara. */
  takePhoto(): Promise<ImagePickResult>;
}

/** Doble para pruebas con resultados programados. */
export function createFakeImagePicker(results: ImagePickResult[]): ImagePicker {
  const queue = [...results];
  const next = async (): Promise<ImagePickResult> => queue.shift() ?? { status: "cancelled" };
  return { pickFromLibrary: next, takePhoto: next };
}
