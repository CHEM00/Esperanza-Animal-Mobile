import { Stack, useLocalSearchParams } from "expo-router";
import { ScanHistoryScreen } from "@/features/collar/screens/scan-history-screen";
import { COLLAR_STRINGS } from "@/features/collar/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function PetScansRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={useStackHeader(COLLAR_STRINGS.history.title)} />
      <ScanHistoryScreen petId={id} />
    </>
  );
}
