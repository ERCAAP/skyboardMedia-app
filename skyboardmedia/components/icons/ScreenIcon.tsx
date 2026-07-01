import Svg, { Rect, Path } from "react-native-svg";

type ScreenIconProps = {
  size?: number;
  color?: string;
  orientation?: "horizontal" | "vertical";
};

export function ScreenIcon({ size = 24, color = "#007AFF", orientation = "horizontal" }: ScreenIconProps) {
  if (orientation === "vertical") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="7" y="3" width="10" height="16" rx="2" stroke={color} strokeWidth="2" fill="none" />
        <Path d="M7 16h10" stroke={color} strokeWidth="2" />
        <Rect x="10" y="20" width="4" height="1" rx="0.5" fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M3 15h18" stroke={color} strokeWidth="2" />
      <Rect x="10" y="20" width="4" height="1" rx="0.5" fill={color} />
    </Svg>
  );
}
