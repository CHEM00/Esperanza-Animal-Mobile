import { CameraQrScanner } from "@/core/adapters/camera-qr-scanner";
import { createExpoImageCompressor } from "@/core/adapters/expo-image-compressor";
import { createExpoImagePicker } from "@/core/adapters/expo-image-picker";
import { createExpoLocationProvider } from "@/core/adapters/expo-location-provider";
import { createNativeShareSheet } from "@/core/adapters/native-share-sheet";
import { createNfcManagerReader } from "@/core/adapters/nfc-manager-reader";
import { ReactNativeMapsView } from "@/core/adapters/react-native-maps-view";
import type { ImageCompressor } from "@/core/ports/image-compressor";
import type { ImagePicker } from "@/core/ports/image-picker";
import type { LocationProvider } from "@/core/ports/location-provider";
import type { MapViewComponent } from "@/core/ports/map-view";
import type { NfcReader } from "@/core/ports/nfc-reader";
import type { QrScannerComponent } from "@/core/ports/qr-scanner";
import type { ShareSheet } from "@/core/ports/share-sheet";

/**
 * Raíz de composición de los puertos de dispositivo (docs/06 §3): aquí y solo
 * aquí se eligen los adaptadores reales. Los hooks de cada feature importan
 * este módulo; las pruebas lo sustituyen con dobles de `core/ports`.
 */

export const nfcReader: NfcReader = createNfcManagerReader();
export const imagePicker: ImagePicker = createExpoImagePicker();
export const imageCompressor: ImageCompressor = createExpoImageCompressor();
export const locationProvider: LocationProvider = createExpoLocationProvider();
export const shareSheet: ShareSheet = createNativeShareSheet();
export const DeviceMapView: MapViewComponent = ReactNativeMapsView;
export const DeviceQrScanner: QrScannerComponent = CameraQrScanner;
