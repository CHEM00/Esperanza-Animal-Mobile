import { Platform, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";

/** Chip seleccionable (especie, sexo, horas de silencio): tinte primario al elegirse. */
interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export function Chip({ label, selected, onPress, disabled, testID }: ChipProps) {
  const theme = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: theme.colors.line }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primaryTint : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.line,
          borderRadius: theme.radii.chip,
          opacity: disabled ? 0.5 : pressed && Platform.OS === "ios" ? 0.8 : 1,
        },
      ]}
    >
      <AppText variant="label" style={{ color: selected ? theme.colors.privacyInk : theme.colors.ink }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1.5 },
});
