import type { SecureStorage } from "@/core/ports/secure-storage";

/**
 * Identificador aleatorio por instalación (docs/05 §3, cabecera x-device-id):
 * el backend solo guarda su hash y lo usa para límites de tasa por
 * dispositivo. No identifica al usuario ni al teléfono; se genera una vez y
 * se borra con la app.
 */

export const DEVICE_ID_KEY = "alakito.device-id";

export function createDeviceIdProvider(
  storage: SecureStorage,
  generate: () => string,
): () => Promise<string> {
  let cached: string | null = null;
  return async () => {
    if (cached) {
      return cached;
    }
    const stored = await storage.get(DEVICE_ID_KEY);
    if (stored) {
      cached = stored;
      return stored;
    }
    const fresh = generate();
    await storage.set(DEVICE_ID_KEY, fresh);
    cached = fresh;
    return fresh;
  };
}
