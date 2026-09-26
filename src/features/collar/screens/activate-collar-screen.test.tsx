import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { createFakeNfcReader } from "@/core/ports/nfc-reader";
import { ActivateCollarScreen } from "./activate-collar-screen";

/**
 * Prueba de componente de M4 (docs/06 §13): la pantalla une el puerto NFC (doble), el
 * repositorio (simulado) y la máquina de estados. Se recorre el camino feliz, el rechazo
 * de un collar ya activo y la llegada por enlace con mascota preseleccionada. Las
 * variables `mock*` son las únicas que Jest deja usar dentro de las fábricas de
 * `jest.mock`; `render` y las interacciones son asíncronas en esta versión.
 */

const P = "a".repeat(32);
const M = "b".repeat(16);
const COLLAR_URL = `https://alakito.mx/t?p=${P}&m=${M}`;
const EXPIRES_AT = new Date(Date.now() + 10 * 60 * 1000).toISOString();

const mockReader = createFakeNfcReader([]);
const mockResolveNfcScan = jest.fn();
const mockActivateTag = jest.fn();
const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("@/core/device", () => ({
  get nfcReader() {
    return mockReader;
  },
}));
jest.mock("@/core/config", () => ({
  appConfig: { linkDomain: "alakito.mx", scheme: "alakito", apiBaseUrl: "https://api.example.test" },
}));
jest.mock("expo-router", () => ({ useRouter: () => ({ replace: mockReplace, push: mockPush }) }));
jest.mock("@/core/auth/use-session", () => ({ useIsAuthenticated: () => true }));
jest.mock("../repository", () => ({
  resolveNfcScan: (...args: unknown[]) => mockResolveNfcScan(...args),
  activateTag: (...args: unknown[]) => mockActivateTag(...args),
}));
jest.mock("@/features/pets/hooks/use-pets", () => ({
  usePets: () => ({
    isPending: false,
    data: [
      { id: "p1", name: "Toby", species: "PERRO", speciesDetail: null, status: "EN_CASA", role: "DUENO", tag: null, coverPhotoUrl: null, activeCaseId: null },
      { id: "p2", name: "Mishi", species: "GATO", speciesDetail: null, status: "EN_CASA", role: "GUARDIAN", tag: null, coverPhotoUrl: null, activeCaseId: null },
    ],
  }),
}));

function Providers({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function queueRead(url: string) {
  mockReader.readUrl = async () => ({ status: "url", url });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ActivateCollarScreen (M4)", () => {
  it("lee el collar, ofrece solo las mascotas propias sin collar y vincula", async () => {
    queueRead(COLLAR_URL);
    mockResolveNfcScan.mockResolvedValue({ view: "ACTIVATION", tagStatus: "LISTO", scanToken: "tok", expiresAt: EXPIRES_AT });
    mockActivateTag.mockResolvedValue({ id: "tag1", status: "ACTIVO", petId: "p1", activatedAt: EXPIRES_AT, mutedUntil: null });
    const user = userEvent.setup();

    await render(<ActivateCollarScreen preselectedPetId={null} initialScan={null} />, { wrapper: Providers });

    await user.press(screen.getByText("Leer collar"));
    await waitFor(() => expect(mockResolveNfcScan).toHaveBeenCalledWith({ p: P, m: M }));

    // Mishi es de la que somos guardianes: no se ofrece para vincular.
    expect(await screen.findByText("Toby")).toBeTruthy();
    expect(screen.queryByText("Mishi")).toBeNull();

    await user.press(screen.getByText("Toby"));
    await user.press(screen.getByText("Vincular a Toby"));

    await waitFor(() => expect(mockActivateTag).toHaveBeenCalledWith({ scanToken: "tok", petId: "p1" }));
    expect(await screen.findByTestId("activation-done")).toBeTruthy();
    await user.press(screen.getByText("Ver perfil"));
    expect(mockReplace).toHaveBeenCalledWith("/mascotas/p1");
  });

  it("un collar ya activo se rechaza con explicación y permite volver a leer", async () => {
    queueRead(COLLAR_URL);
    mockResolveNfcScan.mockResolvedValue({ view: "FINDER", tagStatus: "ACTIVO", scanToken: "tok", expiresAt: EXPIRES_AT });
    const user = userEvent.setup();

    await render(<ActivateCollarScreen preselectedPetId={null} initialScan={null} />, { wrapper: Providers });
    await user.press(screen.getByText("Leer collar"));

    expect(await screen.findByText(/ya está vinculado a una mascota/)).toBeTruthy();
    expect(screen.getByText("Leer collar")).toBeTruthy();
    expect(mockActivateTag).not.toHaveBeenCalled();
  });

  it("con la lectura llegada por enlace y mascota preseleccionada vincula sin pasos intermedios", async () => {
    mockActivateTag.mockResolvedValue({ id: "tag1", status: "ACTIVO", petId: "p1", activatedAt: EXPIRES_AT, mutedUntil: null });

    await render(
      <ActivateCollarScreen preselectedPetId="p1" initialScan={{ token: "tok", expiresAt: EXPIRES_AT }} />,
      { wrapper: Providers },
    );

    await waitFor(() => expect(mockActivateTag).toHaveBeenCalledWith({ scanToken: "tok", petId: "p1" }));
    expect(await screen.findByTestId("activation-done")).toBeTruthy();
  });
});
