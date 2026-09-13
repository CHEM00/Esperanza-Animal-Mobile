import { useEffect } from "react";
import { sessionStore } from "./session";

/** Estado de sesión observable desde la UI. */
export function useSession() {
  return sessionStore((state) => ({ status: state.status, token: state.token }));
}

export function useIsAuthenticated(): boolean {
  return sessionStore((state) => state.status === "authenticated");
}

/** Hidrata la sesión una vez al arrancar; devuelve true cuando ya se leyó. */
export function useSessionHydration(): boolean {
  const status = sessionStore((state) => state.status);
  useEffect(() => {
    if (status === "loading") {
      void sessionStore.getState().hydrate();
    }
  }, [status]);
  return status !== "loading";
}
