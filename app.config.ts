import type { ConfigContext, ExpoConfig } from "expo/config";
import { readBuildConfig } from "./config/build-config";
import deepLinkPaths from "./config/deep-link-paths.json";

/**
 * Configuración de Expo (docs/06 §12). La identidad publicada vive en
 * config/app-identity.js y el entorno de build (validado en config/build-config.js)
 * solo aporta lo que cambia por perfil o la sobrescribe para una variante; nada se
 * escribe dos veces. Los valores que la app necesita en tiempo de ejecución viajan en
 * `extra`.
 */

/** Tokens de marca del splash (tema claro): la pantalla nativa no conoce el tema del usuario. */
const SPLASH_BACKGROUND = "#f6faf9";
const ADAPTIVE_ICON_BACKGROUND = "#f6faf9";

const build = readBuildConfig();
const linkPathPrefixes = deepLinkPaths.paths.map((entry) =>
  entry.pattern.replace(/\/\*$/, ""),
);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: build.name,
  slug: build.slug,
  owner: build.owner,
  version: "0.1.0",
  orientation: "portrait",
  scheme: build.scheme,
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: build.iosBundleId,
    supportsTablet: false,
    associatedDomains: [`applinks:${build.linkDomain}`],
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: build.androidPackage,
    adaptiveIcon: {
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundColor: ADAPTIVE_ICON_BACKGROUND,
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: linkPathPrefixes.map((pathPrefix) => ({
          scheme: "https",
          host: build.linkDomain,
          pathPrefix,
        })),
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 160,
        resizeMode: "contain",
        backgroundColor: SPLASH_BACKGROUND,
      },
    ],
    "expo-secure-store",
    "expo-font",
    "expo-web-browser",
    "expo-apple-authentication",
    ...(build.googleIosUrlScheme
      ? [
          [
            "@react-native-google-signin/google-signin",
            { iosUrlScheme: build.googleIosUrlScheme },
          ] as [string, unknown],
        ]
      : []),
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    environment: build.environment,
    linkDomain: build.linkDomain,
    scheme: build.scheme,
    eas: { projectId: build.easProjectId },
  },
});
