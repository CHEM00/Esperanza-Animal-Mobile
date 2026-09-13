import { ApiError } from "@/core/api/problem";
import { GENERIC_MESSAGE, NETWORK_MESSAGE, PROBLEM_MESSAGES, messageForError } from "./problem-messages";

describe("messageForError", () => {
  it("traduce por código y no por el texto del servidor", () => {
    const error = new ApiError({
      kind: "problem",
      message: "Texto del servidor",
      code: "rate_limited",
      status: 429,
    });

    expect(messageForError(error)).toBe(PROBLEM_MESSAGES.rate_limited);
  });

  it("usa el mensaje de red para fallos de conexión", () => {
    expect(messageForError(new ApiError({ kind: "network", message: "x" }))).toBe(NETWORK_MESSAGE);
  });

  it("cae en el genérico con códigos desconocidos u otros errores", () => {
    expect(
      messageForError(new ApiError({ kind: "problem", message: "x", code: "algo.nuevo", status: 400 })),
    ).toBe(GENERIC_MESSAGE);
    expect(messageForError(new Error("cualquiera"))).toBe(GENERIC_MESSAGE);
  });
});
