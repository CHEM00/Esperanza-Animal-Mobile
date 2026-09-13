/**
 * Puerto de identidad nativa (docs/06 §6): cada proveedor entrega un ID token
 * que el backend valida con Better Auth. Microsoft usa el navegador del
 * sistema y llega en una sección posterior; por eso no está en la unión.
 */

export type NativeIdentityProviderId = "google" | "apple";

export interface IdentityToken {
  idToken: string;
  /** Nonce en claro cuando el proveedor lo exige (Apple). */
  nonce?: string;
  accessToken?: string;
  /** Apple solo entrega el nombre en el primer inicio de sesión; la forma es la que espera Better Auth. */
  user?: { name?: { firstName?: string; lastName?: string }; email?: string };
}

export type IdentitySignInResult =
  | { status: "token"; token: IdentityToken }
  | { status: "cancelled" }
  | { status: "unavailable"; reason: string };

export interface IdentityProvider {
  readonly id: NativeIdentityProviderId;
  isAvailable(): Promise<boolean>;
  signIn(): Promise<IdentitySignInResult>;
  signOut(): Promise<void>;
}
