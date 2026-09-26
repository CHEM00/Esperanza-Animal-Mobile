import { Stack } from "expo-router";
import { ScanCollarScreen } from "@/features/collar/screens/scan-collar-screen";
import { COLLAR_STRINGS } from "@/features/collar/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function ScanCollarRoute() {
  return (
    <>
      <Stack.Screen options={useStackHeader(COLLAR_STRINGS.scan.title)} />
      <ScanCollarScreen />
    </>
  );
}
