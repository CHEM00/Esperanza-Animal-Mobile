import { createSignInService, type SignInDeps } from "./sign-in";

/** Sesión de desarrollo: el servicio guarda el token tal cual (recortado) y rechaza el vacío. */
function harness() {
  const saved: string[] = [];
  const deps: SignInDeps = {
    providers: {},
    exchangeIdToken: async () => "no-se-usa",
    revokeSession: async () => {},
    saveSessionToken: async (token) => {
      saved.push(token);
    },
    clearSessionToken: async () => {},
  };
  return { service: createSignInService(deps), saved };
}

describe("SignInService.adoptToken", () => {
  it("guarda el token recortado y queda con sesión", async () => {
    const { service, saved } = harness();
    await expect(service.adoptToken("  abc.def  ")).resolves.toEqual({ status: "signed-in" });
    expect(saved).toEqual(["abc.def"]);
  });

  it("rechaza un token vacío sin tocar el almacenamiento", async () => {
    const { service, saved } = harness();
    const outcome = await service.adoptToken("   ");
    expect(outcome.status).toBe("failed");
    expect(saved).toEqual([]);
  });
});
