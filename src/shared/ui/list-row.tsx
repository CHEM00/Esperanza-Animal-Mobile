import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/** Fila de lista con título, subtítulo y accesorio; toque opcional con ripple. */
interface ListRowProps {
  title: string;
  subtitle?: string | null;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityHint?: string;
  testID?: string;
}

export function ListRow({ title, subtitle, leading, trailing, onPress, accessibilityHint, testID }: ListRowProps) {
  const theme = useTheme();
  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.texts}>
        <AppText variant="label" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </>
  );
  const base = [styles.row, { borderBottomColor: theme.colors.line }];
  if (!onPress) {
    return (
      <View testID={testID} style={base}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      android_ripple={{ color: theme.colors.line }}
      style={({ pressed }) => [base, { opacity: pressed && Platform.OS === "ios" ? 0.7 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leading: { width: 44, alignItems: "center" },
  texts: { flex: 1 },
  subtitle: { marginTop: 2 },
  trailing: { marginLeft: 4 },
});
