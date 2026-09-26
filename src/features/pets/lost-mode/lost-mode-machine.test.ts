import {
  buildLostModeSchema,
  initialLostModeState,
  lostModeErrorsOf,
  lostModeReducer,
  toLostModeInput,
  type LostModeEvent,
  type LostModeState,
} from "./lost-mode-machine";

function run(events: LostModeEvent[], state = initialLostModeState()): LostModeState {
  return events.reduce(lostModeReducer, state);
}

const RESULT = { petId: "p1", petStatus: "PERDIDA" as const, publicationId: "pub1" };

describe("lostModeReducer", () => {
  it("recorre aviso → formulario → responsiva → envío → listo y registra las aceptaciones", () => {
    const state = run([
      { type: "ACCEPT_NOTICE" },
      { type: "EDIT", patch: { cp: "96400", coloniaId: "c1" } },
      { type: "CONTINUE" },
      { type: "SUBMIT" },
      { type: "SUBMIT_OK", result: RESULT },
    ]);
    expect(state.step).toBe("done");
    expect(state.safetyNoticeAccepted).toBe(true);
    expect(state.liabilityAccepted).toBe(true);
    expect(state.form.coloniaId).toBe("c1");
    expect(state.result).toEqual(RESULT);
  });

  it("un fallo al enviar vuelve a la responsiva con el mensaje", () => {
    const state = run([
      { type: "ACCEPT_NOTICE" },
      { type: "CONTINUE" },
      { type: "SUBMIT" },
      { type: "SUBMIT_FAIL", message: "Sin conexión" },
    ]);
    expect(state.step).toBe("responsiva");
    expect(state.error).toBe("Sin conexión");
  });

  it("ignora eventos fuera de su paso", () => {
    const initial = initialLostModeState();
    expect(lostModeReducer(initial, { type: "SUBMIT" })).toBe(initial);
    expect(lostModeReducer(initial, { type: "EDIT", patch: { phone: "1" } })).toBe(initial);
    const done = run([{ type: "ACCEPT_NOTICE" }, { type: "CONTINUE" }, { type: "SUBMIT" }, { type: "SUBMIT_OK", result: RESULT }]);
    expect(lostModeReducer(done, { type: "SUBMIT_FAIL", message: "x" })).toBe(done);
  });

  it("volver desde la responsiva conserva lo escrito", () => {
    const state = run([
      { type: "ACCEPT_NOTICE" },
      { type: "EDIT", patch: { locationReference: "Parque" } },
      { type: "CONTINUE" },
      { type: "BACK" },
    ]);
    expect(state.step).toBe("form");
    expect(state.form.locationReference).toBe("Parque");
  });

  it("los valores por defecto (teléfono del perfil) entran al formulario", () => {
    expect(initialLostModeState({ phone: "9211234567" }).form.phone).toBe("9211234567");
  });
});

describe("buildLostModeSchema", () => {
  const schema = buildLostModeSchema({ referenceMinLength: 5, referenceMaxLength: 120, phoneLength: 10 });

  it("valida colonia, referencia, teléfono normalizado y punto", () => {
    const parsed = schema.parse({
      coloniaId: "c1",
      locationReference: "Parque central",
      phone: "921 123 4567",
      point: { lat: 18.15, lng: -94.42 },
      hasReward: false,
    });
    expect(parsed.phone).toBe("9211234567");
    expect(toLostModeInput(parsed)).toEqual({
      coloniaId: "c1",
      locationReference: "Parque central",
      phone: "9211234567",
      hasReward: false,
      lat: 18.15,
      lng: -94.42,
      safetyNoticeAccepted: true,
      liabilityAccepted: true,
    });
  });

  it("da un mensaje por campo cuando falta algo", () => {
    const result = schema.safeParse({ coloniaId: null, locationReference: "ab", phone: "12", point: null, hasReward: true });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = lostModeErrorsOf(result.error);
      expect(errors.coloniaId).toBe("Elige la colonia");
      expect(errors.locationReference).toBe("Al menos 5 caracteres");
      expect(errors.phone).toBe("Escribe 10 dígitos");
      expect(errors.point).toBe("Marca el punto en el mapa");
    }
  });
});
