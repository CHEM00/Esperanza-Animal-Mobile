import { Stack, useLocalSearchParams } from "expo-router";
import { ScanResolverScreen } from "@/features/collar/screens/scan-resolver-screen";
import { COLLAR_STRINGS } from "@/features/collar/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

/** Enlace universal del QR impreso: `https://<dominio>/q/{code}` abre aquí. */
export default function QrScanRoute() {
  const params = useLocalSearchParams();
  return (
    <>
      <Stack.Screen options={useStackHeader(COLLAR_STRINGS.resolver.title)} />
      <ScanResolverScreen params={params} />
    </>
  );
}
