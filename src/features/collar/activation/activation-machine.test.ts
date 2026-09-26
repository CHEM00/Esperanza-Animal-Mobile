import {
  activationReducer,
  initialActivationState,
  isPetEligibleForCollar,
  isScanExpired,
  type ActivationEvent,
  type ActivationState,
} from "./activation-machine";

const EXPIRES = "2026-09-25T12:15:00.000Z";
const RESOLUTION_OK = { view: "ACTIVATION" as const, tagStatus: "LISTO" as const, scanToken: "tok", expiresAt: EXPIRES };
const TAG = { id: "tag1", status: "ACTIVO" as const, petId: "p1", activatedAt: EXPIRES, mutedUntil: null };

function run(events: ActivationEvent[], state: ActivationState = initialActivationState()): ActivationState {
  return events.reduce(activationReducer, state);
}

describe("activationReducer", () => {
  it("flujo completo: leer → elegir mascota → vincular → listo", () => {
    const state = run([
      { type: "START_READ" },
      { type: "RESOLVED", resolution: RESOLUTION_OK },
      { type: "PICK_PET", petId: "p1" },
      { type: "ACTIVATE" },
      { type: "ACTIVATED", tag: TAG },
    ]);
    expect(state).toEqual({ step: "done", petId: "p1", tag: TAG });
  });

  it("con mascota preseleccionada no hace falta elegir", () => {
    const state = run(
      [{ type: "START_READ" }, { type: "RESOLVED", resolution: RESOLUTION_OK }, { type: "ACTIVATE" }],
      initialActivationState("p9"),
    );
    expect(state.step).toBe("activating");
    expect(state.petId).toBe("p9");
  });

  it("sin mascota elegida no se puede vincular", () => {
    const state = run([{ type: "START_READ" }, { type: "RESOLVED", resolution: RESOLUTION_OK }, { type: "ACTIVATE" }]);
    expect(state.step).toBe("resolved");
  });

  it("una lectura que no es de activación se rechaza con el estado del collar", () => {
    const state = run([
      { type: "START_READ" },
      { type: "RESOLVED", resolution: { view: "FINDER", tagStatus: "ACTIVO", scanToken: "t", expiresAt: EXPIRES } },
    ]);
    expect(state).toEqual({ step: "rejected", petId: null, view: "FINDER", tagStatus: "ACTIVO" });
    // Desde el rechazo se puede volver a leer.
    expect(activationReducer(state, { type: "START_READ" }).step).toBe("reading");
  });

  it("el fallo al vincular conserva la lectura para reintentar con otra mascota", () => {
    const state = run([
      { type: "START_READ" },
      { type: "RESOLVED", resolution: RESOLUTION_OK },
      { type: "PICK_PET", petId: "p1" },
      { type: "ACTIVATE" },
      { type: "ACTIVATION_FAILED", message: "La mascota está inactiva" },
    ]);
    expect(state).toMatchObject({ step: "resolved", scanToken: "tok", error: "La mascota está inactiva" });
  });

  it("caducidad, cancelación, sin NFC y chip ajeno vuelven a estados legibles", () => {
    const resolved = run([{ type: "START_READ" }, { type: "RESOLVED", resolution: RESOLUTION_OK }]);
    expect(activationReducer(resolved, { type: "EXPIRED" })).toEqual({ step: "idle", petId: null, error: "expired" });
    expect(run([{ type: "START_READ" }, { type: "READ_CANCELLED" }]).step).toBe("idle");
    expect(run([{ type: "START_READ" }, { type: "READ_UNAVAILABLE", reason: "disabled" }])).toEqual({
      step: "unsupported",
      petId: null,
      reason: "disabled",
    });
    expect(run([{ type: "START_READ" }, { type: "READ_NOT_COLLAR" }]).step).toBe("not_collar");
  });

  it("ignora eventos fuera de su paso", () => {
    const idle = initialActivationState();
    expect(activationReducer(idle, { type: "ACTIVATE" })).toBe(idle);
    expect(activationReducer(idle, { type: "RESOLVED", resolution: RESOLUTION_OK })).toBe(idle);
  });
});

describe("isScanExpired", () => {
  it("compara contra el ahora", () => {
    expect(isScanExpired(EXPIRES, new Date("2026-09-25T12:14:59.000Z"))).toBe(false);
    expect(isScanExpired(EXPIRES, new Date("2026-09-25T12:15:00.000Z"))).toBe(true);
  });
});

describe("isPetEligibleForCollar", () => {
  it("solo mascotas propias, activas y sin collar", () => {
    expect(isPetEligibleForCollar({ role: "DUENO", status: "EN_CASA", tag: null })).toBe(true);
    expect(isPetEligibleForCollar({ role: "GUARDIAN", status: "EN_CASA", tag: null })).toBe(false);
    expect(isPetEligibleForCollar({ role: "DUENO", status: "INACTIVA", tag: null })).toBe(false);
    expect(isPetEligibleForCollar({ role: "DUENO", status: "PERDIDA", tag: { status: "ACTIVO" } })).toBe(false);
  });
});
