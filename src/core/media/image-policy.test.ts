import { planResize, policyFromLimits, remainingPhotoSlots } from "./image-policy";

describe("planResize", () => {
  it("encoge proporcionalmente cuando el lado mayor supera el máximo", () => {
    expect(planResize({ width: 4000, height: 3000 }, 1600)).toEqual({
      target: { width: 1600, height: 1200 },
      shouldResize: true,
    });
    expect(planResize({ width: 1200, height: 3200 }, 1600)).toEqual({
      target: { width: 600, height: 1600 },
      shouldResize: true,
    });
  });

  it("no toca una foto que ya cabe ni una sin dimensiones", () => {
    expect(planResize({ width: 800, height: 600 }, 1600)).toEqual({
      target: { width: 800, height: 600 },
      shouldResize: false,
    });
    expect(planResize({ width: 0, height: 0 }, 1600).shouldResize).toBe(false);
  });
});

describe("policyFromLimits", () => {
  it("toma los tres valores de la configuración remota", () => {
    expect(
      policyFromLimits({ clientImageMaxDimension: 1600, clientImageQuality: 0.85, maxPhotoBytes: 8 }),
    ).toEqual({ maxDimension: 1600, quality: 0.85, maxBytes: 8 });
  });
});

describe("remainingPhotoSlots", () => {
  it("nunca es negativo", () => {
    expect(remainingPhotoSlots(1, 4)).toBe(3);
    expect(remainingPhotoSlots(4, 4)).toBe(0);
    expect(remainingPhotoSlots(6, 4)).toBe(0);
  });
});
