import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTheme } from "@/core/theme/use-theme";
import { SHELL_STRINGS } from "@/features/shell/strings";

/**
 * Barra de pestañas nativa (docs/06 §10): UITabBar en iOS y barra Material en
 * Android, con la marca en los colores. Mismo orden que el nav de la web:
 * Inicio, Mapa, Alertas, Perfil. El botón central de publicar llega con S12.
 */
export default function TabsLayout() {
  const theme = useTheme();
  return (
    <NativeTabs
      backgroundColor={theme.colors.surface}
      tintColor={theme.colors.primary}
      iconColor={theme.colors.muted}
      labelStyle={{ fontFamily: theme.fonts.display.semibold, color: theme.colors.muted }}
    >
      <NativeTabs.Trigger name="inicio">
        <NativeTabs.Trigger.Label>{SHELL_STRINGS.tabs.feed}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="mapa">
        <NativeTabs.Trigger.Label>{SHELL_STRINGS.tabs.map}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "map", selected: "map.fill" }} md="map" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="alertas">
        <NativeTabs.Trigger.Label>{SHELL_STRINGS.tabs.alerts}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "bell", selected: "bell.fill" }} md="notifications" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="perfil">
        <NativeTabs.Trigger.Label>{SHELL_STRINGS.tabs.profile}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
