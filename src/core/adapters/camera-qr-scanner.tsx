import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import type { QrScannerProps } from "@/core/ports/qr-scanner";

/**
 * Adaptador de expo-camera para leer el QR impreso del collar (respaldo de la
 * lectura NFC, RF-F7). Pide el permiso al montarse porque la pantalla ya
 * explicó para qué; entrega cada código una sola vez.
 */
export function CameraQrScanner({ onCode, onPermissionDenied, active, style }: QrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const lastCode = useRef<string | null>(null);

  useEffect(() => {
    if (permission === null) {
      return;
    }
    if (!permission.granted && permission.canAskAgain) {
      void requestPermission();
    } else if (!permission.granted) {
      onPermissionDenied();
    }
  }, [permission, requestPermission, onPermissionDenied]);

  useEffect(() => {
    if (active) {
      lastCode.current = null;
    }
  }, [active]);

  if (!permission?.granted) {
    return <View style={[styles.placeholder, style]} />;
  }

  return (
    <CameraView
      style={[styles.camera, style]}
      facing="back"
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={
        active
          ? ({ data }) => {
              if (data && data !== lastCode.current) {
                lastCode.current = data;
                onCode(data);
              }
            }
          : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  camera: { width: "100%", height: "100%" },
  placeholder: { width: "100%", height: "100%" },
});
