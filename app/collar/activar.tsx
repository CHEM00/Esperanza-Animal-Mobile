import { Stack, useLocalSearchParams } from "expo-router";
import { ActivateCollarScreen } from "@/features/collar/screens/activate-collar-screen";
import { COLLAR_STRINGS } from "@/features/collar/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

/** `?petId=` preselecciona la mascota; `?token=&expiresAt=` trae una lectura ya verificada. */
export default function ActivateCollarRoute() {
  const params = useLocalSearchParams<{ petId?: string; token?: string; expiresAt?: string }>();
  const initialScan = params.token && params.expiresAt ? { token: params.token, expiresAt: params.expiresAt } : null;
  return (
    <>
      <Stack.Screen options={useStackHeader(COLLAR_STRINGS.activation.title)} />
      <ActivateCollarScreen preselectedPetId={params.petId ?? null} initialScan={initialScan} />
    </>
  );
}
