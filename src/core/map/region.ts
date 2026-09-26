/**
 * Geometría de mapa (docs/06 §9). react-native-maps trabaja con regiones
 * (centro + deltas) y la web con centro + zoom; aquí se traduce una en otra
 * para que `cityZoom` y `caseZoom` de la configuración remota signifiquen lo
 * mismo en ambos clientes. Módulo puro.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface CoordinateBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/** Proporción alto/ancho típica del lienzo del mapa en un teléfono vertical. */
const DEFAULT_ASPECT_RATIO = 0.75;
/** Grados de longitud visibles a zoom 0 (todo el mundo). */
const WORLD_LNG_DEGREES = 360;

/** Región centrada en `center` con el ancho visible que corresponde a `zoom`. */
export function regionFromCenterZoom(
  center: GeoPoint,
  zoom: number,
  aspectRatio: number = DEFAULT_ASPECT_RATIO,
): MapRegion {
  const longitudeDelta = WORLD_LNG_DEGREES / Math.pow(2, zoom);
  return {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: longitudeDelta * aspectRatio,
    longitudeDelta,
  };
}

/** Región que encuadra todos los puntos, con margen; un solo punto usa `fallbackZoom`. */
export function regionFittingPoints(
  points: readonly GeoPoint[],
  fallbackZoom: number,
  paddingRatio: number = 0.3,
): MapRegion | null {
  const first = points[0];
  if (!first) {
    return null;
  }
  if (points.length === 1) {
    return regionFromCenterZoom(first, fallbackZoom);
  }
  let minLat = first.lat;
  let maxLat = first.lat;
  let minLng = first.lng;
  let maxLng = first.lng;
  for (const point of points) {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  }
  const minimumDelta = WORLD_LNG_DEGREES / Math.pow(2, fallbackZoom);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * (1 + paddingRatio), minimumDelta * DEFAULT_ASPECT_RATIO),
    longitudeDelta: Math.max((maxLng - minLng) * (1 + paddingRatio), minimumDelta),
  };
}

/** ¿El punto cae dentro de la caja de coordenadas de la plataforma? */
export function isWithinBounds(point: GeoPoint, bounds: CoordinateBounds): boolean {
  return (
    point.lat >= bounds.minLat &&
    point.lat <= bounds.maxLat &&
    point.lng >= bounds.minLng &&
    point.lng <= bounds.maxLng
  );
}
