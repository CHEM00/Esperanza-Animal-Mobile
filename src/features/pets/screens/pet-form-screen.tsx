import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { appendFile } from "@/core/api/multipart";
import { messageForError } from "@/core/errors/problem-messages";
import { APP_ROUTES } from "@/core/navigation/links";
import type { UploadableImage } from "@/core/ports/image-compressor";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { RequireSession } from "@/features/shell/components/require-session";
import { AppText } from "@/shared/ui/app-text";
import { ChipGroup } from "@/shared/ui/chip-group";
import { CtaButton } from "@/shared/ui/cta-button";
import { DateField } from "@/shared/ui/date-field";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { LoadingView } from "@/shared/ui/loading-view";
import { ScrollScreen } from "@/shared/ui/scroll-screen";
import { SectionTitle } from "@/shared/ui/section-title";
import { Sheet } from "@/shared/ui/sheet";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { SwitchRow } from "@/shared/ui/switch-row";
import { TextField } from "@/shared/ui/text-field";
import { PhotoGrid, type PhotoTile } from "../components/photo-grid";
import { useCreatePet, usePetPhotos, useUpdatePet } from "../hooks/use-pet-mutations";
import { usePet } from "../hooks/use-pets";
import { usePhotoPicker } from "../hooks/use-photo-picker";
import { PET_MAX_AGE_YEARS, PET_PHOTOS_FIELD } from "../constants";
import {
  EMPTY_PET_FORM,
  PET_SEXES,
  PET_SPECIES,
  buildPetFormSchema,
  fieldErrorsOf,
  isEmptyPatch,
  petFormFromDetail,
  toCreateFormData,
  toPatchBody,
  type PetFormErrors,
  type PetFormValues,
} from "../model/pet-form";
import type { PetDetail } from "../repository";
import { PETS_STRINGS } from "../strings";

/**
 * M3 · Crear y editar mascota (RF-C1, RF-C2, RF-C7). Un solo formulario: al
 * crear manda multipart con fotos; al editar manda PATCH con lo que cambió y
 * gestiona las fotos con sus propias llamadas.
 */
export function PetFormScreen({ petId }: { petId: string | null }) {
  return (
    <RequireSession>
      {petId ? <EditPetForm petId={petId} /> : <PetForm mode="create" initial={null} />}
    </RequireSession>
  );
}

function EditPetForm({ petId }: { petId: string }) {
  const pet = usePet(petId);
  if (pet.isPending) {
    return <LoadingView />;
  }
  if (!pet.data) {
    return <ErrorBanner message={pet.isError ? messageForError(pet.error) : PETS_STRINGS.profile.notFound} />;
  }
  return <PetForm mode="edit" initial={pet.data} />;
}

const S = PETS_STRINGS.form;
const STERILIZED_OPTIONS = [
  { value: "yes", label: S.sterilized.options.yes },
  { value: "no", label: S.sterilized.options.no },
  { value: "unknown", label: S.sterilized.options.unknown },
] as const;

function sterilizedToOption(value: boolean | null): "yes" | "no" | "unknown" {
  return value === null ? "unknown" : value ? "yes" : "no";
}

interface PetFormProps {
  mode: "create" | "edit";
  initial: PetDetail | null;
}

