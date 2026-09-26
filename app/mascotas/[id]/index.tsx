import { Stack, useLocalSearchParams } from "expo-router";
import { PetProfileScreen } from "@/features/pets/screens/pet-profile-screen";
import { PETS_STRINGS } from "@/features/pets/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function PetRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={useStackHeader(PETS_STRINGS.list.title)} />
      <PetProfileScreen petId={id} />
    </>
  );
}
