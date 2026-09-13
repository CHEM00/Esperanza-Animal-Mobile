import * as AppleAuthentication from "expo-apple-authentication";
import { CryptoDigestAlgorithm, digestStringAsync, randomUUID } from "expo-crypto";
import { Platform } from "react-native";
import type { IdentityProvider, IdentitySignInResult } from "@/core/ports/identity-provider";

/**
 * Sign in with Apple nativo (RF-A3). Apple exige un nonce: se envía su SHA-256
 * al sistema y el nonce en claro al backend, que compara ambas formas. El
 * nombre solo llega en el primer inicio de sesión, por eso se reenvía.
 */
const CANCELLED_CODE = "ERR_REQUEST_CANCELED";

function isCancelled(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === CANCELLED_CODE
  );
}

export function createAppleIdentityProvider(): IdentityProvider {
  return {
    id: "apple",

    async isAvailable() {
      if (Platform.OS !== "ios") {
        return false;
      }
      return AppleAuthentication.isAvailableAsync();
    },

    async signIn(): Promise<IdentitySignInResult> {
      const nonce = randomUUID();
      const hashedNonce = await digestStringAsync(CryptoDigestAlgorithm.SHA256, nonce);
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
          nonce: hashedNonce,
        });
        if (!credential.identityToken) {
          return { status: "unavailable", reason: "Apple no entregó un identityToken" };
        }
        const firstName = credential.fullName?.givenName ?? undefined;
        const lastName = credential.fullName?.familyName ?? undefined;
        return {
          status: "token",
          token: {
            idToken: credential.identityToken,
            nonce,
            user: {
              ...(firstName || lastName ? { name: { firstName, lastName } } : {}),
              email: credential.email ?? undefined,
            },
          },
        };
      } catch (error) {
        if (isCancelled(error)) {
          return { status: "cancelled" };
        }
        throw error;
      }
    },

    async signOut() {
      // Apple no expone cierre de sesión; la sesión propia se invalida en el backend.
    },
  };
}
