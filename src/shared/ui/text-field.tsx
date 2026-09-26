import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";
import { FieldLabel } from "./field-label";

/**
 * Campo de texto con etiqueta, ayuda y error, con los tokens de la web
 * (`rounded-field`, borde de línea, fondo `bg`).
 */
interface TextFieldProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string | null;
  hint?: string;
  /** Contador «12/40» cuando hay tope. */
  maxLength?: number;
  multiline?: boolean;
}

export function TextField({ label, error, hint, maxLength, multiline, value, ...rest }: TextFieldProps) {
  const theme = useTheme();
  const borderColor = error ? theme.colors.alert : theme.colors.line;
  return (
    <View style={styles.root}>
      <FieldLabel
        trailing={
          maxLength ? (
            <AppText variant="caption" tone="faint">
              {`${value?.length ?? 0}/${maxLength}`}
            </AppText>
          ) : null
        }
      >
        {label}
      </FieldLabel>
      <TextInput
        accessibilityLabel={label}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        placeholderTextColor={theme.colors.faint}
        style={[
          styles.input,
          multiline && styles.multiline,
          {
            color: theme.colors.ink,
            backgroundColor: theme.colors.bg,
            borderColor,
            borderRadius: theme.radii.field,
            fontFamily: theme.fonts.body.semibold,
          },
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" style={[styles.help, { color: theme.colors.alert }]} accessibilityRole="alert">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" tone="faint" style={styles.help}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%" },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
  },
  multiline: { minHeight: 96, textAlignVertical: "top" },
  help: { marginTop: 5 },
});
