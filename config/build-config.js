/**
 * Configuración de build que lee app.config.ts (docs/06 §12): identidad de la
 * app y dominio de enlaces. Vive fuera de src/ porque corre en Node al
 * evaluar la configuración de Expo, no en el bundle. Es JavaScript común
 * porque el cargador de configuración de Expo no resuelve módulos TypeScript
 * locales; los tipos van en JSDoc y los verifica `tsc` (allowJs).
 */

/** @typedef {"development" | "preview" | "production"} AppEnvironment */

/**
 * @typedef {object} BuildConfig
 * @property {AppEnvironment} environment
 * @property {string} androidPackage
 * @property {string} iosBundleId
 * @property {string} scheme
 * @property {string} linkDomain
 * @property {string | null} easProjectId
 * @property {string | null} googleIosUrlScheme
 */

/** @type {readonly AppEnvironment[]} */
const ENVIRONMENTS = ["development", "preview", "production"];
const REVERSE_DNS = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i;
const SCHEME = /^[a-z][a-z0-9+.-]*$/;
const DOMAIN = /^[a-z0-9.-]+\.[a-z]{2,}$/i;

/**
 * @param {NodeJS.ProcessEnv} source
 * @param {string} name
 * @param {RegExp} pattern
 * @param {string} hint
 * @returns {string}
 */
function required(source, name, pattern, hint) {
  const value = source[name]?.trim();
  if (!value) {
    throw new Error(`Falta ${name} en el entorno de build (${hint}). Copia .env.example a .env.`);
  }
  if (!pattern.test(value)) {
    throw new Error(`${name} no tiene la forma esperada (${hint}): ${value}`);
  }
  return value;
}

/**
 * @param {NodeJS.ProcessEnv} source
 * @param {string} name
 * @returns {string | null}
 */
function optional(source, name) {
  const value = source[name]?.trim();
  return value ? value : null;
}

/**
 * @param {NodeJS.ProcessEnv} [source]
 * @returns {BuildConfig}
 */
function readBuildConfig(source = process.env) {
  const rawEnvironment = source.APP_ENV?.trim() || "development";
  const environment = ENVIRONMENTS.find((candidate) => candidate === rawEnvironment);
  if (!environment) {
    throw new Error(`APP_ENV debe ser uno de: ${ENVIRONMENTS.join(", ")}`);
  }
  return {
    environment,
    androidPackage: required(source, "APP_ANDROID_PACKAGE", REVERSE_DNS, "paquete Android en notación inversa"),
    iosBundleId: required(source, "APP_IOS_BUNDLE_ID", REVERSE_DNS, "bundle id de iOS en notación inversa"),
    scheme: required(source, "APP_SCHEME", SCHEME, "esquema de URL sin ://"),
    linkDomain: required(source, "APP_LINK_DOMAIN", DOMAIN, "dominio sin https://"),
    easProjectId: optional(source, "EAS_PROJECT_ID"),
    googleIosUrlScheme: optional(source, "GOOGLE_IOS_URL_SCHEME"),
  };
}

module.exports = { readBuildConfig };
