import { compareSemver, isUpdateRequired } from "./version-gate";

describe("compareSemver", () => {
  it("compara por mayor, menor y parche en orden", () => {
    expect(compareSemver("1.2.3", "1.2.3")).toBe(0);
    expect(compareSemver("1.2.3", "1.2.4")).toBeLessThan(0);
    expect(compareSemver("1.10.0", "1.9.9")).toBeGreaterThan(0);
    expect(compareSemver("2.0.0", "1.99.99")).toBeGreaterThan(0);
  });

  it("rechaza versiones que no son semver", () => {
    expect(() => compareSemver("1.2", "1.2.3")).toThrow(/inválida/);
  });
});

describe("isUpdateRequired", () => {
  it("sin mínimo nunca exige actualizar", () => {
    expect(isUpdateRequired("0.1.0", null)).toBe(false);
  });

  it("exige actualizar solo por debajo del mínimo", () => {
    expect(isUpdateRequired("0.9.9", "1.0.0")).toBe(true);
    expect(isUpdateRequired("1.0.0", "1.0.0")).toBe(false);
    expect(isUpdateRequired("1.0.1", "1.0.0")).toBe(false);
  });
});
