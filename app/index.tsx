import { Redirect } from "expo-router";
import { APP_ROUTES } from "@/core/navigation/links";

/** Ver es público (RF-A1): la app abre directo en el feed, como la PWA. */
export default function Index() {
  return <Redirect href={APP_ROUTES.feed} />;
}
