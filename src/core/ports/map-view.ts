import type { ComponentType } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { GeoPoint, MapRegion } from "@/core/map/region";

/**
 * Puerto de mapa (docs/06 §9): la UI describe región y marcadores; el
 * adaptador (react-native-maps) los pinta. Los tipos de marcador usan el color
 * de token que indica el documento 06: perdido `alert`, avistamiento
 * `primary`, encontrado `success`, escaneo `warn`.
 */

export type MapMarkerKind = "lost" | "sighting" | "found" | "scan" | "pin";

export interface MapMarker {
  id: string;
  point: GeoPoint;
  kind: MapMarkerKind;
  title?: string;
  description?: string;
}

export interface MapViewProps {
  region: MapRegion;
  markers?: readonly MapMarker[];
  /** Marcador arrastrable para elegir un punto (3c/3f); null = sin pin. */
  draggablePin?: GeoPoint | null;
  onPinMoved?: (point: GeoPoint) => void;
  onPressMarker?: (markerId: string) => void;
  /** Toque en el mapa vacío (mueve el pin cuando hay uno). */
  onPressMap?: (point: GeoPoint) => void;
  /** Círculo de zona aproximada alrededor del pin, en metros. */
  approximateRadiusMeters?: number | null;
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type MapViewComponent = ComponentType<MapViewProps>;
