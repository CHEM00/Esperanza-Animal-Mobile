import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { SHELL_STRINGS } from "@/features/shell/strings";
import { AppText } from "@/shared/ui/app-text";
import { telUrl, whatsappUrl } from "@/shared/utils/contact-links";
import { COLLAR_STRINGS } from "../strings";

/** Llamar y WhatsApp (S19): abren la app del sistema; el teléfono ya viene con opt-in del dueño. */
interface ContactButtonsProps {
  phone: string;
  petName: string;
}

export function ContactButtons({ phone, petName }: ContactButtonsProps) {
  const theme = useTheme();
  const message = COLLAR_STRINGS.publicCard.whatsappMessage(petName, SHELL_STRINGS.appName);
  const buttons = [
    { label: COLLAR_STRINGS.publicCard.call, url: telUrl(phone), background: theme.colors.primary, ink: theme.colors.onPrimary },
    { label: COLLAR_STRINGS.publicCard.whatsapp, url: whatsappUrl(phone, message), background: theme.colors.whatsapp, ink: theme.colors.onPrimary },
  ];
  return (
    <View style={styles.row}>
      {buttons.map((button) => (
        <Pressable
          key={button.label}
          accessibilityRole="link"
          accessibilityLabel={button.label}
          onPress={() => void Linking.openURL(button.url)}
          android_ripple={{ color: theme.colors.line }}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: button.background, borderRadius: theme.radii.btn, opacity: pressed && Platform.OS === "ios" ? 0.85 : 1 },
          ]}
        >
          <AppText variant="label" style={{ color: button.ink }}>
            {button.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  button: { flex: 1, alignItems: "center", paddingVertical: 12 },
});
