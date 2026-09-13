import Constants from "expo-constants";
import { parseAppConfig, type AppConfig } from "./app-config";

/**
 * Configuración validada al arrancar (docs/06 §12): si falta algo, la app no
 * continúa, igual que el backend con sus variables. Cada `process.env.EXPO_PUBLIC_*`
 * se escribe literal porque Expo lo sustituye en tiempo de build.
 */
export const appConfig: AppConfig = parseAppConfig({
  publicEnv: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  },
  extra: Constants.expoConfig?.extra,
  appVersion: Constants.expoConfig?.version,
});

export type { AppConfig, AppEnvironment } from "./app-config";
