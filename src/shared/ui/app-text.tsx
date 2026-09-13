import { Text, type TextProps } from "react-native";
import { useTheme } from "@/core/theme/use-theme";

/**
 * Texto con la tipografía y los colores del tema. Variantes con la escala
 * móvil de la web (docs/especificaciones-diseno.md §1).
 */

type Variant = "title" | "heading" | "body" | "caption" | "label";
type Tone = "ink" | "heading" | "muted" | "faint" | "primary" | "onPrimary" | "warn";

const VARIANT_STYLES: Record<Variant, { size: number; lineHeight: number; weight: "regular" | "medium" | "semibold" | "bold"; display: boolean }> = {
  title: { size: 21, lineHeight: 26, weight: "bold", display: true },
  heading: { size: 15.5, lineHeight: 20, weight: "bold", display: true },
  body: { size: 13, lineHeight: 20, weight: "semibold", display: false },
  caption: { size: 11.5, lineHeight: 16, weight: "semibold", display: false },
  label: { size: 13.5, lineHeight: 18, weight: "bold", display: true },
};

interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
}

export function AppText({ variant = "body", tone = "ink", style, ...rest }: AppTextProps) {
  const theme = useTheme();
  const spec = VARIANT_STYLES[variant];
  const family = (spec.display ? theme.fonts.display : theme.fonts.body)[spec.weight];
  const color =
    tone === "onPrimary"
      ? theme.colors.onPrimary
      : tone === "warn"
        ? theme.colors.warnInk
        : theme.colors[tone];
  return (
    <Text
      {...rest}
      style={[{ fontFamily: family, fontSize: spec.size, lineHeight: spec.lineHeight, color }, style]}
    />
  );
}
