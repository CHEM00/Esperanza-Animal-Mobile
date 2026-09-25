import { create } from "zustand";
import type { SecureStorage } from "@/core/ports/secure-storage";

/**
 * Estado de sesión (docs/06 §6): el token portador vive en almacenamiento
 * seguro y en memoria; la UI observa `status`. Fábrica con la storage
 * inyectada para probarla sin dispositivo.
 */

export const SESSION_TOKEN_KEY = "alakito.session-token";

export type SessionStatus = "loading" | "anonymous" | "authenticated";

export interface SessionState {
  status: SessionStatus;
  token: string | null;
  /** Lee el token guardado; se llama una vez al arrancar. */
  hydrate(): Promise<void>;
  setToken(token: string): Promise<void>;
  clear(): Promise<void>;
}

export function createSessionStore(storage: SecureStorage) {
  return create<SessionState>((set) => ({
    status: "loading",
    token: null,
    async hydrate() {
      const token = await storage.get(SESSION_TOKEN_KEY);
      set(token ? { status: "authenticated", token } : { status: "anonymous", token: null });
    },
    async setToken(token) {
      await storage.set(SESSION_TOKEN_KEY, token);
      set({ status: "authenticated", token });
    },
    async clear() {
      await storage.remove(SESSION_TOKEN_KEY);
      set({ status: "anonymous", token: null });
    },
  }));
}

export type SessionStore = ReturnType<typeof createSessionStore>;
