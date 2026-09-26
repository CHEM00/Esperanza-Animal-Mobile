import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "@/shared/ui/app-text";
import type { PetSummary } from "../repository";
import { PETS_STRINGS } from "../strings";
import { PetStatusBadge } from "./pet-status-badge";

/** Tarjeta de la lista M1: portada, nombre, estado, collar y rol. */
interface PetCardProps {
  pet: PetSummary;
  onPress: () => void;
}

const COVER_SIZE = 64;

export function collarLabel(tag: PetSummary["tag"]): string {
  if (!tag) {
    return PETS_STRINGS.list.collar.none;
  }
  if (tag.mutedUntil && new Date(tag.mutedUntil).getTime() > Date.now()) {
    return PETS_STRINGS.list.collar.muted;
  }
  return PETS_STRINGS.list.collar[tag.status];
}

export function PetCard({ pet, onPress }: PetCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${pet.name}, ${PETS_STRINGS.status[pet.status]}`}
      onPress={onPress}
      android_ripple={{ color: theme.colors.line }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.line,
          borderRadius: theme.radii.card,
          opacity: pressed && Platform.OS === "ios" ? 0.85 : 1,
        },
      ]}
    >
      {pet.coverPhotoUrl ? (
        <Image
          source={{ uri: pet.coverPhotoUrl }}
          style={[styles.cover, { borderRadius: theme.radii.field }]}
          contentFit="cover"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View style={[styles.cover, styles.placeholder, { backgroundColor: theme.colors.tabTrack, borderRadius: theme.radii.field }]}>
          <AppText style={styles.emoji}>{PETS_STRINGS.speciesEmoji[pet.species]}</AppText>
        </View>
      )}
      <View style={styles.texts}>
        <View style={styles.titleRow}>
          <AppText variant="heading" numberOfLines={1} style={styles.name}>
            {pet.name}
          </AppText>
          <PetStatusBadge status={pet.status} />
        </View>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {`${PETS_STRINGS.speciesEmoji[pet.species]} ${pet.speciesDetail ?? PETS_STRINGS.species[pet.species]} · ${collarLabel(pet.tag)}`}
        </AppText>
        {pet.role === "GUARDIAN" ? (
          <AppText variant="caption" tone="faint">
            {PETS_STRINGS.list.role.GUARDIAN}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, padding: 12 },
  cover: { width: COVER_SIZE, height: COVER_SIZE },
  placeholder: { alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 28, lineHeight: 34 },
  texts: { flex: 1, gap: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  name: { flex: 1 },
});
