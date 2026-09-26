import { useWindowDimensions } from "react-native";

/**
 * Medidas de composición compartidas (docs/06 §10): el ancho de lectura de
 * la web (390) y el margen lateral. Única fuente para pantallas y galerías.
 */
export const CONTENT_MAX_WIDTH = 390;
export const HORIZONTAL_PADDING = 18;

/** Ancho útil del contenido en el dispositivo actual. */
export function useContentWidth(): number {
  const { width } = useWindowDimensions();
  return Math.min(width, CONTENT_MAX_WIDTH) - HORIZONTAL_PADDING * 2;
}
