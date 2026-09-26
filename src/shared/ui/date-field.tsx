import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { formatLongDate, fromIsoDate, toIsoDate } from "@/core/i18n/format";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "./app-text";
import { FieldLabel } from "./field-label";
import { Sheet } from "./sheet";

/**
 * Campo de fecha con el selector del sistema (docs/06 §10): diálogo nativo en
 * Android y rueda en una hoja en iOS. El valor viaja como `YYYY-MM-DD`, la
 * forma que espera el contrato.
 */
interface DateFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  clearLabel: string;
  confirmLabel: string;
  maximumDate?: Date;
  minimumDate?: Date;
  error?: string | null;
  testID?: string;
}

export function DateField({
  label,
  value,
  onChange,
  placeholder,
  clearLabel,
  confirmLabel,
  maximumDate,
  minimumDate,
  error,
  testID,
}: DateFieldProps) {
  const theme = useTheme();
  const [iosOpen, setIosOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState<Date>(fromIsoDate(value) ?? new Date());
  const current = fromIsoDate(value);

  function open() {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: current ?? new Date(),
        mode: "date",
        maximumDate,
        minimumDate,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          if (event.type === "set" && date) {
            onChange(toIsoDate(date));
          }
        },
      });
      return;
    }
    setIosDraft(current ?? new Date());
    setIosOpen(true);
  }

  return (
    <View style={styles.root}>
      <FieldLabel>{label}</FieldLabel>
      <View style={styles.row}>
        <Pressable
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityValue={{ text: current ? formatLongDate(current) : placeholder }}
          onPress={open}
          style={[
            styles.field,
            {
              backgroundColor: theme.colors.bg,
              borderColor: error ? theme.colors.alert : theme.colors.line,
              borderRadius: theme.radii.field,
            },
          ]}
        >
          <AppText style={{ color: current ? theme.colors.ink : theme.colors.faint }}>
            {current ? formatLongDate(current) : placeholder}
          </AppText>
        </Pressable>
        {current ? (
          <Pressable accessibilityRole="button" accessibilityLabel={clearLabel} onPress={() => onChange(null)} style={styles.clear}>
            <AppText variant="label" tone="primary">
              {clearLabel}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" style={[styles.help, { color: theme.colors.alert }]}>
          {error}
        </AppText>
      ) : null}
      {Platform.OS === "ios" ? (
        <Sheet visible={iosOpen} onClose={() => setIosOpen(false)} title={label}>
          <DateTimePicker
            value={iosDraft}
            mode="date"
            display="spinner"
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            locale="es-MX"
            onChange={(_event, date) => date && setIosDraft(date)}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onChange(toIsoDate(iosDraft));
              setIosOpen(false);
            }}
            style={[styles.confirm, { backgroundColor: theme.colors.primary, borderRadius: theme.radii.btn }]}
          >
            <AppText variant="label" tone="onPrimary">
              {confirmLabel}
            </AppText>
          </Pressable>
        </Sheet>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  field: { flex: 1, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 12 },
  clear: { paddingVertical: 8, paddingHorizontal: 4 },
  help: { marginTop: 5 },
  confirm: { alignItems: "center", paddingVertical: 13 },
});