function PetForm({ mode, initial }: PetFormProps) {
  const router = useRouter();
  const remoteConfig = useRemoteConfig();
  const initialValues = useMemo(() => (initial ? petFormFromDetail(initial) : EMPTY_PET_FORM), [initial]);
  const [values, setValues] = useState<PetFormValues>(initialValues);
  const [errors, setErrors] = useState<PetFormErrors>({});
  const [newPhotos, setNewPhotos] = useState<UploadableImage[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const existingPhotos = initial?.photos ?? [];
  const photoCount = existingPhotos.length + newPhotos.length;
  const picker = usePhotoPicker(photoCount);
  const createPet = useCreatePet();
  const updatePet = useUpdatePet(initial?.id ?? "");
  const photos = usePetPhotos(initial?.id ?? "");
  const busy = createPet.isPending || updatePet.isPending || photos.busy || picker.preparing;
  const limits = remoteConfig.data?.limits ?? null;
  const schema = useMemo(() => (limits ? buildPetFormSchema(limits) : null), [limits]);
  const microchipLocked = mode === "edit" && Boolean(initial?.microchipCode);

  const birthDateRange = useMemo(() => {
    const today = new Date();
    return {
      maximum: today,
      minimum: new Date(today.getFullYear() - PET_MAX_AGE_YEARS, today.getMonth(), today.getDate()),
    };
  }, []);

  function set<K extends keyof PetFormValues>(key: K, value: PetFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  const tiles: PhotoTile[] = [
    ...existingPhotos.map((photo) => ({ key: photo.id, uri: photo.url })),
    ...newPhotos.map((photo) => ({ key: photo.uri, uri: photo.uri })),
  ];

  async function addPhotos(source: "library" | "camera") {
    setPickerOpen(false);
    const picked = source === "library" ? await picker.pickFromLibrary() : await picker.takePhoto();
    if (picked.length === 0) {
      return;
    }
    if (mode === "edit" && initial) {
      const form = new FormData();
      for (const photo of picked) {
        appendFile(form, PET_PHOTOS_FIELD, photo);
      }
      photos.add.mutate(form, { onError: (error) => setMessage(messageForError(error)) });
      return;
    }
    setNewPhotos((current) => [...current, ...picked]);
  }

  function removePhoto(key: string) {
    if (existingPhotos.some((photo) => photo.id === key)) {
      photos.remove.mutate(key, { onError: (error) => setMessage(messageForError(error)) });
      return;
    }
    setNewPhotos((current) => current.filter((photo) => photo.uri !== key));
  }

  function makeCover(key: string) {
    if (mode === "edit" && initial) {
      const order = [key, ...existingPhotos.map((photo) => photo.id).filter((id) => id !== key)];
      photos.reorder.mutate(order, { onError: (error) => setMessage(messageForError(error)) });
      return;
    }
    setNewPhotos((current) => {
      const chosen = current.find((photo) => photo.uri === key);
      return chosen ? [chosen, ...current.filter((photo) => photo.uri !== key)] : current;
    });
  }

  function submit() {
    if (!schema) {
      return;
    }
    setMessage(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrorsOf(parsed.error));
      return;
    }
    if (mode === "create") {
      if (newPhotos.length < picker.minPhotos) {
        setMessage(S.photos.required);
        return;
      }
      createPet.mutate(toCreateFormData(parsed.data, newPhotos), {
        onSuccess: (pet) => router.replace(APP_ROUTES.pet(pet.id)),
        onError: (error) => setMessage(messageForError(error)),
      });
      return;
    }
    const patch = toPatchBody(initialValues, parsed.data);
    if (isEmptyPatch(patch)) {
      router.back();
      return;
    }
    updatePet.mutate(patch, {
      onSuccess: () => router.back(),
      onError: (error) => setMessage(messageForError(error)),
    });
  }

  return (
    <ScrollScreen>
      <SectionTitle title={S.photos.label} hint={S.photos.hint(picker.maxPhotos)} />
      <PhotoGrid
        photos={tiles}
        maxPhotos={picker.maxPhotos}
        onAdd={() => setPickerOpen(true)}
        onRemove={removePhoto}
        onMakeCover={makeCover}
        disabled={busy}
      />
      {picker.preparing ? (
        <AppText variant="caption" tone="muted">
          {S.photos.processing}
        </AppText>
      ) : null}
      <ErrorBanner message={picker.message} tone="warn" />

      <TextField
        label={S.name.label}
        placeholder={S.name.placeholder}
        value={values.name}
        onChangeText={(value) => set("name", value)}
        maxLength={limits?.nameMaxLength}
        error={errors.name}
        autoCapitalize="words"
      />
      <ChipGroup
        label={S.species.label}
        options={PET_SPECIES.map((species) => ({ value: species, label: `${PETS_STRINGS.speciesEmoji[species]} ${PETS_STRINGS.species[species]}` }))}
        value={values.species}
        onChange={(species) => set("species", species)}
      />
      {values.species === "OTRO" ? (
        <TextField
          label={S.speciesDetail.label}
          placeholder={S.speciesDetail.placeholder}
          value={values.speciesDetail}
          onChangeText={(value) => set("speciesDetail", value)}
          maxLength={limits?.speciesDetailMaxLength}
          error={errors.speciesDetail}
        />
      ) : null}
      <ChipGroup
        label={S.sex.label}
        options={PET_SEXES.map((sex) => ({ value: sex, label: PETS_STRINGS.sex[sex] }))}
        value={values.sex}
        onChange={(sex) => set("sex", sex)}
      />
      <TextField
        label={S.description.label}
        placeholder={S.description.placeholder}
        value={values.description}
        onChangeText={(value) => set("description", value)}
        maxLength={limits?.descriptionMaxLength}
        error={errors.description}
        multiline
      />
      <DateField
        label={S.birthDate.label}
        value={values.birthDate}
        onChange={(value) => set("birthDate", value)}
        placeholder={S.birthDate.placeholder}
        clearLabel={S.birthDate.clear}
        confirmLabel={S.birthDate.confirm}
        maximumDate={birthDateRange.maximum}
        minimumDate={birthDateRange.minimum}
        error={errors.birthDate}
      />
      <ChipGroup
        label={S.sterilized.label}
        options={STERILIZED_OPTIONS}
        value={sterilizedToOption(values.sterilized)}
        onChange={(option) => set("sterilized", option === "unknown" ? null : option === "yes")}
      />
      <TextField
        label={S.microchip.label}
        placeholder={S.microchip.placeholder}
        hint={microchipLocked ? S.microchip.locked : S.microchip.hint}
        value={values.microchipCode}
        onChangeText={(value) => set("microchipCode", value)}
        maxLength={limits?.microchipCodeMaxLength}
        error={errors.microchipCode}
        editable={!microchipLocked}
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <TextField
        label={S.medicalNotes.label}
        placeholder={S.medicalNotes.placeholder}
        value={values.medicalNotes}
        onChangeText={(value) => set("medicalNotes", value)}
        maxLength={limits?.medicalNotesMaxLength}
        error={errors.medicalNotes}
        multiline
      />

      <SectionTitle title={S.visibility.title} />
      <SwitchRow
        title={S.visibility.phone.title}
        description={S.visibility.phone.description}
        value={values.showPhoneToFinder}
        onValueChange={(value) => set("showPhoneToFinder", value)}
      />
      <SwitchRow
        title={S.visibility.notes.title}
        description={S.visibility.notes.description}
        value={values.showMedicalNotes}
        onValueChange={(value) => set("showMedicalNotes", value)}
      />

      <View style={styles.submit}>
        <ErrorBanner message={message} />
        <CtaButton
          label={mode === "create" ? S.submitCreate : S.submitEdit}
          onPress={submit}
          loading={createPet.isPending || updatePet.isPending}
          disabled={busy || !schema}
        />
      </View>

      <Sheet visible={pickerOpen} onClose={() => setPickerOpen(false)} title={S.photos.add}>
        <SecondaryButton label={S.photos.fromLibrary} onPress={() => void addPhotos("library")} />
        <SecondaryButton label={S.photos.takePhoto} onPress={() => void addPhotos("camera")} />
      </Sheet>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  submit: { marginTop: 12, gap: 12 },
});
