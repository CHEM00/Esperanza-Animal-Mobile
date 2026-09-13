/**
 * Puerto de almacenamiento seguro (docs/06 §3): token de sesión e
 * identificador de dispositivo. El adaptador real usa expo-secure-store; las
 * pruebas usan uno en memoria.
 */
export interface SecureStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export function createMemorySecureStorage(
  initial: Record<string, string> = {},
): SecureStorage {
  const store = new Map(Object.entries(initial));
  return {
    async get(key) {
      return store.get(key) ?? null;
    },
    async set(key, value) {
      store.set(key, value);
    },
    async remove(key) {
      store.delete(key);
    },
  };
}
