import * as Location from "expo-location";
import type { LocationProvider, LocationResult } from "@/core/ports/location-provider";

/**
 * Adaptador de expo-location: una posición puntual con precisión equilibrada
 * (basta para «por dónde buscar»; nunca el punto exacto se guarda sin que la
 * persona lo confirme).
 */
export function createExpoLocationProvider(): LocationProvider {
  return {
    async getCurrentPosition(): Promise<LocationResult> {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        return { status: "denied" };
      }
      try {
        if (!(await Location.hasServicesEnabledAsync())) {
          return { status: "unavailable" };
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        return {
          status: "ok",
          point: { lat: position.coords.latitude, lng: position.coords.longitude },
        };
      } catch {
        return { status: "unavailable" };
      }
    },
  };
}
