import { installApiClient } from "@/core/api";

/**
 * Arranque del núcleo (docs/06 §2): aquí se instalan las piezas con efectos
 * que el resto de la app pide por registro. Lo llama la raíz de rutas una vez.
 */
export function bootstrapCore(): void {
  installApiClient();
}
