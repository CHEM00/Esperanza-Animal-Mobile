import { Stack } from "expo-router";
import { PetsListScreen } from "@/features/pets/screens/pets-list-screen";
import { PETS_STRINGS } from "@/features/pets/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function PetsRoute() {
  return (
    <>
      <Stack.Screen options={useStackHeader(PETS_STRINGS.list.title)} />
      <PetsListScreen />
    </>
  );
}
