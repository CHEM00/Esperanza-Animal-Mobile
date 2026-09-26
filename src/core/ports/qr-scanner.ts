import type { ComponentType } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/**
 * Puerto del lector de QR con cámara: respaldo de la lectura NFC en
 * dispositivos sin NFC (RF-F7). El adaptador real usa expo-camera.
 */

export interface QrScannerProps {
  /** Se llama una vez por código leído; la pantalla decide si sigue escaneando. */
  onCode: (data: string) => void;
  /** Permiso de cámara negado: la pantalla muestra la alternativa. */
  onPermissionDenied: () => void;
  active: boolean;
  style?: StyleProp<ViewStyle>;
}

export type QrScannerComponent = ComponentType<QrScannerProps>;
