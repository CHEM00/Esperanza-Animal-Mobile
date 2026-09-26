import * as ExpoImagePicker from "expo-image-picker";
import type { ImagePicker, ImagePickResult, PickedImage } from "@/core/ports/image-picker";

/**
 * Adaptador de expo-image-picker: galería del sistema (selector sin permiso
 * en iOS 14+ y Android 13+) y cámara. El permiso se pide en contexto, al tocar
 * «Agregar foto», nunca al arrancar (docs/06 §7).
 */

function toPicked(asset: ExpoImagePicker.ImagePickerAsset): PickedImage {
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType ?? null,
    fileName: asset.fileName ?? null,
  };
}

function toResult(result: ExpoImagePicker.ImagePickerResult): ImagePickResult {
  if (result.canceled || result.assets.length === 0) {
    return { status: "cancelled" };
  }
  return { status: "picked", images: result.assets.map(toPicked) };
}

export function createExpoImagePicker(): ImagePicker {
  return {
    async pickFromLibrary(limit) {
      const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted && !permission.canAskAgain) {
        return { status: "denied" };
      }
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: limit > 1,
        selectionLimit: limit,
        quality: 1,
        exif: false,
      });
      return toResult(result);
    },

    async takePhoto() {
      const permission = await ExpoImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        return { status: "denied" };
      }
      const result = await ExpoImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
        exif: false,
      });
      return toResult(result);
    },
  };
}
