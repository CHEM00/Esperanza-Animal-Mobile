import { appendFields, appendFile, multipartOptions, toNativeFormFile } from "./multipart";

const IMAGE = {
  uri: "file:///tmp/a.jpg",
  width: 10,
  height: 10,
  mimeType: "image/jpeg",
  fileName: "a.jpg",
  bytes: null,
};

describe("multipart", () => {
  it("convierte la imagen a la forma nativa de archivo", () => {
    expect(toNativeFormFile(IMAGE)).toEqual({ uri: "file:///tmp/a.jpg", name: "a.jpg", type: "image/jpeg" });
  });

  it("agrega campos escalares como texto y omite vacíos", () => {
    const form = new FormData();
    appendFields(form, { name: "Toby", sterilized: true, birthDate: null, medicalNotes: "", age: 3 });
    expect(form.get("name")).toBe("Toby");
    expect(form.get("sterilized")).toBe("true");
    expect(form.get("age")).toBe("3");
    expect(form.has("birthDate")).toBe(false);
    expect(form.has("medicalNotes")).toBe(false);
  });

  it("el serializador entrega el mismo FormData sin transformarlo", () => {
    const form = new FormData();
    appendFile(form, "photos", IMAGE);
    const options = multipartOptions<{ photos?: string[] }>(form);
    expect(options.bodySerializer(options.body)).toBe(form);
  });
});
