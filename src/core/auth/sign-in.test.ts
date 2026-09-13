import type { IdentityProvider, IdentitySignInResult } from "@/core/ports/identity-provider";
import { createSignInService, type SignInDeps } from "./sign-in";

function fakeProvider(
  id: IdentityProvider["id"],
  result: IdentitySignInResult,
  available = true,
): IdentityProvider & { signOutCalls: number } {
  const provider = {
    id,
    signOutCalls: 0,
    async isAvailable() {
      return available;
    },
    async signIn() {
      return result;
    },
    async signOut() {
      provider.signOutCalls += 1;
    },
  };
  return provider;
}

interface Harness {
  deps: SignInDeps;
  saved: string[];
  cleared: { count: number };
}

function harness(overrides: Partial<SignInDeps>): Harness {
  const saved: string[] = [];
  const cleared = { count: 0 };
  const deps: SignInDeps = {
    providers: {},
    exchangeIdToken: async (_provider, token) => `sesion-por-${token.idToken}`,
    revokeSession: async () => {},
    saveSessionToken: async (token) => {
      saved.push(token);
    },
    clearSessionToken: async () => {
      cleared.count += 1;
    },
    ...overrides,
  };
  return { deps, saved, cleared };
}

describe("createSignInService", () => {
  it("lista solo los proveedores disponibles en este dispositivo", async () => {
    const { deps } = harness({
      providers: {
        google: fakeProvider("google", { status: "cancelled" }),
        apple: fakeProvider("apple", { status: "cancelled" }, false),
      },
    });

    await expect(createSignInService(deps).availableProviders()).resolves.toEqual(["google"]);
  });

  it("canjea el ID token y guarda el token de sesión", async () => {
    const { deps, saved } = harness({
      providers: { google: fakeProvider("google", { status: "token", token: { idToken: "abc" } }) },
    });

    await expect(createSignInService(deps).signIn("google")).resolves.toEqual({ status: "signed-in" });
    expect(saved).toEqual(["sesion-por-abc"]);
  });

  it("propaga cancelación y no disponibilidad sin tocar la sesión", async () => {
    const { deps, saved } = harness({
      providers: { google: fakeProvider("google", { status: "cancelled" }) },
    });
    const service = createSignInService(deps);

    await expect(service.signIn("google")).resolves.toEqual({ status: "cancelled" });
    await expect(service.signIn("apple")).resolves.toMatchObject({ status: "unavailable" });
    expect(saved).toEqual([]);
  });

  it("reporta fallo del canje sin guardar sesión", async () => {
    const { deps, saved } = harness({
      providers: { google: fakeProvider("google", { status: "token", token: { idToken: "abc" } }) },
      exchangeIdToken: async () => {
        throw new Error("backend caído");
      },
    });

    await expect(createSignInService(deps).signIn("google")).resolves.toMatchObject({
      status: "failed",
    });
    expect(saved).toEqual([]);
  });

  it("al cerrar sesión limpia el token local aunque el backend falle", async () => {
    const google = fakeProvider("google", { status: "cancelled" });
    const { deps, cleared } = harness({
      providers: { google },
      revokeSession: async () => {
        throw new Error("sin red");
      },
    });

    await expect(createSignInService(deps).signOut()).rejects.toThrow("sin red");
    expect(cleared.count).toBe(1);
    expect(google.signOutCalls).toBe(1);
  });
});
