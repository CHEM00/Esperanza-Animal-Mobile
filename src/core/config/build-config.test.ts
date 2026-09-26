import { APP_IDENTITY } from "../../../config/app-identity";
import { ENVIRONMENTS, readBuildConfig } from "../../../config/build-config";

describe("readBuildConfig", () => {
  it("con el entorno vacío devuelve la identidad publicada (así lo evalúa EAS)", () => {
    const build = readBuildConfig({});

    expect(build).toMatchObject({
      environment: "development",
      name: APP_IDENTITY.name,
      slug: APP_IDENTITY.slug,
      owner: APP_IDENTITY.owner,
      androidPackage: APP_IDENTITY.androidPackage,
      iosBundleId: APP_IDENTITY.iosBundleId,
      scheme: APP_IDENTITY.scheme,
      linkDomain: APP_IDENTITY.linkDomain,
      easProjectId: APP_IDENTITY.easProjectId,
      googleIosUrlScheme: null,
      googleMapsAndroidApiKey: null,
    });
  });

  it("una variante sobrescribe paquete, bundle id, esquema y dominio", () => {
    const build = readBuildConfig({
      APP_ENV: "preview",
      APP_ANDROID_PACKAGE: "mx.com.sysosa.rescate.dev",
      APP_IOS_BUNDLE_ID: "mx.com.sysosa.rescate.dev",
      APP_SCHEME: "alakito-dev",
      APP_LINK_DOMAIN: "pruebas.alakito.mx",
      GOOGLE_IOS_URL_SCHEME: " com.googleusercontent.apps.123 ",
    });

    expect(build).toMatchObject({
      environment: "preview",
      androidPackage: "mx.com.sysosa.rescate.dev",
      iosBundleId: "mx.com.sysosa.rescate.dev",
      scheme: "alakito-dev",
      linkDomain: "pruebas.alakito.mx",
      googleIosUrlScheme: "com.googleusercontent.apps.123",
    });
    expect(build.name).toBe(APP_IDENTITY.name);
    expect(build.easProjectId).toBe(APP_IDENTITY.easProjectId);
  });

  it("rechaza una sobrescritura mal formada en lugar de aceptarla a ciegas", () => {
    expect(() => readBuildConfig({ APP_SCHEME: "alakito://" })).toThrow(/APP_SCHEME/);
    expect(() => readBuildConfig({ APP_ANDROID_PACKAGE: "sinpuntos" })).toThrow(
      /APP_ANDROID_PACKAGE/,
    );
    expect(() => readBuildConfig({ APP_LINK_DOMAIN: "https://alakito.mx" })).toThrow(
      /APP_LINK_DOMAIN/,
    );
  });

  it("solo admite los entornos de eas.json", () => {
    expect(ENVIRONMENTS).toEqual(["development", "preview", "production"]);
    expect(() => readBuildConfig({ APP_ENV: "staging" })).toThrow(/APP_ENV/);
  });
});
