import Svg, { Circle, Ellipse } from "react-native-svg";

/** Huella: logo de Esperanza Animal, copiado del SVG del handoff (web: paw-icon.tsx). */
interface PawIconProps {
  size?: number;
  color: string;
}

export function PawIcon({ size = 24, color }: PawIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} accessibilityElementsHidden>
      <Circle cx="7" cy="8" r="2.4" />
      <Circle cx="12" cy="6" r="2.4" />
      <Circle cx="17" cy="8" r="2.4" />
      <Ellipse cx="12" cy="15" rx="4.5" ry="3.9" />
    </Svg>
  );
}
