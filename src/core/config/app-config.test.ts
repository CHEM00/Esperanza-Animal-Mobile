import { parseAppConfig, type AppConfigSources } from "./app-config";

const VALID: AppConfigSources = {
  publicEnv: {
    apiBaseUrl: "https://rescate.example.test",
    googleWebClientId: "web-id",
    googleIosClientId: "",
  },
  extra: { environment: "preview", linkDomain: "rescate.example.test", scheme: "esperanzaanimal" },
  appVersion: "0.1.0",
};

describe("parseAppConfig", () => {
  it("acepta la configuración completa y trata cadenas vacías como ausentes", () => {
    const config = parseAppConfig(VALID);

    expect(config.environment).toBe("preview");
    expect(config.apiBaseUrl).toBe("https://rescate.example.test");
    expect(config.googleWebClientId).toBe("web-id");
    expect(config.googleIosClientId).toBeNull();
  });

  it("usa development como entorno cuando extra no lo trae", () => {
    expect(parseAppConfig({ ...VALID, extra: { ...VALID.extra, environment: undefined } }).environment).toBe(
      "development",
    );
  });

  it("truena con un mensaje que nombra cada valor inválido", () => {
    expect(() =>
      parseAppConfig({
        ...VALID,
        publicEnv: { ...VALID.publicEnv, apiBaseUrl: "sin-esquema" },
        appVersion: "1.0",
      }),
    ).toThrow(/apiBaseUrl[\s\S]*appVersion/);
  });

  it("exige dominio de enlaces y esquema desde app.config.ts", () => {
    expect(() => parseAppConfig({ ...VALID, extra: null })).toThrow(/linkDomain/);
  });
});
