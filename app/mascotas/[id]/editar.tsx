import { Stack, useLocalSearchParams } from "expo-router";
import { PetFormScreen } from "@/features/pets/screens/pet-form-screen";
import { PETS_STRINGS } from "@/features/pets/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function EditPetRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={useStackHeader(PETS_STRINGS.form.editTitle)} />
      <PetFormScreen petId={id} />
    </>
  );
}
