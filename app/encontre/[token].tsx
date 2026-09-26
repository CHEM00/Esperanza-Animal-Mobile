import { Stack, useLocalSearchParams } from "expo-router";
import { FinderScreen } from "@/features/collar/screens/finder-screen";
import { COLLAR_STRINGS } from "@/features/collar/strings";
import { useStackHeader } from "@/features/shell/navigation/stack-header";

export default function FinderRoute() {
  const { token } = useLocalSearchParams<{ token: string }>();
  return (
    <>
      <Stack.Screen options={useStackHeader(COLLAR_STRINGS.finder.title)} />
      <FinderScreen token={token} />
    </>
  );
}
