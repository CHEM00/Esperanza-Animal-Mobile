import { Stack, useLocalSearchParams } from "expo-router";
import { LinkAcceptScreen } from "@/features/guardians/screens/link-accept-screen";
import { GUARDIANS_STRINGS } from "@/features/guardians/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function GuardianInviteRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return (
    <>
      <Stack.Screen options={useStackHeader(GUARDIANS_STRINGS.link.invite.title)} />
      <LinkAcceptScreen kind="invite" code={code} />
    </>
  );
}
