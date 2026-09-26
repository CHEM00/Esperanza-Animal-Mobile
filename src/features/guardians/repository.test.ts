import { createApiClient } from "@/core/api/client";
import { acceptGuardianInvite, getLinkPreview, listGuardians } from "./repository";

const BASE_URL = "https://api.example.test";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function clientWith(respond: (request: Request) => Response) {
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

describe("repositorio de guardianes", () => {
  it("la vista previa elige la ruta según el tipo de enlace", async () => {
    const { client, requests } = clientWith(() => jsonResponse(200, { petName: "Toby", state: "valida" }));
    await expect(getLinkPreview("invite", "c0d3", client)).resolves.toEqual({ petName: "Toby", state: "valida" });
    await getLinkPreview("transfer", "c0d3", client);
    expect(requests.map((request) => new URL(request.url).pathname)).toEqual([
      "/api/v1/guardian-invites/c0d3",
      "/api/v1/transfers/c0d3",
    ]);
    expect(requests.every((request) => request.method === "GET")).toBe(true);
  });

  it("un enlace inexistente llega como ApiError not_found", async () => {
    const { client } = clientWith(() =>
      jsonResponse(404, { type: "urn:alakito:problema:not_found", title: "No existe", status: 404, code: "not_found", requestId: "r" }),
    );
    await expect(getLinkPreview("invite", "nope", client)).rejects.toMatchObject({ code: "not_found", status: 404 });
  });

  it("aceptar es POST al recurso del código y la lista desenvuelve items", async () => {
    const { client, requests } = clientWith((request) =>
      request.method === "POST"
        ? jsonResponse(200, { petId: "p1", role: "GUARDIAN" })
        : jsonResponse(200, { items: [{ userId: "u1", name: "Ana", role: "DUENO", since: "2026-09-01T00:00:00.000Z" }] }),
    );
    await expect(acceptGuardianInvite("c0d3", client)).resolves.toEqual({ petId: "p1", role: "GUARDIAN" });
    await expect(listGuardians("p1", client)).resolves.toHaveLength(1);
    expect(new URL(requests[0]?.url ?? "").pathname).toBe("/api/v1/guardian-invites/c0d3/accept");
  });
});
