import { API_HEADERS, call, createApiClient } from "./client";
import { ApiError } from "./problem";

const BASE_URL = "https://api.example.test";

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function clientWith(fetchImpl: typeof fetch, token: string | null = "tok") {
  return createApiClient({
    baseUrl: BASE_URL,
    getSessionToken: () => token,
    getDeviceId: () => "device-1",
    newRequestId: () => "req-1",
    fetch: fetchImpl,
  });
}

describe("createApiClient", () => {
  it("agrega correlación, dispositivo y token portador a cada petición", async () => {
    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const request = input as Request;
      expect(request.headers.get(API_HEADERS.requestId)).toBe("req-1");
      expect(request.headers.get(API_HEADERS.deviceId)).toBe("device-1");
      expect(request.headers.get(API_HEADERS.authorization)).toBe("Bearer tok");
      expect(request.url).toBe(`${BASE_URL}/api/v1/me`);
      return jsonResponse(200, { user: { id: "u1" } });
    });

    const client = clientWith(fetchImpl as unknown as typeof fetch);
    await client.GET("/api/v1/me");

    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("omite el token cuando no hay sesión", async () => {
    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      expect((input as Request).headers.get(API_HEADERS.authorization)).toBeNull();
      return jsonResponse(200, {});
    });

    await clientWith(fetchImpl as unknown as typeof fetch, null).GET("/api/v1/config");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});

describe("call", () => {
  it("devuelve los datos cuando la respuesta es correcta", async () => {
    const client = clientWith(
      (async () => jsonResponse(200, { view: "NEUTRAL" })) as unknown as typeof fetch,
    );

    await expect(
      call(() => client.POST("/api/v1/scans/nfc", { body: { p: "a".repeat(32), m: "b".repeat(16) } })),
    ).resolves.toEqual({ view: "NEUTRAL" });
  });

  it("convierte un Problem Details en ApiError con código y requestId", async () => {
    const client = clientWith(
      (async () =>
        jsonResponse(
          401,
          {
            type: "urn:x:auth.required",
            title: "Se requiere iniciar sesión",
            status: 401,
            code: "auth.required",
            requestId: "req-9",
          },
          { [API_HEADERS.requestId]: "req-9" },
        )) as unknown as typeof fetch,
    );

    await expect(call(() => client.GET("/api/v1/me"))).rejects.toMatchObject({
      name: "ApiError",
      kind: "problem",
      status: 401,
      code: "auth.required",
      requestId: "req-9",
    });
  });

  it("convierte un fallo de red en ApiError de red", async () => {
    const client = clientWith((async () => {
      throw new TypeError("Network request failed");
    }) as unknown as typeof fetch);

    const error = await call(() => client.GET("/api/v1/config")).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).kind).toBe("network");
  });
});
