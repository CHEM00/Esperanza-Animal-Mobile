import { Stack } from "expo-router";
import { PetFormScreen } from "@/features/pets/screens/pet-form-screen";
import { PETS_STRINGS } from "@/features/pets/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function NewPetRoute() {
  return (
    <>
      <Stack.Screen options={useStackHeader(PETS_STRINGS.form.createTitle)} />
      <PetFormScreen petId={null} />
    </>
  );
}
