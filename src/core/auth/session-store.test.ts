import { createMemorySecureStorage } from "@/core/ports/secure-storage";
import { SESSION_TOKEN_KEY, createSessionStore } from "./session-store";

describe("session store", () => {
  it("arranca cargando y queda anónimo si no hay token guardado", async () => {
    const store = createSessionStore(createMemorySecureStorage());
    expect(store.getState().status).toBe("loading");

    await store.getState().hydrate();

    expect(store.getState()).toMatchObject({ status: "anonymous", token: null });
  });

  it("recupera el token guardado al hidratar", async () => {
    const store = createSessionStore(
      createMemorySecureStorage({ [SESSION_TOKEN_KEY]: "guardado" }),
    );

    await store.getState().hydrate();

    expect(store.getState()).toMatchObject({ status: "authenticated", token: "guardado" });
  });

  it("persiste al iniciar sesión y borra al cerrarla", async () => {
    const storage = createMemorySecureStorage();
    const store = createSessionStore(storage);

    await store.getState().setToken("nuevo");
    expect(await storage.get(SESSION_TOKEN_KEY)).toBe("nuevo");
    expect(store.getState().status).toBe("authenticated");

    await store.getState().clear();
    expect(await storage.get(SESSION_TOKEN_KEY)).toBeNull();
    expect(store.getState()).toMatchObject({ status: "anonymous", token: null });
  });
});
