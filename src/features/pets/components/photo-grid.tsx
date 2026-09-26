import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "@/shared/ui/app-text";
import { PETS_STRINGS } from "../strings";

/**
 * Cuadrícula de fotos del formulario M3: la primera es la portada; cada tile
 * se quita o se promueve a portada; el último tile agrega. Recibe URIs ya
 * resueltas (remotas o locales) para servir igual al crear y al editar.
 */
export interface PhotoTile {
  key: string;
  uri: string;
}

interface PhotoGridProps {
  photos: readonly PhotoTile[];
  maxPhotos: number;
  onAdd: () => void;
  onRemove: (key: string) => void;
  onMakeCover: (key: string) => void;
  disabled?: boolean;
}

const COLUMNS = 3;
const GAP = 8;

export function PhotoGrid({ photos, maxPhotos, onAdd, onRemove, onMakeCover, disabled }: PhotoGridProps) {
  const theme = useTheme();
  const canAdd = photos.length < maxPhotos && !disabled;
  return (
    <View style={styles.grid}>
      {photos.map((photo, index) => (
        <View key={photo.key} style={[styles.tile, { borderRadius: theme.radii.field }]}>
          <Image source={{ uri: photo.uri }} style={styles.image} contentFit="cover" accessibilityIgnoresInvertColors />
          {index === 0 ? (
            <View style={[styles.coverTag, { backgroundColor: theme.colors.primary, borderRadius: theme.radii.chip }]}>
              <AppText variant="caption" tone="onPrimary" style={styles.coverText}>
                {PETS_STRINGS.form.photos.cover}
              </AppText>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={PETS_STRINGS.form.photos.makeCover}
              disabled={disabled}
              onPress={() => onMakeCover(photo.key)}
              style={[styles.coverTag, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.chip }]}
            >
              <AppText variant="caption" tone="muted" style={styles.coverText}>
                {PETS_STRINGS.form.photos.makeCover}
              </AppText>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={PETS_STRINGS.form.photos.remove}
            disabled={disabled}
            onPress={() => onRemove(photo.key)}
            style={[styles.remove, { backgroundColor: theme.colors.ink }]}
          >
            <AppText variant="caption" style={{ color: theme.colors.bg, lineHeight: 14 }}>
              ✕
            </AppText>
          </Pressable>
        </View>
      ))}
      {canAdd ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={PETS_STRINGS.form.photos.add}
          onPress={onAdd}
          style={[
            styles.tile,
            styles.addTile,
            { borderColor: theme.colors.lineStrong, borderRadius: theme.radii.field, backgroundColor: theme.colors.bg },
          ]}
        >
          <AppText variant="label" tone="muted" style={styles.addText}>
            {`📷 ${PETS_STRINGS.form.photos.add}`}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP },
  tile: {
    width: `${Math.floor(100 / COLUMNS) - 1}%`,
    aspectRatio: 1,
    overflow: "hidden",
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  coverTag: { position: "absolute", left: 6, bottom: 6, paddingHorizontal: 7, paddingVertical: 2 },
  coverText: { fontSize: 10, lineHeight: 13 },
  remove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
  addTile: { borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", padding: 6 },
  addText: { textAlign: "center", fontSize: 11.5 },
});
