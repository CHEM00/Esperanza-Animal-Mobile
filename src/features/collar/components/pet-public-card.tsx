import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { formatPhoneDisplay } from "@/core/i18n/format";
import { useTheme } from "@/core/theme/use-theme";
import { PETS_STRINGS } from "@/features/pets/strings";
import { AppText } from "@/shared/ui/app-text";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { COLLAR_STRINGS } from "../strings";
import type { PetPublicView } from "../repository";
import { ContactButtons } from "./contact-buttons";

/**
 * Tarjeta pública de la mascota (RF-F3, ADR-011), idéntica en contenido a la
 * web: nombre, foto, estado y mensaje; teléfono y notas solo si el servidor
 * los incluyó. La usan la vista de finder (M6) y la vista previa del dueño.
 */
export function PetPublicCard({ pet }: { pet: PetPublicView }) {
  const theme = useTheme();
  const isLost = pet.status === "PERDIDA";
  const cover = pet.photos[0];

  return (
    <Card flush>
      {cover ? (
        <Image source={{ uri: cover.url }} style={styles.cover} contentFit="cover" accessibilityLabel={`Foto de ${pet.name}`} />
      ) : (
        <View style={[styles.cover, styles.placeholder, { backgroundColor: theme.colors.tabTrack }]}>
          <AppText style={styles.emoji}>{PETS_STRINGS.speciesEmoji[pet.species]}</AppText>
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText variant="title" style={styles.name} numberOfLines={2}>
            {pet.name}
          </AppText>
          <Badge label={isLost ? COLLAR_STRINGS.publicCard.lost : COLLAR_STRINGS.publicCard.home} tone={isLost ? "alert" : "success"} />
        </View>
        {pet.speciesDetail ? (
          <AppText variant="caption" tone="muted">
            {`${PETS_STRINGS.speciesEmoji[pet.species]} ${pet.speciesDetail}`}
          </AppText>
        ) : null}
        <View style={[styles.message, { backgroundColor: theme.colors.bg, borderRadius: theme.radii.field }]}>
          <AppText style={styles.messageText}>{`«${pet.statusMessage}»`}</AppText>
        </View>
        {pet.medicalNotes ? (
          <AppText variant="caption" tone="muted" style={styles.notes}>
            <AppText variant="caption" style={{ color: theme.colors.ink, fontFamily: theme.fonts.body.bold }}>
              {`${COLLAR_STRINGS.publicCard.health} `}
            </AppText>
            {pet.medicalNotes}
          </AppText>
        ) : null}
        {pet.phone ? (
          <View style={styles.contact}>
            <AppText variant="caption" tone="muted" style={styles.family}>
              {`${COLLAR_STRINGS.publicCard.family} ${formatPhoneDisplay(pet.phone)}`}
            </AppText>
            <ContactButtons phone={pet.phone} petName={pet.name} />
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cover: { width: "100%", aspectRatio: 4 / 3 },
  placeholder: { alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 64, lineHeight: 76 },
  body: { padding: 16, gap: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  name: { flex: 1, fontSize: 22, lineHeight: 26 },
  message: { padding: 12 },
  messageText: { fontSize: 13.5, lineHeight: 20 },
  notes: { lineHeight: 18 },
  contact: { marginTop: 4, gap: 6 },
  family: { textAlign: "center" },
});
