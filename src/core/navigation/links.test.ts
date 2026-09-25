import { APP_ROUTES, hrefForDeepLink, resolveDeepLink } from "./links";

const DOMAINS = { linkDomain: "rescate.example.test", scheme: "alakito" };

describe("resolveDeepLink", () => {
  it("reconoce la URL del collar con sus parámetros", () => {
    const link = resolveDeepLink("https://rescate.example.test/t?p=AA&m=BB", DOMAINS);

    expect(link).toEqual({ kind: "tagScan", segment: null, query: { p: "AA", m: "BB" } });
    expect(hrefForDeepLink(link!)).toBe(`${APP_ROUTES.scanResolve}?p=AA&m=BB`);
  });

  it("reconoce rutas con segmento y las traduce a la ruta interna", () => {
    expect(resolveDeepLink("https://rescate.example.test/encontre/tok-1", DOMAINS)).toEqual({
      kind: "finder",
      segment: "tok-1",
      query: {},
    });
    expect(hrefForDeepLink(resolveDeepLink("https://rescate.example.test/publicacion/abc/", DOMAINS)!)).toBe(
      "/publicacion/abc",
    );
    expect(hrefForDeepLink(resolveDeepLink("https://rescate.example.test/q/XYZ", DOMAINS)!)).toBe(
      `${APP_ROUTES.scanResolve}?code=XYZ`,
    );
  });

  it("acepta el esquema propio de la app", () => {
    expect(resolveDeepLink("alakito://invitacion/c0d3", DOMAINS)).toMatchObject({
      kind: "guardianInvite",
      segment: "c0d3",
    });
  });

  it("ignora otros dominios, rutas desconocidas y segmentos anidados", () => {
    expect(resolveDeepLink("https://otro.example.test/t?p=1", DOMAINS)).toBeNull();
    expect(resolveDeepLink("https://rescate.example.test/inicio", DOMAINS)).toBeNull();
    expect(resolveDeepLink("https://rescate.example.test/publicacion", DOMAINS)).toBeNull();
    expect(resolveDeepLink("https://rescate.example.test/publicacion/a/b", DOMAINS)).toBeNull();
    expect(resolveDeepLink("no es una url", DOMAINS)).toBeNull();
  });
});
