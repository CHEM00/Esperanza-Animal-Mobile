import {
  EMPTY_PET_FORM,
  buildPetFormSchema,
  fieldErrorsOf,
  isEmptyPatch,
  petFormFromDetail,
  toCreateFormData,
  toPatchBody,
  type PetFormValues,
} from "./pet-form";

const LIMITS = {
  nameMinLength: 2,
  nameMaxLength: 40,
  descriptionMinLength: 10,
  descriptionMaxLength: 400,
  speciesDetailMaxLength: 40,
  medicalNotesMaxLength: 300,
  microchipCodeMaxLength: 15,
};

const VALID: PetFormValues = {
  ...EMPTY_PET_FORM,
  name: "Toby",
  species: "PERRO",
  sex: "MACHO",
  description: "Perro blanco con mancha negra en el ojo",
};

describe("buildPetFormSchema", () => {
  const schema = buildPetFormSchema(LIMITS);

  it("acepta un perfil completo", () => {
    expect(schema.safeParse(VALID).success).toBe(true);
  });

  it("aplica los límites remotos y da un mensaje por campo", () => {
    const result = schema.safeParse({ ...VALID, name: "T", description: "corto", microchipCode: "AB 12" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrorsOf(result.error);
      expect(errors.name).toBe("El nombre necesita al menos 2 letras");
      expect(errors.description).toBe("Cuenta un poco más: al menos 10 caracteres");
      expect(errors.microchipCode).toBe("Solo letras y números, sin espacios");
    }
  });

  it("«Otro» exige decir qué animal es", () => {
    const result = schema.safeParse({ ...VALID, species: "OTRO", speciesDetail: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrorsOf(result.error).speciesDetail).toBe("Di qué animal es");
    }
    expect(schema.safeParse({ ...VALID, species: "OTRO", speciesDetail: "Conejo" }).success).toBe(true);
  });
});

describe("toCreateFormData", () => {
  it("manda los campos como texto, omite vacíos y adjunta las fotos", () => {
    const form = toCreateFormData(
      { ...VALID, birthDate: "2020-05-01", sterilized: true, medicalNotes: "" },
      [
        { uri: "file:///a.jpg", width: 1, height: 1, mimeType: "image/jpeg", fileName: "a.jpg", bytes: null },
        { uri: "file:///b.jpg", width: 1, height: 1, mimeType: "image/jpeg", fileName: "b.jpg", bytes: null },
      ],
    );
    expect(form.get("name")).toBe("Toby");
    expect(form.get("birthDate")).toBe("2020-05-01");
    expect(form.get("sterilized")).toBe("true");
    expect(form.get("showPhoneToFinder")).toBe("false");
    expect(form.has("medicalNotes")).toBe(false);
    expect(form.has("speciesDetail")).toBe(false);
    expect(form.getAll("photos")).toHaveLength(2);
  });
});

describe("toPatchBody", () => {
  it("solo incluye lo que cambió", () => {
    const patch = toPatchBody(VALID, { ...VALID, description: "Ahora con collar rojo", showPhoneToFinder: true });
    expect(patch).toEqual({ description: "Ahora con collar rojo", showPhoneToFinder: true });
    expect(isEmptyPatch(toPatchBody(VALID, VALID))).toBe(true);
  });

  it("no intenta vaciar microchip ni fecha, que el contrato no admite", () => {
    const initial = { ...VALID, microchipCode: "985112345678903", birthDate: "2020-05-01" };
    const patch = toPatchBody(initial, { ...initial, microchipCode: "", birthDate: null });
    expect(patch).toEqual({});
  });

  it("al cambiar de «Otro» a perro limpia el detalle de especie", () => {
    const initial = { ...VALID, species: "OTRO" as const, speciesDetail: "Conejo" };
    expect(toPatchBody(initial, { ...initial, species: "PERRO", speciesDetail: "Conejo" })).toEqual({
      species: "PERRO",
      speciesDetail: "",
    });
  });
});

describe("petFormFromDetail", () => {
  it("convierte nulos en cadenas vacías para los campos de texto", () => {
    const values = petFormFromDetail({
      id: "p1",
      name: "Toby",
      species: "PERRO",
      speciesDetail: null,
      status: "EN_CASA",
      coverPhotoUrl: null,
      role: "DUENO",
      tag: null,
      activeCaseId: null,
      sex: "MACHO",
      description: "Perro blanco con mancha negra en el ojo",
      birthDate: null,
      sterilized: null,
      microchipCode: null,
      medicalNotes: null,
      showPhoneToFinder: true,
      showMedicalNotes: false,
      publicCode: "ABCDEFGHJK",
      lostSince: null,
      photos: [],
      guardians: [],
      createdAt: "2026-09-25T00:00:00.000Z",
    });
    expect(values).toMatchObject({ speciesDetail: "", microchipCode: "", medicalNotes: "", showPhoneToFinder: true });
  });
});
