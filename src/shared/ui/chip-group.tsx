import { StyleSheet, View } from "react-native";
import { AppText } from "./app-text";
import { Chip } from "./chip";
import { FieldLabel } from "./field-label";

/** Grupo de chips de selección única con etiqueta (especie, sexo, esterilización). */
export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string> {
  label: string;
  options: readonly ChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  error?: string | null;
}

export function ChipGroup<T extends string>({ label, options, value, onChange, disabled, error }: ChipGroupProps<T>) {
  return (
    <View style={styles.root} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <FieldLabel>{label}</FieldLabel>
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={option.value === value}
            onPress={() => onChange(option.value)}
            disabled={disabled}
          />
        ))}
      </View>
      {error ? (
        <AppText variant="caption" tone="warn" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  error: { marginTop: 5 },
});
