import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme/use-theme";
import { AppText } from "@/shared/ui/app-text";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { TextField } from "@/shared/ui/text-field";
import { AUTH_STRINGS } from "../strings";

/**
 * Sesión de desarrollo (solo builds `development`, docs/08 §1): pega el token
 * portador que imprime `scripts/dev-session.mjs` del backend y entra sin
 * proveedor OAuth. Permite probar en Expo Go, donde Google nativo no existe y
 * Apple emite el token para otra app. La pantalla que lo muestra decide
 * cuándo aparece; este componente solo captura y entrega el token.
 */
interface DevSessionFormProps {
  onAdopt: (token: string) => Promise<boolean>;
  busy: boolean;
}

export function DevSessionForm({ onAdopt, busy }: DevSessionFormProps) {
  const theme = useTheme();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const S = AUTH_STRINGS.devSession;

  async function submit() {
    setError(null);
    const accepted = await onAdopt(token);
    if (!accepted) {
      setError(S.invalid);
    }
  }

  return (
    <View style={[styles.root, { borderColor: theme.colors.warnLine, backgroundColor: theme.colors.warnTint, borderRadius: theme.radii.card }]}>
      <AppText variant="label" style={{ color: theme.colors.warnInk }}>
        {S.title}
      </AppText>
      <AppText variant="caption" style={[styles.hint, { color: theme.colors.warnInk }]}>
        {S.hint}
      </AppText>
      <TextField
        label={S.label}
        placeholder={S.placeholder}
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />
      <ErrorBanner message={error} />
      <SecondaryButton label={S.action} loading={busy} disabled={token.trim().length === 0} onPress={() => void submit()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%", borderWidth: 1.5, padding: 14, gap: 10, marginTop: 20 },
  hint: { marginTop: -4 },
});
