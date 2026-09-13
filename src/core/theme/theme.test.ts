import { createTheme, resolveThemeMode } from "./theme";
import { darkTokens, lightTokens } from "./tokens.generated";

describe("createTheme", () => {
  it("el tema claro usa los tokens claros y Quicksand", () => {
    const theme = createTheme("light");
    expect(theme.colors).toBe(lightTokens);
    expect(theme.fonts.display.bold).toBe("Quicksand_700Bold");
    expect(theme.fonts.body.regular).toBe("Quicksand_400Regular");
  });

  it("el tema oscuro usa los tokens de sysosa con Space Grotesk e Inter", () => {
    const theme = createTheme("dark");
    expect(theme.colors).toBe(darkTokens);
    expect(theme.colors.primary).not.toBe(lightTokens.primary);
    expect(theme.fonts.display.bold).toBe("SpaceGrotesk_700Bold");
    expect(theme.fonts.body.regular).toBe("Inter_400Regular");
  });

  it("los tokens generados traen la marca de la web", () => {
    expect(lightTokens.primary).toBe("#0f9d8f");
    expect(darkTokens.bg).toBe("#161413");
    expect(createTheme("light").radii.card).toBe(16);
  });
});

describe("resolveThemeMode", () => {
  it("la preferencia manual manda sobre el sistema", () => {
    expect(resolveThemeMode("dark", "light")).toBe("dark");
    expect(resolveThemeMode("light", "dark")).toBe("light");
  });

  it("con preferencia de sistema sigue al dispositivo y cae en claro sin dato", () => {
    expect(resolveThemeMode("system", "dark")).toBe("dark");
    expect(resolveThemeMode("system", null)).toBe("light");
  });
});
