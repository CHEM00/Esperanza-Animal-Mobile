import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@/core/theme/use-theme";

/** Superficie con borde de línea y radio de tarjeta, como `.rounded-card` de la web. */
interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Sin padding interno (cuando la tarjeta empieza con una foto a sangre). */
  flush?: boolean;
  testID?: string;
}

const PADDING = 16;

export function Card({ children, style, flush = false, testID }: CardProps) {
  const theme = useTheme();
  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.line,
          borderRadius: theme.radii.card,
        },
        !flush && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, overflow: "hidden", width: "100%" },
  padded: { padding: PADDING },
});
