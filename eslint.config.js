const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

/**
 * Reglas de capas (docs/06 §2 y §3): las rutas solo componen pantallas; las
 * pantallas y componentes hablan con repositorios y hooks, nunca con el
 * cliente HTTP generado ni con los adaptadores de dispositivo.
 */
const GENERATED_CLIENT = ["@/core/api/generated", "@/core/api/generated/*"];
const DEVICE_ADAPTERS = ["@/core/adapters/*"];

module.exports = defineConfig([
  ...expoConfig,
  globalIgnores([
    "node_modules/**",
    "dist/**",
    ".expo/**",
    "android/**",
    "ios/**",
    "coverage/**",
    "src/core/api/generated/**",
    "src/core/theme/tokens.generated.ts",
  ]),
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [...GENERATED_CLIENT, ...DEVICE_ADAPTERS, "@/features/*/repository", "@/features/*/repository/*"],
              message:
                "Una ruta solo compone pantallas de features; el acceso a datos y a dispositivo vive en hooks y repositorios.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/screens/**/*.{ts,tsx}", "src/features/**/components/**/*.{ts,tsx}", "src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [...GENERATED_CLIENT, ...DEVICE_ADAPTERS],
              message:
                "La UI no importa el cliente generado ni adaptadores de dispositivo: usa el repositorio o el hook de la feature.",
            },
          ],
        },
      ],
    },
  },
]);
