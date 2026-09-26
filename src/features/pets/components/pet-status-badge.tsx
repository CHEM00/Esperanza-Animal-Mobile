import { Badge, type BadgeTone } from "@/shared/ui/badge";
import type { PetStatus } from "../repository";
import { PETS_STRINGS } from "../strings";

/** Estado de la mascota con el color de la web: alerta para «Se busca», éxito para «En casa». */
const TONES: Record<PetStatus, BadgeTone> = {
  PERDIDA: "alert",
  EN_CASA: "success",
  INACTIVA: "muted",
};

export function PetStatusBadge({ status, testID }: { status: PetStatus; testID?: string }) {
  return <Badge label={PETS_STRINGS.status[status]} tone={TONES[status]} testID={testID} />;
}
