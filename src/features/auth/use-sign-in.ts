import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { signInService } from "@/core/auth/auth-service";
import type { SignInOutcome } from "@/core/auth/sign-in";
import type { NativeIdentityProviderId } from "@/core/ports/identity-provider";
import { AUTH_STRINGS } from "./strings";

/**
 * Caso de uso de inicio de sesión para la pantalla 3b: proveedores
 * disponibles, estado de carga y mensaje de resultado en es-MX.
 */
export function useSignIn() {
  const queryClient = useQueryClient();
  const [available, setAvailable] = useState<NativeIdentityProviderId[] | null>(null);
  const [busy, setBusy] = useState<NativeIdentityProviderId | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void signInService.availableProviders().then((providers) => {
      if (active) {
        setAvailable(providers);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(
    async (providerId: NativeIdentityProviderId): Promise<SignInOutcome> => {
      setBusy(providerId);
      setMessage(null);
      try {
        const outcome = await signInService.signIn(providerId);
        if (outcome.status === "signed-in") {
          // La sesión cambió: todo lo que dependa de ella se vuelve a pedir.
          await queryClient.invalidateQueries();
        } else if (outcome.status === "cancelled") {
          setMessage(AUTH_STRINGS.cancelled);
        } else if (outcome.status === "unavailable") {
          setMessage(AUTH_STRINGS.unavailable);
        } else {
          setMessage(AUTH_STRINGS.failed);
        }
        return outcome;
      } finally {
        setBusy(null);
      }
    },
    [queryClient],
  );

  /** Sesión de desarrollo: guarda el token y refresca todo lo que depende de la sesión. */
  const adoptToken = useCallback(
    async (token: string): Promise<boolean> => {
      setBusy("google");
      try {
        const outcome = await signInService.adoptToken(token);
        if (outcome.status === "signed-in") {
          await queryClient.invalidateQueries();
          return true;
        }
        return false;
      } finally {
        setBusy(null);
      }
    },
    [queryClient],
  );

  const signOut = useCallback(async () => {
    try {
      await signInService.signOut();
    } finally {
      queryClient.clear();
    }
  }, [queryClient]);

  return { available, busy, message, signIn, adoptToken, signOut };
}
