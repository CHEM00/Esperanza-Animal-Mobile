import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";
import { PawIcon } from "./brand/paw-icon";
import { CtaButton } from "./cta-button";
import { ErrorBanner } from "./error-banner";

/**
 * Aviso modal centrado, reproducción de las tarjetas 3d («Antes de publicar»)
 * y 3e («Una última cosa») de la web: borde teñido, huellas de marca de agua
 * y botón principal. El tono `warn` es el de la responsiva.
 */
interface NoticeModalProps {
  visible: boolean;
  title: string;
  children: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tone?: "primary" | "warn";
  busy?: boolean;
  error?: string | null;
  /** Emoji o icono grande sobre el título (la responsiva usa 🤝). */
  emblem?: string;
  testID?: string;
}

const BACKDROP = "rgba(0, 0, 0, 0.5)";
const WATERMARK_OPACITY = 0.09;
const BORDER_ALPHA = "8c";

export function NoticeModal({
  visible,
  title,
  children,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  tone = "primary",
  busy = false,
  error = null,
  emblem,
  testID,
}: NoticeModalProps) {
  const theme = useTheme();
  const accent = tone === "warn" ? theme.colors.warn : theme.colors.primary;
  const watermark = tone === "warn" ? theme.colors.warnInk : theme.colors.primary;
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => undefined}>
      <View style={[styles.backdrop, { backgroundColor: BACKDROP }]}>
        <View
          testID={testID}
          accessibilityViewIsModal
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.modal,
              borderColor: `${accent}${BORDER_ALPHA}`,
            },
          ]}
        >
          <View pointerEvents="none" style={[styles.watermarkLeft, styles.watermark]}>
            <PawIcon size={40} color={watermark} />
          </View>
          <View pointerEvents="none" style={[styles.watermarkRight, styles.watermark]}>
            <PawIcon size={56} color={watermark} />
          </View>
          {emblem ? (
            <View style={[styles.emblem, { backgroundColor: tone === "warn" ? theme.colors.warnTint : theme.colors.primaryTint }]}>
              <AppText style={styles.emblemText}>{emblem}</AppText>
            </View>
          ) : null}
          <AppText variant="title" style={styles.title}>
            {title}
          </AppText>
          <View style={styles.body}>{children}</View>
          <View style={styles.error}>
            <ErrorBanner message={error} />
          </View>
          <CtaButton label={primaryLabel} onPress={onPrimary} loading={busy} />
          {secondaryLabel && onSecondary ? (
            <Pressable
              accessibilityRole="button"
              onPress={onSecondary}
              disabled={busy}
              style={styles.secondary}
            >
              <AppText variant="label" tone="muted">
                {secondaryLabel}
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

/** Párrafo del aviso con el tono de la web (muted, centrado). */
export function NoticeParagraph({ children }: { children: ReactNode }) {
  return (
    <AppText tone="muted" style={styles.paragraph}>
      {children}
    </AppText>
  );
}

/** Fragmento enfatizado dentro de un párrafo (el `<strong>` de la web). */
export function NoticeStrong({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return <AppText style={{ color: theme.colors.ink, fontFamily: theme.fonts.body.bold }}>{children}</AppText>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  card: {
    width: "100%",
    maxWidth: 340,
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    overflow: "hidden",
  },
  watermark: { opacity: WATERMARK_OPACITY },
  watermarkLeft: { position: "absolute", left: -8, top: "30%", transform: [{ rotate: "-20deg" }] },
  watermarkRight: { position: "absolute", right: -10, bottom: "16%", transform: [{ rotate: "15deg" }] },
  emblem: { alignSelf: "center", width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  emblemText: { fontSize: 24, lineHeight: 30 },
  title: { textAlign: "center", fontSize: 19, lineHeight: 24 },
  body: { marginTop: 12, gap: 12 },
  error: { marginTop: 12 },
  secondary: { marginTop: 6, paddingVertical: 10, alignItems: "center" },
  paragraph: { textAlign: "center", lineHeight: 21 },
});
