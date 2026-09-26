import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";
import { PawIcon } from "./brand/paw-icon";
import { CtaButton } from "./cta-button";

/** Estado vacío con huella, título, texto y acción opcional (como los de la web). */
interface EmptyStateProps {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  testID?: string;
}

export function EmptyState({ title, body, actionLabel, onAction, icon, testID }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View testID={testID} style={styles.root}>
      {icon ?? <PawIcon size={44} color={theme.colors.primary} />}
      <AppText variant="heading" style={styles.title}>
        {title}
      </AppText>
      <AppText tone="muted" style={styles.body}>
        {body}
      </AppText>
      {actionLabel && onAction ? (
        <View style={styles.cta}>
          <CtaButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 12 },
  title: { marginTop: 14, textAlign: "center" },
  body: { marginTop: 6, textAlign: "center" },
  cta: { marginTop: 20, width: "100%" },
});
