import type {
  IdentityProvider,
  IdentityToken,
  NativeIdentityProviderId,
} from "@/core/ports/identity-provider";

/**
 * Fachada de inicio de sesión (docs/06 §6): elige el proveedor nativo, obtiene
 * el ID token y lo canjea en el backend por un token de sesión. Fábrica pura:
 * el canje y el guardado se inyectan.
 */

export type SignInOutcome =
  | { status: "signed-in" }
  | { status: "cancelled" }
  | { status: "unavailable"; reason: string }
  | { status: "failed"; error: unknown };

export interface SignInDeps {
  providers: Partial<Record<NativeIdentityProviderId, IdentityProvider>>;
  /** Canjea el ID token en Better Auth y devuelve el token de sesión. */
  exchangeIdToken: (
    providerId: NativeIdentityProviderId,
    token: IdentityToken,
  ) => Promise<string>;
  /** Avisa al backend y devuelve; los errores no impiden cerrar sesión local. */
  revokeSession: () => Promise<void>;
  saveSessionToken: (token: string) => Promise<void>;
  clearSessionToken: () => Promise<void>;
}

export interface SignInService {
  availableProviders(): Promise<NativeIdentityProviderId[]>;
  signIn(providerId: NativeIdentityProviderId): Promise<SignInOutcome>;
  signOut(): Promise<void>;
}

export function createSignInService(deps: SignInDeps): SignInService {
  return {
    async availableProviders() {
      const entries = Object.values(deps.providers).filter(
        (provider): provider is IdentityProvider => provider !== undefined,
      );
      const flags = await Promise.all(entries.map((provider) => provider.isAvailable()));
      return entries.filter((_, index) => flags[index]).map((provider) => provider.id);
    },

    async signIn(providerId) {
      const provider = deps.providers[providerId];
      if (!provider || !(await provider.isAvailable())) {
        return { status: "unavailable", reason: `Proveedor ${providerId} no disponible` };
      }
      try {
        const result = await provider.signIn();
        if (result.status === "cancelled") {
          return { status: "cancelled" };
        }
        if (result.status === "unavailable") {
          return { status: "unavailable", reason: result.reason };
        }
        const sessionToken = await deps.exchangeIdToken(providerId, result.token);
        await deps.saveSessionToken(sessionToken);
        return { status: "signed-in" };
      } catch (error) {
        return { status: "failed", error };
      }
    },

    async signOut() {
      try {
        await deps.revokeSession();
      } finally {
        await deps.clearSessionToken();
        await Promise.all(
          Object.values(deps.providers).map((provider) => provider?.signOut()),
        );
      }
    },
  };
}
