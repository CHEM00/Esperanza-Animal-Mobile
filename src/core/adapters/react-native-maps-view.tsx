import { useMemo } from "react";
import { StyleSheet } from "react-native";
import MapView, { Circle, Marker, type MapPressEvent, type MarkerDragStartEndEvent } from "react-native-maps";
import type { MapMarkerKind, MapViewProps } from "@/core/ports/map-view";
import { useTheme } from "@/core/theme/use-theme";
import type { ColorTokens } from "@/core/theme/tokens.generated";

/**
 * Adaptador de react-native-maps (docs/06 §9): Apple Maps en iOS y Google
 * Maps en Android (la llave llega por el entorno de build). Los colores de
 * marcador son tokens del tema, no valores sueltos.
 */

const MARKER_COLOR_TOKEN: Record<MapMarkerKind, keyof ColorTokens> = {
  lost: "alert",
  sighting: "primary",
  found: "success",
  scan: "warn",
  pin: "primary",
};

/** Opacidad del relleno del círculo de zona aproximada (dos dígitos hex). */
const ZONE_FILL_ALPHA = "33";

export function ReactNativeMapsView({
  region,
  markers = [],
  draggablePin = null,
  onPinMoved,
  onPressMarker,
  onPressMap,
  approximateRadiusMeters = null,
  scrollEnabled = true,
  style,
  testID,
}: MapViewProps) {
  const theme = useTheme();
  const colors = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(MARKER_COLOR_TOKEN) as MapMarkerKind[]).map((kind) => [
          kind,
          theme.colors[MARKER_COLOR_TOKEN[kind]],
        ]),
      ) as Record<MapMarkerKind, string>,
    [theme],
  );

  function handlePinDragEnd(event: MarkerDragStartEndEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onPinMoved?.({ lat: latitude, lng: longitude });
  }

  function handleMapPress(event: MapPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onPressMap?.({ lat: latitude, lng: longitude });
  }

  return (
    <MapView
      testID={testID}
      style={[styles.map, style]}
      initialRegion={region}
      region={region}
      scrollEnabled={scrollEnabled}
      zoomEnabled={scrollEnabled}
      rotateEnabled={false}
      pitchEnabled={false}
      toolbarEnabled={false}
      showsPointsOfInterests={false}
      userInterfaceStyle={theme.mode}
      onPress={onPressMap ? handleMapPress : undefined}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          identifier={marker.id}
          coordinate={{ latitude: marker.point.lat, longitude: marker.point.lng }}
          pinColor={colors[marker.kind]}
          title={marker.title}
          description={marker.description}
          onPress={onPressMarker ? () => onPressMarker(marker.id) : undefined}
        />
      ))}
      {draggablePin ? (
        <Marker
          identifier="pin"
          draggable
          coordinate={{ latitude: draggablePin.lat, longitude: draggablePin.lng }}
          pinColor={colors.pin}
          onDragEnd={handlePinDragEnd}
        />
      ) : null}
      {draggablePin && approximateRadiusMeters ? (
        <Circle
          center={{ latitude: draggablePin.lat, longitude: draggablePin.lng }}
          radius={approximateRadiusMeters}
          strokeColor={theme.colors.primary}
          fillColor={`${theme.colors.primary}${ZONE_FILL_ALPHA}`}
        />
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: "100%" },
});
