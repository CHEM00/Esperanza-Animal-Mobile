import { z } from "zod";

/**
 * Configuración de la app en tiempo de ejecución (docs/06 §12): valores
 * públicos que Expo inserta en el bundle (`EXPO_PUBLIC_*`) y los que
 * app.config.ts deja en `extra`. Módulo puro: la lectura del entorno real
 * vive en index.ts; aquí solo el esquema y el parseo, probados sin Expo.
 */

export const APP_ENVIRONMENTS = ["development", "preview", "production"] as const;
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

const appConfigSchema = z.object({
  environment: z.enum(APP_ENVIRONMENTS),
  apiBaseUrl: z.url({ error: "EXPO_PUBLIC_API_BASE_URL debe ser una URL" }),
  linkDomain: z.string().min(1, "extra.linkDomain vacío (app.config.ts)"),
  scheme: z.string().min(1, "extra.scheme vacío (app.config.ts)"),
  appVersion: z
    .string()
    .regex(SEMVER_PATTERN, "La versión de la app debe ser semver mayor.menor.parche"),
  googleWebClientId: z.string().min(1).nullable(),
  googleIosClientId: z.string().min(1).nullable(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export interface AppConfigSources {
  /** Variables públicas ya leídas con `process.env.EXPO_PUBLIC_*` literales. */
  publicEnv: {
    apiBaseUrl: string | undefined;
    googleWebClientId: string | undefined;
    googleIosClientId: string | undefined;
  };
  /** `Constants.expoConfig.extra` tal como lo dejó app.config.ts. */
  extra: Record<string, unknown> | null | undefined;
  /** `Constants.expoConfig.version`. */
  appVersion: string | null | undefined;
}

function nullable(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function extraString(extra: AppConfigSources["extra"], key: string): string {
  const value = extra?.[key];
  return typeof value === "string" ? value : "";
}

export function parseAppConfig(sources: AppConfigSources): AppConfig {
  const result = appConfigSchema.safeParse({
    environment: extraString(sources.extra, "environment") || "development",
    apiBaseUrl: sources.publicEnv.apiBaseUrl?.trim() ?? "",
    linkDomain: extraString(sources.extra, "linkDomain"),
    scheme: extraString(sources.extra, "scheme"),
    appVersion: sources.appVersion ?? "",
    googleWebClientId: nullable(sources.publicEnv.googleWebClientId),
    googleIosClientId: nullable(sources.publicEnv.googleIosClientId),
  });
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Configuración de la app inválida:\n${issues}`);
  }
  return result.data;
}
