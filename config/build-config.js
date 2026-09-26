/**
 * Configuración de build que lee app.config.ts (docs/06 §12): la identidad publicada
 * (config/app-identity.js) más lo que sí depende del entorno. Vive fuera de src/ porque
 * corre en Node al evaluar la configuración de Expo, no en el bundle. Es JavaScript común
 * porque el cargador de configuración de Expo no resuelve módulos TypeScript locales; los
 * tipos van en JSDoc y los verifica `tsc` (allowJs).
 *
 * Debe evaluarse con el entorno vacío: EAS no carga .env en los comandos sin entorno.
 */
const { APP_IDENTITY } = require("./app-identity");

/** @typedef {"development" | "preview" | "production"} AppEnvironment */

/**
 * @typedef {object} BuildConfig
 * @property {AppEnvironment} environment
 * @property {string} name
 * @property {string} slug
 * @property {string} owner
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
 * Valor de identidad: el del entorno si viene (variante de build), validado; si no, el
 * publicado en config/app-identity.js.
 * @param {Readonly<Record<string, string | undefined>>} source
 * @param {string} name
 * @param {RegExp} pattern
 * @param {string} hint
 * @param {string} fallback
 * @returns {string}
 */
function identity(source, name, pattern, hint, fallback) {
  const value = source[name]?.trim();
  if (!value) {
    return fallback;
  }
  if (!pattern.test(value)) {
    throw new Error(`${name} no tiene la forma esperada (${hint}): ${value}`);
  }
  return value;
}

/**
 * @param {Readonly<Record<string, string | undefined>>} source
 * @param {string} name
 * @returns {string | null}
 */
function optional(source, name) {
  const value = source[name]?.trim();
  return value ? value : null;
}

/**
 * @param {Readonly<Record<string, string | undefined>>} [source]
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
    name: APP_IDENTITY.name,
    slug: APP_IDENTITY.slug,
    owner: APP_IDENTITY.owner,
    androidPackage: identity(source, "APP_ANDROID_PACKAGE", REVERSE_DNS, "paquete Android en notación inversa", APP_IDENTITY.androidPackage),
    iosBundleId: identity(source, "APP_IOS_BUNDLE_ID", REVERSE_DNS, "bundle id de iOS en notación inversa", APP_IDENTITY.iosBundleId),
    scheme: identity(source, "APP_SCHEME", SCHEME, "esquema de URL sin ://", APP_IDENTITY.scheme),
    linkDomain: identity(source, "APP_LINK_DOMAIN", DOMAIN, "dominio sin https://", APP_IDENTITY.linkDomain),
    easProjectId: optional(source, "EAS_PROJECT_ID"),
    googleIosUrlScheme: optional(source, "GOOGLE_IOS_URL_SCHEME"),
  };
}

module.exports = { readBuildConfig, ENVIRONMENTS };
