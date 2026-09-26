import type { IdentityProvider, IdentitySignInResult } from "@/core/ports/identity-provider";

/**
 * Google con el selector de cuentas nativo (RF-A2). El ID token se emite para
 * el client ID web del mismo proyecto; el backend lo acepta como audiencia
 * (GOOGLE_MOBILE_CLIENT_IDS). Sin client ID web configurado, el proveedor
 * no está disponible y el botón no aparece.
 *
 * La librería se carga de forma perezosa: su import exige el módulo nativo y
 * truena en Expo Go, donde el proveedor simplemente no está disponible.
 */
export interface GoogleIdentityConfig {
  webClientId: string | null;
  iosClientId: string | null;
}

type GoogleSigninModule = typeof import("@react-native-google-signin/google-signin");

function loadGoogleSignin(): GoogleSigninModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- carga perezosa deliberada (ver cabecera)
    return require("@react-native-google-signin/google-signin") as GoogleSigninModule;
  } catch {
    return null;
  }
}

export function createGoogleIdentityProvider(config: GoogleIdentityConfig): IdentityProvider {
  let configured = false;
  let module: GoogleSigninModule | null | undefined;

  /** Módulo listo y configurado, o null si no hay client ID o no existe el módulo nativo. */
  function ensureConfigured(): GoogleSigninModule | null {
    if (!config.webClientId) {
      return null;
    }
    if (module === undefined) {
      module = loadGoogleSignin();
    }
    if (!module) {
      return null;
    }
    if (!configured) {
      module.GoogleSignin.configure({
        webClientId: config.webClientId,
        ...(config.iosClientId ? { iosClientId: config.iosClientId } : {}),
      });
      configured = true;
    }
    return module;
  }

  return {
    id: "google",

    async isAvailable() {
      const google = ensureConfigured();
      if (!google) {
        return false;
      }
      try {
        // En Android exige Google Play Services; en iOS siempre responde true.
        return await google.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
      } catch {
        return false;
      }
    },

    async signIn(): Promise<IdentitySignInResult> {
      const google = ensureConfigured();
      if (!google) {
        return { status: "unavailable", reason: "Google no está disponible en esta build" };
      }
      try {
        const response = await google.GoogleSignin.signIn();
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
        if (google.isErrorWithCode(error) && error.code === google.statusCodes.SIGN_IN_CANCELLED) {
          return { status: "cancelled" };
        }
        throw error;
      }
    },

    async signOut() {
      if (configured && module) {
        await module.GoogleSignin.signOut();
      }
    },
  };
}
