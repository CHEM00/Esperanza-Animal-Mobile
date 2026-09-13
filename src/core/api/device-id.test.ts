import { createMemorySecureStorage } from "@/core/ports/secure-storage";
import { DEVICE_ID_KEY, createDeviceIdProvider } from "./device-id";

describe("createDeviceIdProvider", () => {
  it("genera un id una sola vez y lo persiste", async () => {
    const storage = createMemorySecureStorage();
    let counter = 0;
    const provider = createDeviceIdProvider(storage, () => `id-${(counter += 1)}`);

    await expect(provider()).resolves.toBe("id-1");
    await expect(provider()).resolves.toBe("id-1");
    await expect(storage.get(DEVICE_ID_KEY)).resolves.toBe("id-1");
  });

  it("reutiliza el id guardado de una instalación previa", async () => {
    const storage = createMemorySecureStorage({ [DEVICE_ID_KEY]: "previo" });
    const provider = createDeviceIdProvider(storage, () => "nuevo");

    await expect(provider()).resolves.toBe("previo");
  });
});
