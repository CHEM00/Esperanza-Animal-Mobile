import { createApiClient } from "@/core/api/client";
import { appendFields, appendFile } from "@/core/api/multipart";
import { PET_PHOTOS_FIELD } from "./constants";
import { activateLostMode, createPet, listPets, updatePet } from "./repository";

const BASE_URL = "https://api.example.test";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function clientRecording(respond: (request: Request) => Response) {
  const requests: Request[] = [];
  const client = createApiClient({
    baseUrl: BASE_URL,
    getSessionToken: () => "tok",
    getDeviceId: () => "dev",
    newRequestId: () => "req",
    fetch: (async (input: RequestInfo | URL) => {
      const request = input as Request;
      requests.push(request);
      return respond(request);
    }) as unknown as typeof fetch,
  });
  return { client, requests };
}

describe("repositorio de mascotas", () => {
  it("lista mis mascotas desenvolviendo la página", async () => {
    const { client, requests } = clientRecording(() =>
      jsonResponse(200, { items: [{ id: "p1", name: "Toby" }] }),
    );
    await expect(listPets(client)).resolves.toEqual([{ id: "p1", name: "Toby" }]);
    expect(requests[0]?.method).toBe("GET");
    expect(requests[0]?.url).toBe(`${BASE_URL}/api/v1/pets`);
  });

  it("crea con multipart sin fijar el content-type a mano", async () => {
    const { client, requests } = clientRecording(() => jsonResponse(201, { id: "p1" }));
    const form = new FormData();
    appendFields(form, { name: "Toby", species: "PERRO", showPhoneToFinder: false });
    appendFile(form, PET_PHOTOS_FIELD, {
      uri: "file:///a.jpg",
      width: 1,
      height: 1,
      mimeType: "image/jpeg",
      fileName: "a.jpg",
      bytes: null,
    });

    await createPet(form, client);

    const request = requests[0] as Request;
    expect(request.method).toBe("POST");
    // El runtime pone la boundary; si alguien fija "application/json" el servidor rechaza con 415.
    expect(request.headers.get("content-type") ?? "").not.toContain("application/json");
    // El tipo global de FormData es el de React Native (sin get/has); en Jest corre el de Node.
    const sent = (await request.formData()) as unknown as {
      get(key: string): unknown;
      has(key: string): boolean;
    };
    expect(sent.get("name")).toBe("Toby");
    expect(sent.get("showPhoneToFinder")).toBe("false");
    expect(sent.has(PET_PHOTOS_FIELD)).toBe(true);
  });

  it("edita con PATCH y solo los campos recibidos", async () => {
    const { client, requests } = clientRecording(() => jsonResponse(200, { id: "p1" }));
    await updatePet("p1", { description: "Manchas negras en el lomo" }, client);
    const request = requests[0] as Request;
    expect(request.method).toBe("PATCH");
    expect(request.url).toBe(`${BASE_URL}/api/v1/pets/p1`);
    expect(await request.json()).toEqual({ description: "Manchas negras en el lomo" });
  });

  it("activa el modo perdido con el cuerpo del contrato y propaga el Problem Details", async () => {
    const { client } = clientRecording(() =>
      jsonResponse(409, {
        type: "urn:alakito:problema:pet.invalid_state",
        title: "Estado inválido",
        status: 409,
        code: "pet.invalid_state",
        requestId: "r1",
      }),
    );
    await expect(
      activateLostMode(
        "p1",
        {
          coloniaId: "c1",
          locationReference: "Parque central",
          phone: "9211234567",
          hasReward: false,
          lat: 18.15,
          lng: -94.42,
          safetyNoticeAccepted: true,
          liabilityAccepted: true,
        },
        client,
      ),
    ).rejects.toMatchObject({ code: "pet.invalid_state", status: 409 });
  });
});
