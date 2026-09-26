import type { UploadableImage } from "@/core/ports/image-compressor";

/**
 * Cuerpos multipart para openapi-fetch en React Native. El `fetch` nativo
 * acepta en `FormData` un objeto `{ uri, name, type }` como archivo; la
 * boundary y el content-type los pone el runtime, por eso el serializador es
 * la identidad y nunca se fija la cabecera a mano. Módulo puro.
 */

/** Forma que React Native espera para un archivo dentro de FormData. */
export interface NativeFormFile {
  uri: string;
  name: string;
  type: string;
}

export function toNativeFormFile(image: UploadableImage): NativeFormFile {
  return { uri: image.uri, name: image.fileName, type: image.mimeType };
}

export function appendFile(form: FormData, field: string, image: UploadableImage): void {
  // El tipado DOM de FormData no conoce la forma nativa; el runtime sí.
  form.append(field, toNativeFormFile(image) as unknown as Blob);
}

/** Campos escalares: los booleanos y números viajan como texto, como en la web. */
export function appendFields(
  form: FormData,
  fields: Record<string, string | number | boolean | null | undefined>,
): void {
  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }
    form.append(key, String(value));
  }
}

/**
 * Opciones de openapi-fetch para mandar un FormData ya armado. El cliente
 * tipa `body` según el esquema; aquí se le entrega el FormData y se le pide
 * que no lo serialice.
 */
export function multipartOptions<TBody>(form: FormData): {
  body: TBody;
  bodySerializer: (body: TBody) => FormData;
} {
  return {
    body: form as unknown as TBody,
    bodySerializer: (body) => body as unknown as FormData,
  };
}
