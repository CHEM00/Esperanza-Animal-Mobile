import { z } from "zod";
import { appendFields, appendFile } from "@/core/api/multipart";
import type { UploadableImage } from "@/core/ports/image-compressor";
import type { RemoteConfig } from "@/features/config/repository";
import { PET_PHOTOS_FIELD } from "../constants";
import type { CreatePetBody, PetDetail, PetPatch, PetSex, PetSpecies } from "../repository";
import { PETS_STRINGS } from "../strings";

/**
 * Formulario de mascota (M3, RF-C1 y RF-C7). El esquema se arma con los
 * límites de la configuración remota: la app no copia números del backend. El
 * mismo modelo sirve para crear (multipart con fotos) y editar (PATCH con solo
 * lo que cambió). Módulo puro.
 */

export const PET_SPECIES = ["PERRO", "GATO", "OTRO"] as const satisfies readonly PetSpecies[];
export const PET_SEXES = ["MACHO", "HEMBRA", "DESCONOCIDO"] as const satisfies readonly PetSex[];

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MICROCHIP_PATTERN = /^[0-9A-Za-z]*$/;

export type PetFormLimits = Pick<
  RemoteConfig["limits"],
  | "nameMinLength"
  | "nameMaxLength"
  | "descriptionMinLength"
  | "descriptionMaxLength"
  | "speciesDetailMaxLength"
  | "medicalNotesMaxLength"
  | "microchipCodeMaxLength"
>;

export interface PetFormValues {
  name: string;
  species: PetSpecies;
  speciesDetail: string;
  sex: PetSex;
  description: string;
  /** `YYYY-MM-DD` o null. */
  birthDate: string | null;
  sterilized: boolean | null;
  microchipCode: string;
  medicalNotes: string;
  showPhoneToFinder: boolean;
  showMedicalNotes: boolean;
}

export const EMPTY_PET_FORM: PetFormValues = {
  name: "",
  species: "PERRO",
  speciesDetail: "",
  sex: "DESCONOCIDO",
  description: "",
  birthDate: null,
  sterilized: null,
  microchipCode: "",
  medicalNotes: "",
  showPhoneToFinder: false,
  showMedicalNotes: false,
};

const errors = PETS_STRINGS.form.errors;

export function buildPetFormSchema(limits: PetFormLimits) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(limits.nameMinLength, errors.nameMin(limits.nameMinLength))
        .max(limits.nameMaxLength, errors.nameMax(limits.nameMaxLength)),
      species: z.enum(PET_SPECIES),
      speciesDetail: z
        .string()
        .trim()
        .max(limits.speciesDetailMaxLength, errors.speciesDetailMax(limits.speciesDetailMaxLength)),
      sex: z.enum(PET_SEXES),
      description: z
        .string()
        .trim()
        .min(limits.descriptionMinLength, errors.descriptionMin(limits.descriptionMinLength))
        .max(limits.descriptionMaxLength, errors.descriptionMax(limits.descriptionMaxLength)),
      birthDate: z.string().regex(ISO_DATE_PATTERN, errors.birthDate).nullable(),
      sterilized: z.boolean().nullable(),
      microchipCode: z
        .string()
        .trim()
        .regex(MICROCHIP_PATTERN, errors.microchipFormat)
        .max(limits.microchipCodeMaxLength, errors.microchipMax(limits.microchipCodeMaxLength)),
      medicalNotes: z
        .string()
        .trim()
        .max(limits.medicalNotesMaxLength, errors.medicalNotesMax(limits.medicalNotesMaxLength)),
      showPhoneToFinder: z.boolean(),
      showMedicalNotes: z.boolean(),
    })
    .check((ctx) => {
      if (ctx.value.species === "OTRO" && ctx.value.speciesDetail.length === 0) {
        ctx.issues.push({
          code: "custom",
          path: ["speciesDetail"],
          message: errors.speciesDetailRequired,
          input: ctx.value.speciesDetail,
        });
      }
    });
}

export type PetFormErrors = Partial<Record<keyof PetFormValues, string>>;

/** Primer mensaje por campo, para pintarlo bajo el control. */
export function fieldErrorsOf(error: z.ZodError): PetFormErrors {
  const result: PetFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in result)) {
      result[key as keyof PetFormValues] = issue.message;
    }
  }
  return result;
}

export function petFormFromDetail(pet: PetDetail): PetFormValues {
  return {
    name: pet.name,
    species: pet.species,
    speciesDetail: pet.speciesDetail ?? "",
    sex: pet.sex,
    description: pet.description,
    birthDate: pet.birthDate,
    sterilized: pet.sterilized,
    microchipCode: pet.microchipCode ?? "",
    medicalNotes: pet.medicalNotes ?? "",
    showPhoneToFinder: pet.showPhoneToFinder,
    showMedicalNotes: pet.showMedicalNotes,
  };
}

/** Cuerpo multipart del alta: campos como texto y fotos como archivos nativos. */
export function toCreateFormData(values: PetFormValues, photos: readonly UploadableImage[]): FormData {
  const form = new FormData();
  const body: Record<keyof CreatePetBody, string | boolean | undefined> = {
    name: values.name,
    species: values.species,
    speciesDetail: values.species === "OTRO" ? values.speciesDetail : undefined,
    sex: values.sex,
    description: values.description,
    birthDate: values.birthDate ?? undefined,
    sterilized: values.sterilized ?? undefined,
    microchipCode: values.microchipCode || undefined,
    medicalNotes: values.medicalNotes || undefined,
    showPhoneToFinder: values.showPhoneToFinder,
    showMedicalNotes: values.showMedicalNotes,
    photos: undefined,
  };
  appendFields(form, body);
  for (const photo of photos) {
    appendFile(form, PET_PHOTOS_FIELD, photo);
  }
  return form;
}

/**
 * Solo lo que cambió (PATCH). El contrato no admite vaciar microchip ni fecha
 * (son campos con patrón y el microchip queda fijo, S19): si se borran en el
 * formulario no viajan, y la pantalla lo explica.
 */
export function toPatchBody(initial: PetFormValues, values: PetFormValues): PetPatch {
  const patch: PetPatch = {};
  if (values.name !== initial.name) patch.name = values.name;
  if (values.species !== initial.species) patch.species = values.species;
  const detail = values.species === "OTRO" ? values.speciesDetail : "";
  const initialDetail = initial.species === "OTRO" ? initial.speciesDetail : "";
  if (detail !== initialDetail) patch.speciesDetail = detail;
  if (values.sex !== initial.sex) patch.sex = values.sex;
  if (values.description !== initial.description) patch.description = values.description;
  if (values.birthDate && values.birthDate !== initial.birthDate) patch.birthDate = values.birthDate;
  if (values.sterilized !== initial.sterilized && values.sterilized !== null) {
    patch.sterilized = values.sterilized;
  }
  if (values.microchipCode && values.microchipCode !== initial.microchipCode) {
    patch.microchipCode = values.microchipCode;
  }
  if (values.medicalNotes !== initial.medicalNotes) patch.medicalNotes = values.medicalNotes;
  if (values.showPhoneToFinder !== initial.showPhoneToFinder) patch.showPhoneToFinder = values.showPhoneToFinder;
  if (values.showMedicalNotes !== initial.showMedicalNotes) patch.showMedicalNotes = values.showMedicalNotes;
  return patch;
}

export function isEmptyPatch(patch: PetPatch): boolean {
  return Object.keys(patch).length === 0;
}
