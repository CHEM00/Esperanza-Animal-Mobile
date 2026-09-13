import { createAppleIdentityProvider } from "@/core/adapters/apple-identity-provider";
import { createGoogleIdentityProvider } from "@/core/adapters/google-identity-provider";
import { appConfig } from "@/core/config";
import type { IdentityToken, NativeIdentityProviderId } from "@/core/ports/identity-provider";
import { authClient, sessionTokenFromResponse } from "./auth-client";
import { sessionStore } from "./session";
import { createSignInService, type SignInService } from "./sign-in";

/**
 * Servicio de sesión del proceso (docs/06 §6): une los proveedores nativos
 * con el canje de ID token en Better Auth y el almacén de sesión.
 */

async function exchangeIdToken(
  providerId: NativeIdentityProviderId,
  token: IdentityToken,
): Promise<string> {
  let sessionToken: string | null = null;
  const result = await authClient.signIn.social({
    provider: providerId,
    idToken: {
      token: token.idToken,
      ...(token.nonce ? { nonce: token.nonce } : {}),
      ...(token.accessToken ? { accessToken: token.accessToken } : {}),
      ...(token.user ? { user: token.user } : {}),
    },
    fetchOptions: {
      onSuccess(context) {
        sessionToken = sessionTokenFromResponse(context.response);
      },
    },
  });
  if (result.error) {
    throw new Error(result.error.message ?? "El servidor rechazó el inicio de sesión");
  }
  if (!sessionToken) {
    throw new Error("El servidor no devolvió un token de sesión");
  }
  return sessionToken;
}

async function revokeSession(): Promise<void> {
  const result = await authClient.signOut();
  if (result.error) {
    throw new Error(result.error.message ?? "No se pudo cerrar la sesión en el servidor");
  }
}

export const signInService: SignInService = createSignInService({
  providers: {
    google: createGoogleIdentityProvider({
      webClientId: appConfig.googleWebClientId,
      iosClientId: appConfig.googleIosClientId,
    }),
    apple: createAppleIdentityProvider(),
  },
  exchangeIdToken,
  revokeSession,
  saveSessionToken: (token) => sessionStore.getState().setToken(token),
  clearSessionToken: () => sessionStore.getState().clear(),
});
