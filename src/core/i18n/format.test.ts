import {
  elapsedDays,
  formatHours,
  formatPhoneDisplay,
  formatRelative,
  formatRemaining,
  fromIsoDate,
  toIsoDate,
} from "./format";

const NOW = new Date("2026-09-25T12:00:00Z");

describe("formatRelative (misma regla que la web)", () => {
  it.each([
    [new Date("2026-09-25T11:59:30Z"), "justo ahora"],
    [new Date("2026-09-25T11:40:00Z"), "hace 20 min"],
    [new Date("2026-09-25T09:00:00Z"), "hace 3 h"],
    [new Date("2026-09-24T09:00:00Z"), "hace 1 día"],
    [new Date("2026-09-20T09:00:00Z"), "hace 5 días"],
  ])("%s → %s", (date, expected) => {
    expect(formatRelative(date, NOW)).toBe(expected);
  });

  it("a partir de un mes muestra la fecha corta", () => {
    expect(formatRelative(new Date("2026-08-01T09:00:00Z"), NOW)).toMatch(/^el 1 ago/);
  });
});

describe("formatos de apoyo", () => {
  it("teléfono en tres bloques", () => {
    expect(formatPhoneDisplay("9211234567")).toBe("921 123 4567");
  });

  it("horas de silencio en palabras", () => {
    expect(formatHours(4)).toBe("4 h");
    expect(formatHours(24)).toBe("1 día");
    expect(formatHours(72)).toBe("3 días");
    expect(formatHours(168)).toBe("1 semana");
  });

  it("tiempo restante hasta una fecha", () => {
    expect(formatRemaining(new Date("2026-09-25T12:20:00Z"), NOW)).toBe("quedan 20 min");
    expect(formatRemaining(new Date("2026-09-25T13:00:00Z"), NOW)).toBe("queda 1 h");
    expect(formatRemaining(new Date("2026-09-27T12:00:00Z"), NOW)).toBe("quedan 2 días");
    expect(formatRemaining(new Date("2026-09-25T11:00:00Z"), NOW)).toBe("");
  });

  it("días transcurridos, mínimo uno", () => {
    expect(elapsedDays(new Date("2026-09-25T10:00:00Z"), NOW)).toBe(1);
    expect(elapsedDays(new Date("2026-09-22T12:00:00Z"), NOW)).toBe(3);
  });

  it("fecha ISO local de ida y vuelta", () => {
    const date = fromIsoDate("2024-02-29");
    expect(date).not.toBeNull();
    expect(toIsoDate(date as Date)).toBe("2024-02-29");
    expect(fromIsoDate("29/02/2024")).toBeNull();
    expect(fromIsoDate(null)).toBeNull();
  });
});
