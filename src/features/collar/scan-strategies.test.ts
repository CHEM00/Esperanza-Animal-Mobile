import { planScanNavigation } from "./scan-strategies";

const EXPIRES = "2026-09-25T12:15:00.000Z";

describe("planScanNavigation (una URL, tres vistas)", () => {
  it("finder con token → vista de hallazgo", () => {
    expect(planScanNavigation({ view: "FINDER", tagStatus: "ACTIVO", scanToken: "t1", expiresAt: EXPIRES })).toEqual({
      kind: "finder",
      token: "t1",
    });
  });

  it("guardián con token → perfil propio vía token", () => {
    expect(planScanNavigation({ view: "GUARDIAN", tagStatus: "ACTIVO", scanToken: "t2", expiresAt: EXPIRES })).toEqual({
      kind: "guardian",
      token: "t2",
    });
  });

  it("activación con token y vencimiento → M4", () => {
    expect(planScanNavigation({ view: "ACTIVATION", tagStatus: "LISTO", scanToken: "t3", expiresAt: EXPIRES })).toEqual({
      kind: "activation",
      token: "t3",
      expiresAt: EXPIRES,
    });
  });

  it("neutra o sin token → pantalla neutra con el motivo", () => {
    expect(planScanNavigation({ view: "NEUTRAL", tagStatus: null, scanToken: null, expiresAt: null })).toEqual({
      kind: "neutral",
      reason: "inactive",
    });
    expect(planScanNavigation({ view: "FINDER", tagStatus: "ACTIVO", scanToken: null, expiresAt: null })).toEqual({
      kind: "neutral",
      reason: "no_token",
    });
    expect(planScanNavigation({ view: "ACTIVATION", tagStatus: "LISTO", scanToken: "t", expiresAt: null })).toEqual({
      kind: "neutral",
      reason: "no_token",
    });
  });
});
