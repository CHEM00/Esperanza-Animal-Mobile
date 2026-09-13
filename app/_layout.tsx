import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { useSessionHydration } from "@/core/auth/use-session";
import { isApiError } from "@/core/api/problem";
import { useAppFonts } from "@/core/theme/fonts";
import { useTheme } from "@/core/theme/use-theme";
import { ConfigGate } from "@/features/shell/config-gate";

/**
 * Raíz de la app (docs/06 §2): fuentes, sesión, caché de consultas y puerta
 * de configuración. Las rutas solo componen pantallas.
 */

void SplashScreen.preventAutoHideAsync();

/** Reintentos solo ante red o 5xx; nunca ante 4xx (docs/06 §11). */
const MAX_RETRIES = 2;
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) {
    return false;
  }
  if (isApiError(error)) {
    return error.kind === "network" || (error.status !== null && error.status >= 500);
  }
  return false;
}

export default function RootLayout() {
  const fontsReady = useAppFonts();
  const sessionReady = useSessionHydration();
  const theme = useTheme();
  const queryClient = useMemo(
    () => new QueryClient({ defaultOptions: { queries: { retry: shouldRetry } } }),
    [],
  );

  const ready = fontsReady && sessionReady;
  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <ConfigGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.bg },
          }}
        />
      </ConfigGate>
    </QueryClientProvider>
  );
}
