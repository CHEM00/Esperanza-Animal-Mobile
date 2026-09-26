/**
 * Identidad publicada de la app (docs/06 §12, ADR-014). Son identificadores públicos e
 * inmutables: cambiar el paquete o el bundle id equivale a publicar otra app, y el
 * esquema y el dominio están reclamados en los archivos de asociación del backend. Por
 * eso viven en código y no en el entorno. Además, EAS evalúa app.config.ts sin cargar
 * .env (EXPO_NO_DOTENV) en los comandos que no tienen entorno, como `eas init`,
 * `eas credentials` o `eas project:info`, y la configuración debe evaluarse igual.
 *
 * El entorno de build puede sobrescribir paquete, bundle id, esquema y dominio para una
 * variante (por ejemplo, una build de desarrollo con sufijo); ver config/build-config.js.
 */

/**
 * @typedef {object} AppIdentity
 * @property {string} name          Nombre visible en el dispositivo y en las tiendas.
 * @property {string} slug          Slug del proyecto en Expo; debe coincidir con EAS.
 * @property {string} owner         Cuenta de Expo (organización) dueña del proyecto.
 * @property {string} androidPackage Paquete Android publicado en Play (no cambia).
 * @property {string} iosBundleId   Bundle id de iOS; coincide con IOS_BUNDLE_ID del backend.
 * @property {string} scheme        Esquema propio para el retorno de OAuth, sin `://`.
 * @property {string} linkDomain    Dominio de enlaces universales y App Links, sin https://.
 */

/** @type {Readonly<AppIdentity>} */
const APP_IDENTITY = Object.freeze({
  name: "Alakito",
  slug: "alakito",
  owner: "sysosa",
  androidPackage: "mx.com.sysosa.rescate",
  iosBundleId: "mx.com.sysosa.rescate",
  scheme: "alakito",
  linkDomain: "alakito.mx",
});

module.exports = { APP_IDENTITY };
