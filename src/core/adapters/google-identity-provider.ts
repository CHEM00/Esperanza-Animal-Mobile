import { GoogleSignin, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";
import type { IdentityProvider, IdentitySignInResult } from "@/core/ports/identity-provider";

/**
 * Google con el selector de cuentas nativo (RF-A2). El ID token se emite para
 * el client ID web del mismo proyecto; el backend lo acepta como audiencia
 * (GOOGLE_MOBILE_CLIENT_IDS). Sin client ID web configurado, el proveedor
 * no está disponible y el botón no aparece.
 */
export interface GoogleIdentityConfig {
  webClientId: string | null;
  iosClientId: string | null;
}

export function createGoogleIdentityProvider(config: GoogleIdentityConfig): IdentityProvider {
  let configured = false;

  function ensureConfigured(): boolean {
    if (!config.webClientId) {
      return false;
    }
    if (!configured) {
      GoogleSignin.configure({
        webClientId: config.webClientId,
        ...(config.iosClientId ? { iosClientId: config.iosClientId } : {}),
      });
      configured = true;
    }
    return true;
  }

  return {
    id: "google",

    async isAvailable() {
      if (!ensureConfigured()) {
        return false;
      }
      try {
        // En Android exige Google Play Services; en iOS siempre responde true.
        return await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
      } catch {
        return false;
      }
    },

    async signIn(): Promise<IdentitySignInResult> {
      if (!ensureConfigured()) {
        return { status: "unavailable", reason: "Google no está configurado en esta build" };
      }
      try {
        const response = await GoogleSignin.signIn();
        if (response.type !== "success") {
          return { status: "cancelled" };
        }
        const { idToken, user } = response.data;
        if (!idToken) {
          return { status: "unavailable", reason: "Google no entregó un ID token" };
        }
        return {
          status: "token",
          token: {
            idToken,
            user: {
              name: {
                firstName: user.givenName ?? undefined,
                lastName: user.familyName ?? undefined,
              },
              email: user.email,
            },
          },
        };
      } catch (error) {
        if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
          return { status: "cancelled" };
        }
        throw error;
      }
    },

    async signOut() {
      if (configured) {
        await GoogleSignin.signOut();
      }
    },
  };
}
