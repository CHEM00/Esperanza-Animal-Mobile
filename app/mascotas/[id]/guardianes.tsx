import { Stack, useLocalSearchParams } from "expo-router";
import { GuardiansScreen } from "@/features/guardians/screens/guardians-screen";
import { GUARDIANS_STRINGS } from "@/features/guardians/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function PetGuardiansRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={useStackHeader(GUARDIANS_STRINGS.screen.title)} />
      <GuardiansScreen petId={id} />
    </>
  );
}
