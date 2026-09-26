import { StyleSheet, View } from "react-native";
import { formatDateTime } from "@/core/i18n/format";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "@/shared/ui/app-text";
import type { PetChanges } from "../repository";
import { PETS_STRINGS } from "../strings";

/** Historial de cambios del perfil (RF-C10): quién, qué y cuándo; primera página. */
export function PetChangesList({ changes }: { changes: PetChanges }) {
  const theme = useTheme();
  const S = PETS_STRINGS.profile.changes;
  if (changes.items.length === 0) {
    return (
      <AppText variant="caption" tone="muted">
        {S.empty}
      </AppText>
    );
  }
  return (
    <View style={styles.list}>
      {changes.items.map((item) => (
        <View key={item.id} style={[styles.item, { borderBottomColor: theme.colors.line }]}>
          <View style={styles.header}>
            <AppText variant="label">{S.fields[item.field]}</AppText>
            <AppText variant="caption" tone="faint">
              {formatDateTime(new Date(item.createdAt))}
            </AppText>
          </View>
          <AppText variant="caption" tone="muted">
            {`${item.previousValue ?? S.blank} ${S.arrow} ${item.newValue ?? S.blank}`}
          </AppText>
          <AppText variant="caption" tone="faint">
            {item.changedBy ? S.by(item.changedBy.name) : S.system}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  item: { paddingVertical: 10, gap: 2, borderBottomWidth: StyleSheet.hairlineWidth },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
});
