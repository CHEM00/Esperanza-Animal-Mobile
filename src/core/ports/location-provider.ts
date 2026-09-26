import type { GeoPoint } from "@/core/map/region";

/**
 * Puerto de ubicación del dispositivo (docs/06 §2). Solo posición puntual en
 * primer plano y con permiso pedido en contexto; nunca seguimiento.
 */

export type LocationResult =
  | { status: "ok"; point: GeoPoint }
  | { status: "denied" }
  | { status: "unavailable" };

export interface LocationProvider {
  getCurrentPosition(): Promise<LocationResult>;
}

export function createFakeLocationProvider(result: LocationResult): LocationProvider {
  return { async getCurrentPosition() { return result; } };
}
