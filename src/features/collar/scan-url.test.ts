import { hrefForDeepLink, resolveDeepLink } from "@/core/navigation/links";
import { parseScanUrl, scanUrlFromRouteParams } from "./scan-url";

const DOMAINS = { linkDomain: "alakito.mx", scheme: "alakito" };
const hrefFor = (url: string) => {
  const link = resolveDeepLink(url, DOMAINS);
  return link ? hrefForDeepLink(link) : null;
};
const P = "a".repeat(32);
const M = "b".repeat(16);

describe("parseScanUrl", () => {
  it("URL grabada en el chip → lectura NFC con p y m", () => {
    expect(parseScanUrl(`https://alakito.mx/t?p=${P}&m=${M}`, DOMAINS, hrefFor)).toEqual({ kind: "nfc", p: P, m: M });
  });

  it("QR impreso → código", () => {
    expect(parseScanUrl("https://alakito.mx/q/ABCDEFGHJK", DOMAINS, hrefFor)).toEqual({ kind: "qr", code: "ABCDEFGHJK" });
  });

  it("otro enlace del dominio se navega tal cual", () => {
    expect(parseScanUrl("https://alakito.mx/publicacion/abc", DOMAINS, hrefFor)).toEqual({
      kind: "other",
      href: "/publicacion/abc",
    });
  });

  it("rechaza dominios ajenos y parámetros mal formados", () => {
    expect(parseScanUrl("https://otro.example/t?p=1&m=2", DOMAINS, hrefFor)).toEqual({ kind: "invalid" });
    expect(parseScanUrl("https://alakito.mx/t?p=corto&m=xx", DOMAINS, hrefFor)).toEqual({ kind: "invalid" });
    expect(parseScanUrl(`https://alakito.mx/q/${"X".repeat(21)}`, DOMAINS, hrefFor)).toEqual({ kind: "invalid" });
    expect(parseScanUrl("no es una url", DOMAINS, hrefFor)).toEqual({ kind: "invalid" });
  });
});

describe("scanUrlFromRouteParams", () => {
  it("prefiere la URL completa y reconstruye las de los enlaces universales", () => {
    expect(scanUrlFromRouteParams({ url: "https://alakito.mx/t?p=1&m=2" }, "alakito.mx")).toBe("https://alakito.mx/t?p=1&m=2");
    expect(scanUrlFromRouteParams({ p: P, m: M }, "alakito.mx")).toBe(`https://alakito.mx/t?p=${P}&m=${M}`);
    expect(scanUrlFromRouteParams({ code: "ABCDEFGHJK" }, "alakito.mx")).toBe("https://alakito.mx/q/ABCDEFGHJK");
  });

  it("sin parámetros no hay nada que resolver", () => {
    expect(scanUrlFromRouteParams({}, "alakito.mx")).toBeNull();
    expect(scanUrlFromRouteParams({ p: P }, "alakito.mx")).toBeNull();
  });
});
